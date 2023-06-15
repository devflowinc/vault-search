import { For, Match, Switch, createSignal } from "solid-js";
import { Menu, MenuItem, Popover, PopoverButton, PopoverPanel, Transition } from 'solid-headless'
import usePopper from "solid-popper";
import { RiSystemAddFill, RiSystemCheckFill } from "solid-icons/ri";
import type { CardCollectionDTO, ScoreCardDTO } from "../../utils/apiTypes";
import InputRowsForm from "./Atoms/InputRowsForm";

export interface BookmarkPopoverProps {
	card: ScoreCardDTO,
	cardCollections: CardCollectionDTO[]
}

const BookmarkPopover = (props: BookmarkPopoverProps) => {
	const apiHost = import.meta.env.PUBLIC_API_HOST

	const [anchor, setAnchor] = createSignal<HTMLButtonElement>();
	const [popper, setPopper] = createSignal<HTMLDivElement>();

	const [showCollectionForm, setShowCollectionForm] = createSignal(false);

	const [collectionFormTitle, setCollectionFormTitle] = createSignal("");
	const [collectionFormDescription, setCollectionFormDescription] = createSignal("");

	usePopper(anchor, popper, {
		placement: 'auto',
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [10, 20],
				},
			},
			{
				name: 'preventOverflow',
			},
		],
	});

	return (
		<Popover defaultOpen={false} class="relative">
			{({ isOpen }) => (
				<div>
					<PopoverButton ref={setAnchor}>
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
						<PopoverPanel unmount={false} ref={setPopper} class="absolute w-screen max-w-sm">
							<Menu class="flex flex-col bg-white w-full drop-shadow-md overflow-hidden">
								<div class="w-full font-bold p-2 text-lg">
									Add card to collection
								</div>
								<MenuItem as="button" aria-label="Empty" />
								<For each={props.cardCollections}>
									{(collection) => {
										return (
											<MenuItem
												class="flex justify-between p-2 hover:bg-gray-100"
												onClick={() => {
													fetch(`${apiHost}/card_collection/${collection.id}`, {
														method: 'POST',
														headers: {
															'Content-Type': 'application/json'
														},
														credentials: 'include',
														body: JSON.stringify({
															card_metadata_id: props.card.metadata.id,
														})
													}).then((response) => {
														if (response.ok) {
															response.json().then((data) => {
																console.log(data)
															})
														} else {
															response.json().then((data) => {
																console.log(data)
															})
														}
													});
												}}
												as="button">
												<p>{collection.name} </p>
												<div class="rounded-md text-white px-2 bg-magenta-500">
													save
												</div>
											</MenuItem>
										);
									}}
								</For>
								{showCollectionForm() && (
									<InputRowsForm
										createButtonText="Create collection"
										onCreate={() => {
											fetch(`${apiHost}/card_collection`, {
												method: 'POST',
												headers: {
													'Content-Type': 'application/json'
												},
												credentials: 'include',
												body: JSON.stringify({
													name: collectionFormTitle(),
													description: collectionFormDescription(),
													is_public: true,
												})
											}).then((response) => {
												if (response.ok) {
													response.json().then((data) => {
														console.log(data)
													})
												} else {
													response.json().then((data) => {
														console.log(data)
													})
												}
											});
										}}
										onCancel={() => {
											setShowCollectionForm(false);
										}}
										inputGroups={[
											{
												label: "Title",
												inputValue: collectionFormTitle,
												setInputValue: setCollectionFormTitle
											},
										]}
									/>
								)}
								{!showCollectionForm() && (
									<MenuItem as="button" onClick={() => { setShowCollectionForm(true) }} class="flex space-x-2 w-full bg-neutral-100 p-2">
										<RiSystemAddFill class="h-5 w-5" />
										<p> New Colletion </p>
									</MenuItem>
								)}
							</Menu>
						</PopoverPanel>
					</Transition>
				</div>
			)}
		</Popover>
	);
};

export default BookmarkPopover;
