import { Show, createSignal } from 'solid-js'
import type { CardDTO } from '../../utils/apiTypes'
import { BiRegularChevronDown, BiRegularChevronUp } from 'solid-icons/bi'

const EvidenceCard = (props: { card: CardDTO }) => {
	const [expanded, setExpanded] = createSignal(false)

	return (
		<div class="flex w-full items-start justify-between rounded-md bg-neutral-200 p-2 dark:bg-neutral-700">
			<div class="flex flex-col break-all">
				<Show when={props.card.link}>
					<a class="text-turquoise-500 underline" href={props.card.link ?? ''}>
						{props.card.link}
					</a>
				</Show>
				<div class="text-neutral-600 dark:text-neutral-200">
					<span class="font-semibold">Similarity Score: </span>
					{props.card.score}
				</div>
				<div
					classList={{
						'line-clamp-4': !expanded()
					}}
				>
					{props.card.content}
				</div>
			</div>
			<button class="ml-2" onClick={() => setExpanded((prev) => !prev)}>
				{expanded() ? (
					<BiRegularChevronDown class="h-8 w-8" />
				) : (
					<BiRegularChevronUp class="h-8 w-8" />
				)}
			</button>
		</div>
	)
}

export default EvidenceCard
