import { BiRegularSearch, BiRegularX } from 'solid-icons/bi'
import { Show, createSignal } from 'solid-js'

const AutoGrowInput = () => {
	const [textareaInput, setTextareaInput] = createSignal('')

	const resizeTextarea = (textarea: HTMLTextAreaElement) => {
		textarea.style.height = 'auto'
		textarea.style.height = `${textarea.scrollHeight}px`
		setTextareaInput(textarea.value)
	}

	return (
		<form class="flex h-full max-h-[calc(100vh-32rem)] w-full flex-col space-y-4 text-neutral-800 dark:text-white">
			<div class="flex w-full justify-center space-x-2 rounded-xl bg-neutral-50 px-4 py-1 dark:bg-neutral-700">
				<BiRegularSearch class="mt-1 h-6 w-6" />
				<textarea
					id="new-message-content-textarea"
					class="scrollbar-track-rounded-md scrollbar-thumb-rounded-md h-fit w-full resize-none whitespace-pre-wrap bg-transparent py-1 scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 focus:outline-none dark:bg-neutral-700 dark:text-white dark:scrollbar-track-neutral-700 dark:scrollbar-thumb-neutral-600"
					placeholder="Search for evidence cards..."
					value={textareaInput()}
					onInput={(e) => resizeTextarea(e.target)}
					onKeyDown={(e) => {
						if (e.ctrlKey && e.key === 'Enter') {
							e.preventDefault()
							return
						}
						if (e.key === 'Enter') {
							e.preventDefault()
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
						}}
					>
						<BiRegularX class="mt-1 h-6 w-6" />
					</button>
				</Show>
			</div>
			<div class="flex flex-row space-x-2 px-40">
				<button
					class="w-fit rounded bg-neutral-50 p-2 hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-800"
					type="submit"
				>
					Search Evidence Vault
				</button>
				<button class="w-fit rounded bg-neutral-50 p-2 hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-800">
					Create Evidence Card
				</button>
			</div>
		</form>
	)
}

export default AutoGrowInput
function afterEffects(arg0: () => void) {
	throw new Error('Function not implemented.')
}
