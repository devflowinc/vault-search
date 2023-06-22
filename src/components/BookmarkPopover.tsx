import { For, createSignal } from 'solid-js'
import { Menu, MenuItem, Popover, PopoverButton, PopoverPanel, Transition } from 'solid-headless'
import { RiSystemAddFill } from 'solid-icons/ri'
import type { CardCollectionDTO, ScoreCardDTO } from '../../utils/apiTypes'
import InputRowsForm from './Atoms/InputRowsForm'

export interface BookmarkPopoverProps {
	card: ScoreCardDTO
	cardCollections: CardCollectionDTO[]
	fetchCardCollections: () => void
}

const BookmarkPopover = (props: BookmarkPopoverProps) => {
	const apiHost = import.meta.env.PUBLIC_API_HOST

	const [showCollectionForm, setShowCollectionForm] = createSignal(false)

	const [collectionFormTitle, setCollectionFormTitle] = createSignal('')

	return (
		<Popover defaultOpen={false} class="relative">
			{({ isOpen, setState }) => (
				<div>
					<PopoverButton>
						<RiSystemAddFill class="h-5 w-5" />
					</PopoverButton>
					<Transition
						show={isOpen()}
						enter="transition duration-200"
						enterFrom="opacity-0 translate-y-2"
						enterTo="opacity-100 translate-y-0"
						leave="transition duration-200"
						leaveFrom="opacity-100 translate-y-0"
						leaveTo="opacity-0 translate-y-2"
					>
						<PopoverPanel unmount={false} class="absolute w-screen max-w-sm">
							<Menu class="flex w-full flex-col overflow-hidden bg-white drop-shadow-md dark:bg-shark-500">
								<div class="w-full p-2 text-lg font-bold">Add card to collection</div>
								<MenuItem as="button" aria-label="Empty" />
								<For each={props.cardCollections}>
									{(collection) => {
										return (
											<PopoverButton
												class="flex justify-between p-2 hover:bg-gray-100 dark:hover:bg-neutral-500/80"
												onClick={() => {
													fetch(`${apiHost}/card_collection/${collection.id}`, {
														method: 'POST',
														headers: {
															'Content-Type': 'application/json'
														},
														credentials: 'include',
														body: JSON.stringify({
															card_metadata_id: props.card.metadata.id
														})
													}).then((response) => {
														if (response.ok) {
														}
													})
													setState(true)
												}}
												as="button"
											>
												<p>{collection.name} </p>
												<div class="rounded-md bg-magenta-500 px-2 text-white dark:bg-turquoise-400 dark:text-black">
													save
												</div>
											</PopoverButton>
										)
									}}
								</For>
								{showCollectionForm() && (
									<div class="bg-gray-100 dark:bg-neutral-500/80">
										<div class="px-2 pt-2 text-lg font-bold">New Collection</div>
										<InputRowsForm
											createButtonText="Create collection"
											onCreate={() => {
												const title = collectionFormTitle()
												if (title.trim() == '') return

												fetch(`${apiHost}/card_collection`, {
													method: 'POST',
													headers: {
														'Content-Type': 'application/json'
													},
													credentials: 'include',
													body: JSON.stringify({
														name: title,
														description: '',
														is_public: true
													})
												}).then(() => {
													props.fetchCardCollections()
													setShowCollectionForm(false)
													setCollectionFormTitle('')
													setState(true)
												})
											}}
											onCancel={() => {
												setShowCollectionForm(false)
												setState(true)
											}}
											inputGroups={[
												{
													label: 'Title',
													inputValue: collectionFormTitle,
													setInputValue: setCollectionFormTitle
												}
											]}
										/>
									</div>
								)}
								{!showCollectionForm() && (
									<MenuItem
										as="button"
										onClick={() => {
											setShowCollectionForm(true)
											setState(true)
										}}
										class="flex w-full space-x-2 bg-neutral-100 p-2 dark:bg-neutral-500/80"
									>
										<RiSystemAddFill class="h-5 w-5" />
										<p> New Collection </p>
									</MenuItem>
								)}
							</Menu>
						</PopoverPanel>
					</Transition>
				</div>
			)}
		</Popover>
	)
}

export default BookmarkPopover
