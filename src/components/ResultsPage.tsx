import { Transition } from 'solid-headless'
import { Show, createEffect, createSignal } from 'solid-js'
import type { CardsWithTotalPagesDTO, ScoreCardDTO } from '../../utils/apiTypes'
import ScoreCard from './ScoreCard'
import {
	BiRegularChevronLeft,
	BiRegularChevronRight,
	BiRegularLogIn,
	BiRegularXCircle
} from 'solid-icons/bi'
import { FullScreenModal } from './FullScreenModal'
import { PaginationControl } from './PaginationControl'

export interface ResultsPageProps {
	query: string
	page: number
	defaultResultCards: CardsWithTotalPagesDTO
}

const ResultsPage = (props: ResultsPageProps) => {
	const apiHost = import.meta.env.PUBLIC_API_HOST
	const initialResultCards = props.defaultResultCards.score_cards
	const totalPages = props.defaultResultCards.total_card_pages
	const [resultCards, setResultCards] = createSignal<ScoreCardDTO[]>(initialResultCards)
	const [showNeedLoginModal, setShowNeedLoginModal] = createSignal(false)
	const [currentPage, setCurrentPage] = createSignal(props.page)
	createEffect(() => {
		const abortController = new AbortController()

		fetch(`${apiHost}/card/search/${props.page}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			signal: abortController.signal,
			body: JSON.stringify({
				content: props.query
			})
		}).then((response) => {
			if (response.ok) {
				response.json().then((data) => {
					setResultCards(data.score_cards)
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
				<Show when={resultCards().length === 0}>
					<div class="text-2xl">No results found</div>
				</Show>
				<div class="flex w-full max-w-6xl flex-col space-y-4 px-4 sm:px-8 md:px-20">
					{resultCards().map((card) => (
						<div>
							<ScoreCard card={card} setShowModal={setShowNeedLoginModal} />
						</div>
					))}
				</div>
			</div>
			<div
				class={`mt-12 flex w-full items-center justify-center ${
					props.page === 1 ? 'justify-end' : 'justify-between'
				} px-4 sm:px-8 md:px-20`}
			>
				<PaginationControl
					currentPage={currentPage}
					totalPages={totalPages}
					setCurrentPage={setCurrentPage}
					query={props.query}
				/>
				{/* {props.page != 1 && (
					<a
						class="flex w-fit rounded bg-neutral-100 p-2 text-center hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-800"
						href={`/search?q=${props.query}&page=${props.page - 1}`}
					>
						Previous <BiRegularChevronLeft class="h-6 w-6" />
					</a>
				)}
				{resultCards().length === 25 && (
					<a
						class="flex w-fit rounded bg-neutral-100 p-2 text-center hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-800"
						href={`/search?q=${props.query}&page=${props.page + 1}`}
					>
						Next <BiRegularChevronRight class="h-6 w-6" />
					</a>
				)} */}
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

export default ResultsPage
