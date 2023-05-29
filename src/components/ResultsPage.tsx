import { Transition } from 'solid-headless'
import { Show, createEffect, createSignal } from 'solid-js'
import type { ScoreCardDTO } from '../../utils/apiTypes'
import EvidenceCard from './EvidenceCard'
import { BiRegularChevronLeft, BiRegularChevronRight } from 'solid-icons/bi'

export interface ResultsPageProps {
	query: string
	page: number
}

const ResultsPage = (props: ResultsPageProps) => {
	const apiHost = import.meta.env.PUBLIC_API_HOST

	const [isLoadingResults, setIsLoadingResults] = createSignal(true)
	const [resultCards, setResultCards] = createSignal<ScoreCardDTO[]>([])

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
					setResultCards(data)
					setIsLoadingResults(false)
				})
			}
		})

		return () => {
			abortController.abort()
		}
	})

	return (
		<>
			<Transition
				show={isLoadingResults()}
				enter="transition duration-400"
				enterFrom="opacity-0 scale-50"
				enterTo="opacity-100 scale-100"
				leave="transition duration-25"
				leaveFrom="opacity-100 scale-100"
				leaveTo="opacity-0 scale-50"
			>
				<div class="absolute flex h-[calc(100vh-60px)] w-screen items-center justify-center">
					<div class="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-neutral-900 dark:border-white"></div>
				</div>
			</Transition>
			<Transition
				show={!isLoadingResults()}
				enter="transition duration-600"
				enterFrom="opacity-0 scale-50"
				enterTo="opacity-100 scale-100"
				leave="transition duration-200"
				leaveFrom="opacity-100 scale-100"
				leaveTo="opacity-0 scale-50"
			>
				<div class="mt-12 flex w-full flex-col items-center space-y-4">
					<Show when={resultCards().length === 0}>
						<div class="text-2xl text-neutral-600 dark:text-neutral-200">No results found</div>
					</Show>
					<div class="flex w-full max-w-6xl flex-col space-y-4 px-4 sm:px-8 md:px-20">
						{resultCards().map((card) => (
							<div>
								<EvidenceCard card={card} />
							</div>
						))}
					</div>
				</div>
				<div
					class={`mt-12 flex w-full ${
						props.page === 1 ? 'justify-end' : 'justify-between'
					} px-4 sm:px-8 md:px-20`}
				>
					{props.page != 1 && (
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
					)}
				</div>
			</Transition>
		</>
	)
}

export default ResultsPage
