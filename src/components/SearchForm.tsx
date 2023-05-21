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
		<form class="relative flex h-full max-h-[calc(100vh-32rem)] w-full flex-col items-center overflow-y-auto rounded-xl bg-neutral-50 px-4 py-1 text-neutral-800 dark:bg-neutral-700 dark:text-white">
			<div class="flex w-full space-x-2">
				<BiRegularSearch class="h-6 w-6 mt-1" />
				<textarea
					id="new-message-content-textarea"
					class="scrollbar-track-rounded-md scrollbar-thumb-rounded-md h-fit w-full resize-none whitespace-pre-wrap bg-transparent py-1 scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 focus:outline-none dark:bg-neutral-700 dark:text-white dark:scrollbar-track-neutral-700 dark:scrollbar-thumb-neutral-600"
					placeholder="Search for evidence..."
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
						<BiRegularX class="h-6 w-6 mt-1" />
					</button>
				</Show>
			</div>
		</form>
	)
}

export default AutoGrowInput
function afterEffects(arg0: () => void) {
	throw new Error('Function not implemented.')
}
