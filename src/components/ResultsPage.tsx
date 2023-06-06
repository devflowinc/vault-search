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

export interface ResultsPageProps {
	query: string
	page: number
	defaultResultCards: CardsWithTotalPagesDTO
}

const createArrayWithCenteredRange = (center: number, range: number) => {
	const array = []
	const indicesBeforeCenter = Math.floor(range / 2)

	if (center === Math.floor(range / 2) + 1) {
		for (let j = 1; j <= range; j++) {
			array.push(j)
		}
	} else {
		let currentValue = Math.max(1, center - indicesBeforeCenter)

		for (let j = 0; j < range; j++) {
			array.push(currentValue)
			currentValue++
		}
	}

	return array
}

const ResultsPage = (props: ResultsPageProps) => {
	const apiHost = import.meta.env.PUBLIC_API_HOST
	const initialResultCards = props.defaultResultCards.score_cards
	const totalPages = props.defaultResultCards.total_card_pages
	const [resultCards, setResultCards] = createSignal<ScoreCardDTO[]>(initialResultCards)
	const [showNeedLoginModal, setShowNeedLoginModal] = createSignal(false)

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
					<button
						onClick={() => {
							window.location.href = `/search?q=${props.query}&page=${props.page + 1}`
						}}
					>
						<div class="text-2xl">No results found</div>
					</button>
				</Show>
				<div class="flex w-full max-w-6xl flex-col space-y-4 px-4 sm:px-8 md:px-20">
					{resultCards().map((card) => (
						<div>
							<ScoreCard card={card} setShowModal={setShowNeedLoginModal} />
						</div>
					))}
				</div>
			</div>
			<div class="mb-16 mt-12 flex w-full items-center justify-center space-x-1">
				<Show when={props.page > 1}>
					<button
						onClick={() => {
							window.location.href = `/search?q=${props.query}&page=${props.page - 1}`
						}}
					>
						<BiRegularChevronLeft class="h-8 w-8 text-neutral-400 dark:text-neutral-500" />
					</button>
				</Show>
				{createArrayWithCenteredRange(
					// Center on the current page, unless the current page is the last or second to last page
					totalPages - props.page > 1 ? props.page : totalPages - 2,
					// Show 5 pages, unless there are less than 5 total pages
					Math.min(totalPages, 5)
				).map((n) => (
					<button
						classList={{
							'flex h-8 w-8 items-center justify-center rounded-full focus:bg-neutral-400/70 dark:focus:bg-neutral-500/80':
								true,
							'bg-neutral-400/70 dark:bg-neutral-500/80': n === props.page,
							'bg-neutral-200 dark:bg-neutral-700': n !== props.page
						}}
						onClick={() => {
							window.location.href = `/search?q=${props.query}&page=${n}`
						}}
					>
						{n}
					</button>
				))}
				<Show when={props.page < totalPages}>
					<button
						onClick={() => {
							window.location.href = `/search?q=${props.query}&page=${props.page + 1}`
						}}
					>
						<BiRegularChevronRight class="h-8 w-8 text-neutral-400 dark:text-neutral-500" />
					</button>
				</Show>
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
