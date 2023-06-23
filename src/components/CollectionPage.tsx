import { Show, createEffect, createSignal } from 'solid-js'
import type { CardMetadata, CardMetadataWithVotes, ScoreCardDTO } from '../../utils/apiTypes'
import ScoreCard from './ScoreCard'
import { FullScreenModal } from './Atoms/FullScreenModal'
import { BiRegularLogIn, BiRegularXCircle } from 'solid-icons/bi'

export interface CollectionPageProps {
	collectionID: string | undefined
	defaultResultCards: { metadata: CardMetadataWithVotes[]; status: number }
}
export const CollectionPage = (props: CollectionPageProps) => {
	const apiHost = import.meta.env.PUBLIC_API_HOST
	let ScoreDTOCards: ScoreCardDTO[] = []
	if (props.defaultResultCards.metadata.length > 0)
		props.defaultResultCards.metadata.forEach((card) => {
			ScoreDTOCards.push({ metadata: card, score: 2 })
		})

	const [showNeedLoginModal, setShowNeedLoginModal] = createSignal(false)
	const [convertedCard, setConvertedCard] = createSignal<ScoreCardDTO[]>(ScoreDTOCards)
	const [error, setError] = createSignal('')
	const [fetching, setFetching] = createSignal(true)
	if (props.defaultResultCards.status == 401) {
		setError('You are not authorized to view this collection.')
	}

	createEffect(() => {
		setFetching(true)
		fetch(`${apiHost}/card_collection/${props.collectionID}`, {
			method: 'GET',
			credentials: 'include'
		}).then((response) => {
			if (response.ok) {
				response.json().then((data) => {
					console.log(data)
					//take the data and convert it to ScoreCardDTO
					let ScoreDTOCards: ScoreCardDTO[] = []
					data.forEach((card: CardMetadataWithVotes) => {
						ScoreDTOCards.push({ metadata: card, score: 2 })
					})

					setConvertedCard(ScoreDTOCards)
					setError('')
					setFetching(false)
				})
			}
			console.log(response.status)
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
						{convertedCard().map((card) => (
							<ScoreCard card={card} collection={true} setShowModal={setShowNeedLoginModal} />
						))}
					</Show>
					<Show when={error().length > 0 && !fetching()}>
						<div class="flex w-full flex-col items-center rounded-md p-2">
							<div class="text-xl font-bold text-red-500">{error()}</div>
						</div>
					</Show>
					<Show when={convertedCard().length == 0}>
						<div class="flex w-full flex-col items-center rounded-md p-2">
							<div class="text-xl font-bold text-red-500">No cards in this collection</div>
						</div>
					</Show>
				</div>
			</div>
			<Show when={showNeedLoginModal()}>
				<FullScreenModal isOpen={showNeedLoginModal} setIsOpen={setShowNeedLoginModal}>
					<div class="min-w-[250px] sm:min-w-[300px]">
						<BiRegularXCircle class="mx-auto h-8 w-8 !text-red-500" />
						<div class="mb-4 text-xl font-bold">Cannot view this collection without an account</div>
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
