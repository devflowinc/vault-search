import { BiRegularSearch, BiRegularX } from 'solid-icons/bi'
import { Show, createSignal } from 'solid-js'

const SearchForm = () => {
	const [textareaInput, setTextareaInput] = createSignal('')

	const resizeTextarea = (textarea: HTMLTextAreaElement) => {
		textarea.style.height = 'auto'
		textarea.style.height = `${textarea.scrollHeight}px`
		setTextareaInput(textarea.value)
	}

	return (
		<div class="w-full">
			<form
				class="w-full space-y-4 text-neutral-800 dark:text-white"
				onSubmit={(e) => {
					e.preventDefault()
					const searchQuery = encodeURIComponent(textareaInput())
					window.location.href = `/search?q=${searchQuery}`
				}}
			>
				<div class="flex w-full justify-center space-x-2 rounded-xl bg-neutral-100 px-4 py-1 dark:bg-neutral-700 ">
					<BiRegularSearch class="mt-1 h-6 w-6" />
					<textarea
						id="search-query-textarea"
						class="scrollbar-track-rounded-md scrollbar-thumb-rounded-md h-fit max-h-[240px] w-full resize-none whitespace-pre-wrap bg-transparent py-1 scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 focus:outline-none dark:bg-neutral-700 dark:text-white dark:scrollbar-track-neutral-700 dark:scrollbar-thumb-neutral-600"
						placeholder="Search for evidence cards..."
						value={textareaInput()}
						onInput={(e) => resizeTextarea(e.target)}
						onKeyDown={(e) => {
							if (e.ctrlKey && e.key === 'Enter') {
								e.preventDefault()
								const searchQuery = encodeURIComponent(textareaInput())
								window.location.href = `/search?q=${searchQuery}`
							}
						}}
						rows="1"
					/>
					<Show when={textareaInput()}>
						<button
							class="flex flex-col"
							onClick={(e) => {
								e.preventDefault()
								setTextareaInput('')
								resizeTextarea(
									document.getElementById('search-query-textarea') as HTMLTextAreaElement
								)
							}}
						>
							<BiRegularX class="mt-1 h-6 w-6" />
						</button>
					</Show>
				</div>
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
			</form>
		</div>
	)
}

export default SearchForm
