import { Menu, MenuItem, Popover, PopoverPanel } from 'solid-headless'
import { Accessor, For, Setter, createEffect, createMemo, createSignal, onCleanup } from 'solid-js'
import { FaSolidCheck } from 'solid-icons/fa'
import { BiRegularSearchAlt } from 'solid-icons/bi'
export interface ComboboxItem {
	name: string
}
export interface ComboboxSection {
	name: string
	comboboxItems: ComboboxItem[]
}

export interface ComboboxProps {
	comboboxSections: ComboboxSection[]
	selectedComboboxItems: Accessor<ComboboxItem[]>
	setSelectedComboboxItems: Setter<ComboboxItem[]>
	setPopoverOpen: (newState: boolean) => void
}

export const Combobox = (props: ComboboxProps) => {
	const [usingPanel, setUsingPanel] = createSignal(false)
	const [inputValue, setInputValue] = createSignal('')

	const filteredSectionsWithIsSelected = createMemo(() => {
		const selected = props.selectedComboboxItems()
		const sectionsWithSelected = props.comboboxSections.map((section) => {
			return {
				sectionName: section.name,
				sectionSelectedItems: section.comboboxItems.map((option) => {
					const isSelected = selected.some((selectedOption) => selectedOption.name === option.name)
					return {
						...option,
						isSelected
					}
				})
			}
		})

		if (!inputValue()) return sectionsWithSelected
		return sectionsWithSelected.map((section) => {
			return {
				...section,
				sectionSelectedItems: section.sectionSelectedItems.filter((option) => {
					return option.name.toLowerCase().includes(inputValue().toLowerCase())
				})
			}
		})
	})

	const onSelect = (option: ComboboxItem) => {
		props.setSelectedComboboxItems((prev) => {
			const prevIncludesOption = prev.find((prevOption) => {
				return prevOption.name === option.name
			})
			if (!prevIncludesOption) {
				return [...prev, option]
			}
			return prev.filter((prevOption) => prevOption.name !== option.name)
		})
		props.setPopoverOpen(true)
	}

	const placeholder = createMemo(() => {
		let placeholder = ''
		const selected = props.selectedComboboxItems()
		selected.forEach((option) => {
			placeholder != '' && (placeholder += ', ')
			placeholder += option.name
		})
		return placeholder
	})

	return (
		<div class="w-full">
			<div class="flex w-fit items-center space-x-2 rounded bg-white px-2 focus:outline-black dark:bg-neutral-600 dark:focus:outline-white">
				<BiRegularSearchAlt class="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
				<input
					class="w-full bg-transparent focus:outline-none"
					type="text"
					onBlur={() => !usingPanel()}
					value={inputValue()}
					onInput={(e) => setInputValue(e.currentTarget.value)}
					placeholder={placeholder()}
				/>
			</div>
			<div
				class="mt-1 max-h-[40vh] w-full transform overflow-y-scroll rounded p-2"
				onMouseEnter={() => {
					setUsingPanel(true)
				}}
				onMouseLeave={() => {
					setUsingPanel(false)
				}}
			>
				<For each={filteredSectionsWithIsSelected()}>
					{({ sectionName, sectionSelectedItems }) => {
						return (
							<div>
								<div class="text-sm font-semibold"> {sectionName} </div>
								<div class="ml-1 space-y-1">
									<For each={sectionSelectedItems}>
										{(option) => {
											const onClick = (e: Event) => {
												e.preventDefault()
												e.stopPropagation()
												onSelect(option)
											}

											return (
												<button
													type="button"
													classList={{
														'flex w-full items-center justify-between rounded p-1 focus:text-black focus:outline-none dark:hover:text-white dark:focus:text-white':
															true,
														'bg-neutral-200 dark:bg-neutral-800': option.isSelected
													}}
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
												</button>
											)
										}}
									</For>
								</div>
							</div>
						)
					}}
				</For>
			</div>
		</div>
	)
}
