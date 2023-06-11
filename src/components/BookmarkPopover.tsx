import { createSignal } from "solid-js";
import { Popover, PopoverButton, PopoverPanel, Transition } from 'solid-headless'
import usePopper from "solid-popper";
import { RiSystemAddFill } from "solid-icons/ri";

const BookmarkPopover = () => {
	const [anchor, setAnchor] = createSignal<HTMLButtonElement>();
	const [popper, setPopper] = createSignal<HTMLDivElement>();

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
						appear
						show={isOpen()}
					>
						<PopoverPanel ref={setPopper} class="absolute w-screen max-w-sm">
							<div class="flex flex-col bg-white w-full drop-shadow-md overflow-hidden">
								<div class="w-full p-2">
									Add card to collection
								</div>
								<button class="flex space-x-2 w-full bg-neutral-100 p-2">
									<RiSystemAddFill class="h-5 w-5" />
									<p> New Colletion </p>
								</button>
							</div>
						</PopoverPanel>
					</Transition>
				</div>
			)}
		</Popover>
	);
};

export default BookmarkPopover;
