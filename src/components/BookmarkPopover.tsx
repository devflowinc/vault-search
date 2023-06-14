import { For, Match, Switch, createSignal } from "solid-js";
import { Popover, PopoverButton, PopoverPanel, Transition } from 'solid-headless'
import usePopper from "solid-popper";
import { RiSystemAddFill } from "solid-icons/ri";
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
		<Popover defaultOpen={true} class="relative">
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
							<div class="flex flex-col bg-white w-full drop-shadow-md overflow-hidden">
								<div class="w-full font-bold p-2 text-lg">
									Add card to collection
								</div>
								<For each={props.cardCollections}>
									{(collection) => (
										<div>
											<div class="w-full p-2">
												{collection.name}
											</div>
										</div>

									)}
								</For>
								{showCollectionForm() && (
									<div class="p-2">
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
												{
													label: "Description",
													inputValue: collectionFormDescription,
													setInputValue: setCollectionFormDescription,
													type: "textarea"
												}
											]}
										/>
									</div>
								)}
								{!showCollectionForm() && (
									<div onClick={() => { setShowCollectionForm(true) }} class="flex space-x-2 w-full bg-neutral-100 p-2">
										<RiSystemAddFill class="h-5 w-5" />
										<p> New Colletion </p>
									</div>
								)}
							</div>
						</PopoverPanel>
					</Transition>
				</div>
			)}
		</Popover>
	);
};

export default BookmarkPopover;
