import { Menu, MenuItem, Popover, PopoverPanel } from 'solid-headless'
import { Accessor, Setter, For, createEffect, createMemo, createSignal, onCleanup } from 'solid-js'
import { FiExternalLink } from 'solid-icons/fi'
import { FaSolidCheck } from 'solid-icons/fa'
import { selectedComboboxItems, setSelectedComboboxItems } from '../FilterStore'
export interface comboboxItem {
	name: string
	eventId: string
}

export const Combobox = () => {
	const [panelOpen, sePanelOpen] = createSignal(false)
	const [usingPanel, setUsingPanel] = createSignal(false)
	const [inputValue, setInputValue] = createSignal('')
	const comboboxItems: comboboxItem[] = [
		{ name: 'Policy', eventId: 'policy' },
		{ name: 'LD', eventId: 'ld' }
	]
	const filteredOptionsWithIsSelected = createMemo(() => {
		const selected = selectedComboboxItems()
		const optionsWithSelected = comboboxItems.map((option) => {
			const isSelected = selected.some(
				(selectedOption) => selectedOption.eventId === option.eventId
			)
			return {
				...option,
				isSelected
			}
		})

		if (!inputValue()) return optionsWithSelected
		return optionsWithSelected.filter((option) =>
			option.name.toLowerCase().includes(inputValue().toLowerCase())
		)
	})

	createEffect(() => {
		const handler = (e: Event) => {
			if (!e.target) return
			if (!(e.target as HTMLElement).closest('.afCombobox')) {
				sePanelOpen(false)
				setInputValue('')
			}
		}
		document.addEventListener('click', handler)

		onCleanup(() => {
			document.removeEventListener('click', handler)
		})
	})
	const onSelect = (option: comboboxItem) => {
		setSelectedComboboxItems((prev) => {
			const prevIncludesOption = prev.find((prevOption) => {
				return prevOption.eventId === option.eventId
			})
			if (!prevIncludesOption) {
				return [...prev, option]
			}
			return prev.filter((prevOption) => prevOption.eventId !== option.eventId)
		})
	}
	const placeholder = createMemo(() => {
		let placeholder = ''
		const selected = selectedComboboxItems()
		selected.forEach((option) => {
			placeholder != '' && (placeholder += ', ')
			placeholder += option.name
		})
		return placeholder
	})

	return (
		<div class="afCombobox w-full">
			<Popover class="relative w-full" defaultOpen={false}>
				<input
					class="w-full rounded border border-fuchsia-300 bg-white px-2 text-black dark:border-white dark:bg-slate-900 dark:text-white"
					type="text"
					onFocus={() => sePanelOpen(true)}
					onBlur={() => !usingPanel() && sePanelOpen(false)}
					value={inputValue()}
					onInput={(e) => setInputValue(e.currentTarget.value)}
					placeholder={placeholder()}
				/>
				<PopoverPanel
					unmount={false}
					classList={{
						'absolute w-full left-1/2 z-10 mt-1 -translate-x-1/2 transform p-2 bg-pink-300 dark:bg-gray-800 rounded-lg':
							true,
						hidden: !panelOpen()
					}}
					onMouseEnter={() => {
						setUsingPanel(true)
					}}
					onMouseLeave={() => {
						setUsingPanel(false)
					}}
				>
					<Menu class="flex w-full flex-col space-y-1 overflow-y-auto overflow-x-hidden rounded bg-pink-50 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
						<For each={filteredOptionsWithIsSelected()}>
							{(option) => {
								const onClick = (e: Event) => {
									e.stopPropagation()
									onSelect(option)
								}

								return (
									<MenuItem
										as="button"
										class="afCombobox flex items-center justify-between rounded p-1 focus:bg-rose-400 focus:text-black focus:outline-none dark:hover:bg-orange-500 dark:hover:text-white dark:focus:bg-orange-500 dark:focus:text-white"
										onClick={onClick}
									>
										<div class="flex flex-row justify-start space-x-2">
											<span class="text-left">{option.name}</span>
										</div>
										{option.isSelected && (
											<span>
												<FaSolidCheck class="text-xl" />
											</span>
										)}
									</MenuItem>
								)
							}}
						</For>
					</Menu>
				</PopoverPanel>
			</Popover>
		</div>
	)
}
