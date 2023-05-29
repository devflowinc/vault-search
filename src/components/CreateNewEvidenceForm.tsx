import { BiRegularLogIn, BiRegularX, BiRegularXCircle } from 'solid-icons/bi'
import { JSX, Show, createSignal } from 'solid-js'
import { isActixApiDefaultError } from '../../utils/apiTypes'
import { FullScreenModal } from './FullScreenModal'

const SearchForm = () => {
	const apiHost = import.meta.env.PUBLIC_API_HOST

	const [cardContent, setCardContent] = createSignal('')
	const [evidenceLink, setEvidenceLink] = createSignal('')
	const [errorText, setErrorText] = createSignal<
		string | number | boolean | Node | JSX.ArrayElement | null | undefined
	>('')
	const [errorFields, setErrorFields] = createSignal<string[]>([])
	const [isSubmitting, setIsSubmitting] = createSignal(false)
	const [showNeedLoginModal, setShowNeedLoginModal] = createSignal(false)

	const resizeTextarea = (textarea: HTMLTextAreaElement) => {
		textarea.style.height = 'auto'
		textarea.style.height = `${textarea.scrollHeight}px`
		setCardContent(textarea.value)
	}

	const submitEvidence = async (e: Event) => {
		e.preventDefault()
		const cardContentValue = cardContent()
		const evidenceLinkValue = evidenceLink()
		if (!cardContentValue || !evidenceLinkValue) {
			const errors: string[] = []
			if (!cardContentValue) {
				errors.push('cardContent')
			}
			if (!evidenceLinkValue) {
				errors.push('evidenceLink')
			}
			setErrorFields(errors)
			return
		}
		setErrorFields([])
		setIsSubmitting(true)
		fetch(`${apiHost}/card`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				content: cardContentValue,
				link: evidenceLinkValue
			})
		}).then((response) => {
			const searchQuery = encodeURIComponent(
				cardContentValue.length > 3800 ? cardContentValue.slice(0, 3800) : cardContentValue
			)
			const newHref = `/search?q=${searchQuery}`

			if (response.status === 204) {
				window.location.href = newHref
				return
			}
			if (response.status === 401) {
				setShowNeedLoginModal(true)
				setIsSubmitting(false)
				return
			}

			response.json().then((data) => {
				if (isActixApiDefaultError(data)) {
					setErrorFields(['cardContent'])
					const newErrorText =
						data.message === 'Card already exists' ? (
							<a class="underline" href={newHref}>
								Content with same meaning already exists, view it here
							</a>
						) : (
							data.message
						)
					setErrorText(newErrorText)
					setIsSubmitting(false)
					return
				}
			})
		})
	}

	return (
		<>
			<form
				class="my-8 flex h-full w-full flex-col space-y-4 text-neutral-800 dark:text-white"
				onSubmit={(e) => {
					e.preventDefault()
					submitEvidence(e)
				}}
			>
				<div class="text-center text-red-500">{errorText()}</div>
				<div class="flex flex-col space-y-2">
					<div>Link to evidence*</div>
					<input
						type="url"
						value={evidenceLink()}
						onInput={(e) => setEvidenceLink(e.target.value)}
						classList={{
							'w-full bg-neutral-100 rounded-md px-4 py-1 dark:bg-neutral-700': true,
							'border border-red-500': errorFields().includes('evidenceLink')
						}}
					/>
				</div>
				<div class="flex flex-col space-y-2">
					<div>Card Content*</div>
					<div
						classList={{
							'flex w-full justify-center space-x-2 rounded-md bg-neutral-100 px-4 py-1 dark:bg-neutral-700':
								true,
							'border border-red-500': errorFields().includes('cardContent')
						}}
					>
						<textarea
							id="search-query-textarea"
							class="scrollbar-track-rounded-md scrollbar-thumb-rounded-md h-fit max-h-[50vh] min-h-[150px] w-full resize-none whitespace-pre-wrap bg-transparent py-1 scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 focus:outline-none dark:bg-neutral-700 dark:text-white dark:scrollbar-track-neutral-700 dark:scrollbar-thumb-neutral-600"
							placeholder="Enter the content for your card..."
							value={cardContent()}
							onInput={(e) => resizeTextarea(e.target)}
							onKeyDown={(e) => {
								if (e.ctrlKey && e.key === 'Enter') {
									submitEvidence(e)
									return
								}
							}}
							rows="1"
						/>
						<Show when={cardContent()}>
							<button
								class="flex flex-col"
								onClick={(e) => {
									e.preventDefault()
									setCardContent('')
									resizeTextarea(
										document.getElementById('search-query-textarea') as HTMLTextAreaElement
									)
								}}
							>
								<BiRegularX class="mt-1 h-6 w-6" />
							</button>
						</Show>
					</div>
				</div>
				<div class="flex flex-row space-x-2">
					<button
						class="w-fit rounded bg-neutral-100 p-2 hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-800"
						type="submit"
						disabled={isSubmitting()}
					>
						<Show when={!isSubmitting()}>Submit New Evidence</Show>
						<Show when={isSubmitting()}>
							<div class="animate-pulse">Submitting...</div>
						</Show>
					</button>
				</div>
			</form>
			<Show when={showNeedLoginModal()}>
				<FullScreenModal isOpen={showNeedLoginModal} setIsOpen={setShowNeedLoginModal}>
					<div class="min-w-[250px] sm:min-w-[300px]">
						<BiRegularXCircle class="mx-auto h-8 w-8 !text-red-500" />
						<div class="mb-4 text-xl font-bold">Cannot add evidence without an account</div>
						<div class="mx-auto flex w-fit flex-col space-y-3">
							<a
								class="flex space-x-2 rounded-md bg-magenta-500 p-2 text-white"
								href="/auth/register"
							>
								Register
								<BiRegularLogIn class="h-6 w-6" />
							</a>
						</div>
					</div>
				</FullScreenModal>
			</Show>
		</>
	)
}

export default SearchForm
