import { Show, createEffect, createSignal } from 'solid-js'
import type { CardMetadata, CardMetadataWithVotes, ScoreCardDTO } from '../../utils/apiTypes'
import ScoreCard from './ScoreCard'
import { FullScreenModal } from './Atoms/FullScreenModal'
import { BiRegularLogIn, BiRegularXCircle } from 'solid-icons/bi'
const apiHost = import.meta.env.API_HOST

export interface SingleCardPageProps {
	cardID: string | undefined
	defaultResultCards: CardMetadataWithVotes
}
export const SingleCardPage = (props: SingleCardPageProps) => {
	let ScoreDTOCard: ScoreCardDTO = { metadata: props.defaultResultCards, score: 0 }

	const [showNeedLoginModal, setShowNeedLoginModal] = createSignal(false)
	const [convertedCard, setConvertedCard] = createSignal<ScoreCardDTO>(ScoreDTOCard)
	createEffect(() => {
		const abortController = new AbortController()

		fetch(`${apiHost}/card/${props.cardID}`, {
			method: 'GET',
			credentials: 'include'
		}).then((response) => {
			if (response.ok) {
				response.json().then((data) => {
					setConvertedCard({ metadata: data.score_cards, score: 0 })
				})
			}
		})

		return () => {
			abortController.abort()
		}
	})
	return (
		<>
			<div class="mt-12 flex w-full flex-col items-center space-y-4">
				<div class="flex w-full max-w-6xl flex-col space-y-4 px-4 sm:px-8 md:px-20">
					<ScoreCard card={convertedCard()} setShowModal={setShowNeedLoginModal} />
				</div>
			</div>
			<Show when={showNeedLoginModal()}>
				<FullScreenModal isOpen={showNeedLoginModal} setIsOpen={setShowNeedLoginModal}>
					<div class="min-w-[250px] sm:min-w-[300px]">
						<BiRegularXCircle class="mx-auto h-8 w-8 !text-red-500" />
						<div class="mb-4 text-xl font-bold">Cannot vote without an account</div>
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
