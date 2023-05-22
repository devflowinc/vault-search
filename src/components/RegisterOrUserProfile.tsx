import { Menu, MenuItem, Popover, PopoverButton, PopoverPanel, Transition } from 'solid-headless'
import {
	BiRegularLogIn,
	BiRegularLogOut,
	BiRegularSearch,
	BiRegularUser,
	BiRegularX
} from 'solid-icons/bi'
import { BsMoonStars, BsSun } from 'solid-icons/bs'
import { CgScreen } from 'solid-icons/cg'
import { Show, createEffect, createSignal } from 'solid-js'

const RegisterOrUserProfile = () => {
	const apiHost = import.meta.env.PUBLIC_API_HOST

	const [isLoadingUser, setIsLoadingUser] = createSignal(true)
	const [signedInUser, setSignedInUser] = createSignal(false)

	const logout = () => {
		void fetch(`${apiHost}/auth`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}).then((response) => {
			if (!response.ok) {
				return
			}
			window.location.href = '/'
		})
	}

	createEffect(() => {
		fetch(`${apiHost}/auth`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}).then((response) => {
			if (response.ok) {
				setSignedInUser(true)
			}
			setIsLoadingUser(false)
		})
	})

	return (
		<div class="ml-2">
			<Show when={!isLoadingUser()}>
				<Show when={!signedInUser()}>
					<a
						class="ml-4 sm:ml-6 flex space-x-2 rounded-md bg-turquoise-500 p-2 text-neutral-900"
						href="/auth/register"
					>
						Register
						<BiRegularLogIn class="h-6 w-6" />
					</a>
				</Show>
				<Show when={signedInUser()}>
					<Popover defaultOpen={false} class="relative flex items-center">
						{({ isOpen }) => (
							<>
								<PopoverButton aria-label="Toggle user actions menu" classList={{}}>
									<BiRegularUser class="h-6 w-6" />
								</PopoverButton>
								<Transition
									show={isOpen()}
									enter="transition duration-200"
									enterFrom="opacity-0 -translate-y-1 scale-50"
									enterTo="opacity-100 translate-y-0 scale-100"
									leave="transition duration-150"
									leaveFrom="opacity-100 translate-y-0 scale-100"
									leaveTo="opacity-0 -translate-y-1 scale-50"
								>
									<PopoverPanel
										unmount={true}
										class="absolute left-1/2 z-10 mt-5 -translate-x-[90%] transform px-4 sm:px-0"
									>
										<Menu class="flex flex-col space-y-1 overflow-hidden rounded-lg border border-slate-900 bg-neutral-50 p-1 shadow-lg drop-shadow-lg dark:bg-neutral-700 dark:text-white">
											<MenuItem as="button" aria-label="Empty" />
											<MenuItem
												as="button"
												class="flex space-x-2 rounded-md px-2 py-1 hover:cursor-pointer focus:bg-neutral-100 focus:outline-none dark:hover:bg-neutral-600 dark:hover:bg-none dark:focus:bg-neutral-600"
												onClick={logout}
											>
												<BiRegularLogOut class="h-6 w-6" />
												<div class="text-md font-medium">Logout</div>
											</MenuItem>
										</Menu>
									</PopoverPanel>
								</Transition>
							</>
						)}
					</Popover>
				</Show>
			</Show>
		</div>
	)
}

export default RegisterOrUserProfile
