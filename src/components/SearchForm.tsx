import { BiRegularSearch, BiRegularX } from 'solid-icons/bi'
import { Show, createSignal } from 'solid-js'
import { TbMinusVertical } from 'solid-icons/tb'
import { selectedComboboxItems } from '../FilterStore'

const SearchForm = (props: { query?: string }) => {
	const initialQuery = props.query || ''
	const [textareaInput, setTextareaInput] = createSignal(initialQuery)

	const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
		if (!textarea) return

		textarea.style.height = `${textarea.scrollHeight}px`
		setTextareaInput(textarea.value)
	}
	const onSubmit = (e: Event) => {
		e.preventDefault()
		const textAreaValue = textareaInput()
		const searchQuery = encodeURIComponent(
			textAreaValue.length > 3800 ? textAreaValue.slice(0, 3800) : textAreaValue
		)
		const filters = selectedComboboxItems()
			.map((item) => item.eventId)
			.join(',')
		window.location.href = `/search?q=${searchQuery}&filters=${filters}`
	}
	return (
		<div class="w-full">
			<form class="w-full space-y-4 text-neutral-800 dark:text-white" onSubmit={onSubmit}>
				<div class="flex w-full justify-center space-x-2 rounded-xl bg-neutral-100 px-4 py-1 dark:bg-neutral-700 ">
					<Show when={!props.query}>
						<BiRegularSearch class="mt-1 h-6 w-6" />
					</Show>
					<textarea
						id="search-query-textarea"
						class="scrollbar-track-rounded-md scrollbar-thumb-rounded-md mr-2 h-fit max-h-[240px] w-full resize-none whitespace-pre-wrap bg-transparent py-1 scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 focus:outline-none dark:bg-neutral-700 dark:text-white dark:scrollbar-track-neutral-700 dark:scrollbar-thumb-neutral-600"
						placeholder="Search for evidence cards..."
						value={textareaInput()}
						onInput={(e) => resizeTextarea(e.target)}
						onKeyDown={(e) => {
							if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
								onSubmit(e)
							}
							if (!e.shiftKey && e.key === 'Enter') {
								e.preventDefault()
								const searchQuery = encodeURIComponent(textareaInput())
								window.location.href = `/search?q=${searchQuery}`
							}
						}}
						rows="1"
					>
						{textareaInput() || props.query}
					</textarea>
					<Show when={textareaInput()}>
						<button
							onClick={(e) => {
								e.preventDefault()
								setTextareaInput('')
								resizeTextarea(
									document.getElementById('search-query-textarea') as HTMLTextAreaElement
								)
							}}
						>
							<BiRegularX class="h-7 w-7" />
						</button>
					</Show>
					<Show when={props.query}>
						<button
							classList={{
								'border-l border-neutral-600 pl-1 dark:border-neutral-200': !!textareaInput()
							}}
							type="submit"
						>
							<BiRegularSearch class="mt-1 h-6 w-6" />
						</button>
					</Show>
				</div>
				<Show when={!props.query}>
					<div class="flex flex-row justify-center space-x-2 px-6 md:px-40">
						<button
							class="w-fit rounded bg-neutral-100 p-2 text-center hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-800"
							type="submit"
						>
							Search Evidence Vault
						</button>
						<a
							class="w-fit rounded bg-neutral-100 p-2 text-center hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-800"
							href="/create"
						>
							Create Evidence Card
						</a>
					</div>
				</Show>
			</form>
		</div>
	)
}

export default SearchForm
