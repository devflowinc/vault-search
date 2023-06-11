import { BiRegularLogIn, BiRegularX, BiRegularXCircle } from 'solid-icons/bi'
import { JSX, Show, createSignal, onMount } from 'solid-js'
import { isActixApiDefaultError } from '../../utils/apiTypes'
import { FullScreenModal } from './Atoms/FullScreenModal'
import type { TinyMCE } from '../../public/tinymce/tinymce'

const SearchForm = () => {
	const apiHost = import.meta.env.PUBLIC_API_HOST
	const [evidenceLink, setEvidenceLink] = createSignal('')
	const [errorText, setErrorText] = createSignal<
		string | number | boolean | Node | JSX.ArrayElement | null | undefined
	>('')
	const [errorFields, setErrorFields] = createSignal<string[]>([])
	const [isSubmitting, setIsSubmitting] = createSignal(false)
	const [showNeedLoginModal, setShowNeedLoginModal] = createSignal(false)

	const submitEvidence = async (e: Event) => {
		e.preventDefault()
		const cardHTMLContentValue = (window as any).tinymce.activeEditor.getContent()
		const cardTextContentValue = (window as any).tinyMCE.activeEditor.getBody().textContent
		const evidenceLinkValue = evidenceLink()
		if (!cardTextContentValue || !evidenceLinkValue) {
			const errors: string[] = []
			if (!cardTextContentValue) {
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
				content: cardTextContentValue,
				card_html: cardHTMLContentValue,
				link: evidenceLinkValue
			})
		}).then((response) => {
			const searchQuery = encodeURIComponent(
				cardTextContentValue.length > 3800
					? cardTextContentValue.slice(0, 3800)
					: cardTextContentValue
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
		if (errorFields().includes('cardContent')) {
			;(window as any).tinymce.activeEditor.focus()
		}
	}
	onMount(() => {
		let options = {
			selector: '#search-query-textarea',
			height: '100%',
			width: '100%',
			plugins: [
				'advlist',
				'autoresize',
				'autolink',
				'lists',
				'link',
				'image',
				'charmap',
				'preview',
				'anchor',
				'searchreplace',
				'visualblocks',
				'code',
				'fullscreen',
				'insertdatetime',
				'media',
				'table',
				'help',
				'wordcount'
			],
			autoresize_bottom_margin: 150,
			skin: document.documentElement.classList.contains('dark') ? 'oxide-dark' : 'oxide',
			content_css: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
			toolbar:
				'undo redo | blocks | ' +
				'bold italic backcolor | alignleft aligncenter ' +
				'alignright alignjustify | bullist numlist outdent indent | ' +
				'removeformat | help',
			content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
			menubar: false,
			entity_encoding: 'raw',
			entities: '160,nbsp,38,amp,60,lt,62,gt'
		}
		let tinyMCE: TinyMCE = (window as any).tinymce
		tinyMCE.init(options as any)
	})

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

					<textarea id="search-query-textarea" />
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
