import { Transition } from 'solid-headless'
import { BiRegularX } from 'solid-icons/bi'
import { Show, createEffect, createSignal } from 'solid-js'

const SearchForm = () => {
	const apiHost = import.meta.env.PUBLIC_API_HOST

	const [isLoadingUser, setIsLoadingUser] = createSignal(true)
	const [username, setUsername] = createSignal('')
	const [hideEmail, setHideEmail] = createSignal(false)
	const [errorFields, setErrorFields] = createSignal<string[]>([])
	const [isSubmitting, setIsSubmitting] = createSignal(false)

	const updateUser = async (e: Event) => {}

	createEffect(() => {
		fetch(`${apiHost}/auth`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}).then((response) => {
			if (response.ok) {
				setIsLoadingUser(false)
				return
			}
			window.location.href = '/auth/register'
		})
	})

	return (
		<>
			<Transition
				show={isLoadingUser()}
				enter="transition duration-400"
				enterFrom="opacity-0 -translate-y-1 scale-50"
				enterTo="opacity-100 translate-y-0 scale-100"
				leave="transition duration-150"
				leaveFrom="opacity-100 translate-y-0 scale-100"
				leaveTo="opacity-0 -translate-y-1 scale-50"
			>
				<div class="mx-auto mt-16 h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-neutral-900 dark:border-white"></div>
			</Transition>
			<Transition
				show={!isLoadingUser()}
				enter="transition duration-600"
				enterFrom="opacity-0 -translate-y-1 scale-50"
				enterTo="opacity-100 translate-y-0 scale-100"
				leave="transition duration-200"
				leaveFrom="opacity-100 translate-y-0 scale-100"
				leaveTo="opacity-0 -translate-y-1 scale-50"
			>
				<form
					class="my-8 h-full w-full text-neutral-800 dark:text-white"
					onSubmit={(e) => {
						e.preventDefault()
						updateUser(e)
					}}
				>
					<div class="grid w-full grid-cols-[1fr,2fr] justify-items-end gap-x-8 gap-y-6">
						<div>Username</div>
						<input
							type="text"
							value={username()}
							onInput={(e) => setUsername(e.target.value)}
              maxlength={20}
							classList={{
								'w-full bg-neutral-100 rounded-md px-4 py-1 dark:bg-neutral-700': true,
								'border border-red-500': errorFields().includes('evidenceLink')
							}}
						/>
						<div>Hide Email</div>
						<div class="flex w-full justify-start">
							<input
								type="checkbox"
								checked={hideEmail()}
								onInput={(e) => setHideEmail(e.target.checked)}
								class="h-6 w-6"
							/>
						</div>
					</div>

					<div class="mt-6 flex w-full justify-center space-x-2 border-t border-neutral-300 pt-6 dark:border-neutral-700">
						<button
							class="w-fit rounded bg-neutral-100 p-2 hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-800"
							type="submit"
							disabled={isSubmitting()}
						>
							<Show when={!isSubmitting()}>Save Changes</Show>
							<Show when={isSubmitting()}>
								<div class="animate-pulse">Submitting...</div>
							</Show>
						</button>
					</div>
				</form>
			</Transition>
		</>
	)
}

export default SearchForm
