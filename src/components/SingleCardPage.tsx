import { Show, createEffect, createSignal } from 'solid-js'
import type { CardMetadata, CardMetadataWithVotes, ScoreCardDTO } from '../../utils/apiTypes'
import ScoreCard from './ScoreCard'
import { FullScreenModal } from './Atoms/FullScreenModal'
import { BiRegularLogIn, BiRegularXCircle } from 'solid-icons/bi'

export interface SingleCardPageProps {
	cardID: string | undefined
	defaultResultCards: { metadata: CardMetadataWithVotes; status: number }
}
export const SingleCardPage = (props: SingleCardPageProps) => {
	const apiHost = import.meta.env.PUBLIC_API_HOST
	let ScoreDTOCard: ScoreCardDTO = { metadata: props.defaultResultCards.metadata, score: 0 }
	const [showNeedLoginModal, setShowNeedLoginModal] = createSignal(false)
	const [convertedCard, setConvertedCard] = createSignal<ScoreCardDTO>(ScoreDTOCard)
	const [error, setError] = createSignal('')
	const [fetching, setFetching] = createSignal(true)
	if (props.defaultResultCards.status == 401) {
		setError('You are not authorized to view this card.')
	}

	createEffect(() => {
		console.log(`${apiHost}/card/${props.cardID}`)
		setFetching(true)
		fetch(`${apiHost}/card/${props.cardID}`, {
			method: 'GET',
			credentials: 'include'
		}).then((response) => {
			if (response.ok) {
				response.json().then((data) => {
					console.log(data)
					setConvertedCard({ metadata: data, score: 0 })
					setError('')
					setFetching(false)
				})
			}
			if (response.status == 403) {
				setFetching(false)
			}
			if (response.status == 401) {
				setShowNeedLoginModal(true)
			}
		})
	})
	return (
		<>
			<div class="mt-12 flex w-full flex-col items-center space-y-4">
				<div class="flex w-full max-w-6xl flex-col space-y-4 px-4 sm:px-8 md:px-20">
					<Show when={error().length == 0 && !fetching()}>
						<ScoreCard card={convertedCard()} setShowModal={setShowNeedLoginModal} />
					</Show>
					<Show when={error().length > 0 && !fetching()}>
						<div class="flex w-full flex-col items-center rounded-md p-2">
							<div class="text-xl font-bold text-red-500">{error()}</div>
						</div>
					</Show>
				</div>
			</div>
			<Show when={showNeedLoginModal()}>
				<FullScreenModal isOpen={showNeedLoginModal} setIsOpen={setShowNeedLoginModal}>
					<div class="min-w-[250px] sm:min-w-[300px]">
						<BiRegularXCircle class="mx-auto h-8 w-8 !text-red-500" />
						<div class="mb-4 text-xl font-bold">Cannot view this card without an account</div>
						<div class="mx-auto flex w-fit flex-col space-y-3">
							<a
								class="flex space-x-2 rounded-md bg-magenta-500 p-2 text-white"
								href="/auth/register"
							>
								Register
								<BiRegularLogIn class="h-6 w-6" />
							</a>
						</div>
					</div>
				</FullScreenModal>
			</Show>
		</>
	)
}
