import { Match, Show, Switch, createEffect, createSignal } from 'solid-js'
import type { ScoreCardDTO } from '../../utils/apiTypes'
import { BiRegularChevronDown, BiRegularChevronUp } from 'solid-icons/bi'
import {
	RiSystemArrowDownCircleFill,
	RiSystemArrowDownCircleLine,
	RiSystemArrowUpCircleFill,
	RiSystemArrowUpCircleLine
} from 'solid-icons/ri'

const EvidenceCard = (props: { card: ScoreCardDTO }) => {
	const api_host = import.meta.env.PUBLIC_API_HOST

	const [expanded, setExpanded] = createSignal(false)
	const [userVote, setUserVote] = createSignal(0)
	const [totalVote, setTotalVote] = createSignal(0)

	createEffect(() => {
		if (props.card.metadata.vote_by_current_user == null) {
			setTotalVote(props.card.metadata.total_upvotes - props.card.metadata.total_downvotes)
			return
		}
		setUserVote(props.card.metadata.vote_by_current_user ? 1 : -1)
		setTotalVote(
			props.card.metadata.total_upvotes -
				props.card.metadata.total_downvotes -
				(props.card.metadata.vote_by_current_user ? 1 : -1)
		)
	})

	const deleteVote = (prev_vote: number) => {
		fetch(`${api_host}/vote/${props.card.metadata.id}`, {
			method: 'DELETE',
			credentials: 'include'
		}).then((response) => {
			if (!response.ok) {
				setUserVote(prev_vote)
			}
		})
	}

	const createVote = (prev_vote: number, new_vote: number) => {
		if (new_vote === 0) {
			deleteVote(prev_vote)
			return
		}

		fetch(`${api_host}/vote`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				card_metadata_id: props.card.metadata.id,
				vote: new_vote === 1 ? true : false
			})
		}).then((response) => {
			if (!response.ok) {
				setUserVote(prev_vote)
			}
		})
	}

	return (
		<div class="flex w-full flex-col items-center rounded-md bg-neutral-200 p-2 dark:bg-neutral-700">
			<div class="flex items-start">
				<div class="flex flex-col items-center pr-2">
					<button
						onClick={(e) => {
							e.preventDefault()
							setUserVote((prev) => {
								const new_val = prev === 1 ? 0 : 1
								createVote(prev, new_val)
								return new_val
							})
						}}
					>
						<Show when={userVote() === 1}>
							<RiSystemArrowUpCircleFill class="h-8 w-8 !text-turquoise-500" />
						</Show>
						<Show when={userVote() != 1}>
							<RiSystemArrowUpCircleLine class="h-8 w-8" />
						</Show>
					</button>
					<span class="my-1">{totalVote() + userVote()}</span>
					<button
						onClick={(e) => {
							e.preventDefault()
							setUserVote((prev) => {
								const new_val = prev === -1 ? 0 : -1
								createVote(prev, new_val)
								return new_val
							})
						}}
					>
						<Show when={userVote() === -1}>
							<RiSystemArrowDownCircleFill class="h-8 w-8 !text-turquoise-500" />
						</Show>
						<Show when={userVote() != -1}>
							<RiSystemArrowDownCircleLine class="h-8 w-8" />
						</Show>
					</button>
				</div>
				<div class="flex flex-col">
					<Show when={props.card.metadata.link}>
						<a
							class="line-clamp-1 text-turquoise-500 underline"
							href={props.card.metadata.link ?? ''}
						>
							{props.card.metadata.link}
						</a>
					</Show>
					<div class="grid w-fit auto-cols-min grid-cols-[1fr,3fr] gap-x-2 text-neutral-800 dark:text-neutral-200">
						<span class="font-semibold">Similarity: </span>
						<span>{props.card.score}</span>
						<Show when={props.card.metadata.author}>
							<span class="font-semibold">Author: </span>
							<a href={`/user/${props.card.metadata.author?.id}`} class="break-all underline">
								{props.card.metadata.author?.username ?? props.card.metadata.author?.email}
							</a>
						</Show>
						<span class="font-semibold">Created: </span>
						<span>{new Date(props.card.metadata.created_at).toLocaleDateString()}</span>
					</div>
					<div class="mb-1 h-1 w-full border-b border-neutral-300 dark:border-neutral-600" />
					<p
						classList={{
							'line-clamp-4 gradient-mask-b-0': !expanded()
						}}
					>
						{props.card.metadata.content}
					</p>
				</div>
			</div>
			<button class="ml-2 font-semibold" onClick={() => setExpanded((prev) => !prev)}>
				{expanded() ? (
					<div class="flex flex-row items-center">
						<div>Show Less</div> <BiRegularChevronUp class="h-8 w-8" />
					</div>
				) : (
					<div class="flex flex-row items-center">
						<div>Show More</div> <BiRegularChevronDown class="h-8 w-8" />
					</div>
				)}
			</button>
		</div>
	)
}

export default EvidenceCard
