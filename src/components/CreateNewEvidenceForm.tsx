import { BiRegularSearch, BiRegularX } from 'solid-icons/bi'
import { Show, createEffect, createSignal } from 'solid-js'

const SearchForm = () => {
	const apiHost = import.meta.env.PUBLIC_API_HOST

	const [isLoadingUser, setIsLoadingUser] = createSignal(true)
	const [cardContent, setCardContent] = createSignal('')
	const [evidenceLink, setEvidenceLink] = createSignal('')
	const [errorFields, setErrorFields] = createSignal<string[]>([])
	const [isSubmitting, setIsSubmitting] = createSignal(false)

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
	}

	createEffect(() => {
		fetch(`${apiHost}/auth`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}).then((response) => {
			if (response.ok) {
				setIsLoadingUser(false)
				return
			}
			window.location.href = '/auth/register'
		})
	})

	return (
		<>
			<Show when={isLoadingUser()}>
				<div class="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-neutral-900 dark:border-white mx-auto mt-16"></div>
			</Show>
			<Show when={!isLoadingUser()}>
				<form
					class="flex h-full max-h-[calc(100vh-32rem)] w-full flex-col space-y-4 text-neutral-800 dark:text-white"
					onSubmit={(e) => {
						e.preventDefault()
						submitEvidence(e)
					}}
				>
					<div class="flex flex-col space-y-2">
						<div>Link to evidence*</div>
						<input
							type="url"
							value={evidenceLink()}
							onInput={(e) => setEvidenceLink(e.target.value)}
							classList={{
								'w-fullbg-neutral-50 rounded-md px-4 py-1 dark:bg-neutral-700': true,
								'border border-red-500': errorFields().includes('evidenceLink')
							}}
						/>
					</div>
					<div class="flex flex-col space-y-2">
						<div>Card Content*</div>
						<div
							classList={{
								'flex w-full justify-center space-x-2 rounded-md bg-neutral-50 px-4 py-1 dark:bg-neutral-700':
									true,
								'border border-red-500': errorFields().includes('cardContent')
							}}
						>
							<textarea
								id="search-query-textarea"
								class="scrollbar-track-rounded-md scrollbar-thumb-rounded-md h-fit min-h-[150px] w-full resize-none whitespace-pre-wrap bg-transparent py-1 scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 focus:outline-none dark:bg-neutral-700 dark:text-white dark:scrollbar-track-neutral-700 dark:scrollbar-thumb-neutral-600"
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
							class="w-fit rounded bg-neutral-50 p-2 hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-800"
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
			</Show>
		</>
	)
}

export default SearchForm
