import { Show, createEffect, createSignal } from 'solid-js'
import type {
	CardCollectionDTO,
	CardMetadata,
	CardMetadataWithVotes,
	ScoreCardDTO
} from '../../utils/apiTypes'
import ScoreCard from './ScoreCard'
import { FullScreenModal } from './Atoms/FullScreenModal'
import { BiRegularLogIn, BiRegularXCircle } from 'solid-icons/bi'

export interface CollectionPageProps {
	collectionID: string | undefined
	defaultCollectionCards: {
		metadata: { card_metadata: CardMetadataWithVotes[]; collection: CardCollectionDTO }
		status: number
	}
}
export const CollectionPage = (props: CollectionPageProps) => {
	const apiHost = import.meta.env.PUBLIC_API_HOST
	let ScoreDTOCards: ScoreCardDTO[] = []
	if (props.defaultCollectionCards.metadata.card_metadata?.length > 0)
		props.defaultCollectionCards.metadata.card_metadata.forEach((card) => {
			ScoreDTOCards.push({ metadata: card, score: 2 })
		})

	const [showNeedLoginModal, setShowNeedLoginModal] = createSignal(false)
	const [convertedCard, setConvertedCard] = createSignal<ScoreCardDTO[]>(ScoreDTOCards)
	const [collectionInfo, setCollectionInfo] = createSignal<CardCollectionDTO>(
		props.defaultCollectionCards.metadata.collection
	)
	const [error, setError] = createSignal('')
	const [fetching, setFetching] = createSignal(true)
	if (props.defaultCollectionCards.status == 401) {
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
					console.log(data.card_metadata)
					//take the data and convert it to ScoreCardDTO
					let ScoreDTOCards: ScoreCardDTO[] = []
					data.card_metadata.forEach((card: CardMetadataWithVotes) => {
						ScoreDTOCards.push({ metadata: card, score: 2 })
					})
					setCollectionInfo(data.collection)
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
			<div class=" flex w-full flex-col items-center space-y-2">
				<Show when={error().length == 0 && !fetching()}>
					<div class="flex gap-x-2 ">
						<h1 class="my-8 line-clamp-1  break-all text-center text-lg font-bold min-[320px]:text-xl sm:text-4xl">
							Collection:
						</h1>
						<h1 class="my-8 line-clamp-1 break-all text-center text-lg min-[320px]:text-xl sm:text-4xl">
							{collectionInfo().name}
						</h1>
					</div>
					<Show when={collectionInfo().description?.length > 0}>
						<div class="mx-auto flex max-w-[300px] justify-items-center gap-x-2 md:max-w-fit">
							<div class="text-md text-center font-semibold">Description:</div>
							<div class="break- flex w-full justify-start text-center">
								{collectionInfo().description}
							</div>
						</div>
					</Show>
				</Show>
				<div class="flex w-full max-w-6xl flex-col space-y-4 border-t border-neutral-500 px-4 sm:px-8 md:px-20">
					<Show when={error().length == 0 && !fetching()}>
						{convertedCard().map((card) => (
							<div class="mt-4">
								<ScoreCard card={card} collection={true} setShowModal={setShowNeedLoginModal} />
							</div>
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
