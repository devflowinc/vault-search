import { BiRegularSearch, BiRegularX } from 'solid-icons/bi'
import { VsTriangleDown } from 'solid-icons/vs'
import { Show, createSignal } from 'solid-js'
import { Combobox, ComboboxItem, ComboboxSection } from './Atoms/ComboboxChecklist'
import { Menu, MenuItem, Popover, PopoverButton, PopoverPanel, Transition } from 'solid-headless'

const filterComboboxSections: ComboboxSection[] = [
	{
		name: 'Year',
		comboboxItems: [
			{
				name: '2014'
			},
			{
				name: '2015'
			},
			{
				name: '2016'
			}
		]
	},
	{
		name: 'Data set',
		comboboxItems: [
			{
				name: 'COCO'
			},
			{
				name: 'OpenImages'
			},
			{
				name: 'VisualGenome'
			},
			{
				name: 'LVIS'
			},
			{
				name: 'COCO'
			},
			{
				name: 'OpenImages'
			},
			{
				name: 'VisualGenome'
			},
			{
				name: 'LVIS'
			}
		]
	}
]

const SearchForm = (props: { query?: string; filters: string[] }) => {
	const initialQuery = props.query || ''
	const [textareaInput, setTextareaInput] = createSignal(initialQuery)
	const [selectedComboboxItems, setSelectedComboboxItems] = createSignal<ComboboxItem[]>([])

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
		const filters = encodeURIComponent(
			selectedComboboxItems()
				.map((item) => item.name)
				.join(',')
		)
		window.location.href = `/search?q=${searchQuery}` + (filters ? `&filters=${filters}` : '')
	}

	return (
		<div class="w-full">
			<form class="w-full space-y-4 text-neutral-800 dark:text-white" onSubmit={onSubmit}>
				<div class="flex space-x-2">
					<div class="flex w-full justify-center space-x-2 rounded-md bg-neutral-100 px-4 py-1 dark:bg-neutral-700 ">
						<Show when={!props.query}>
							<BiRegularSearch class="mt-1 h-6 w-6" />
						</Show>
						<textarea
							id="search-query-textarea"
							class="scrollbar-track-rounded-md scrollbar-thumb-rounded-md mr-2 h-fit max-h-[240px] w-full resize-none whitespace-pre-wrap bg-transparent py-1 scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 focus:outline-none dark:bg-neutral-700 dark:text-white dark:scrollbar-track-neutral-700 dark:scrollbar-thumb-neutral-600"
							placeholder="Search for cards..."
							value={textareaInput()}
							onInput={(e) => resizeTextarea(e.target)}
							onKeyDown={(e) => {
								if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
									onSubmit(e)
								}
							}}
							rows="1"
						/>
						<Show when={textareaInput()}>
							<button
								classList={{
									'pt-[2px]': !!props.query
								}}
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
					<Popover defaultOpen={false} class="relative">
						{({ isOpen, setState }) => (
							<>
								<PopoverButton
									aria-label="Toggle filters"
									type="button"
									class="flex items-center space-x-1 rounded-md bg-neutral-100 p-2 text-center hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-800"
								>
									<span>Filters</span> <VsTriangleDown class="h-4 w-4" />
								</PopoverButton>
								<Transition
									show={isOpen()}
									enter="transition duration-200"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="transition duration-150"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<PopoverPanel
										unmount={false}
										class="absolute z-10 mt-2 h-fit w-[180px] -translate-x-[100px] rounded-md bg-neutral-100 p-1 shadow-lg dark:bg-neutral-700"
									>
										<Menu class="h-0">
											<MenuItem class="h-0" as="button" aria-label="Empty" />
										</Menu>
										<Combobox
											selectedComboboxItems={selectedComboboxItems}
											setSelectedComboboxItems={setSelectedComboboxItems}
											comboboxSections={filterComboboxSections}
											setPopoverOpen={setState}
										/>
									</PopoverPanel>
								</Transition>
							</>
						)}
					</Popover>
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
