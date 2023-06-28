/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Setter, Show, createEffect, createSignal } from "solid-js";
import type { CardCollectionDTO, ScoreCardDTO } from "../../utils/apiTypes";
import { BiRegularChevronDown, BiRegularChevronUp } from "solid-icons/bi";
import {
  RiSystemArrowDownCircleFill,
  RiSystemArrowDownCircleLine,
  RiSystemArrowUpCircleFill,
  RiSystemArrowUpCircleLine,
} from "solid-icons/ri";
import BookmarkPopover from "./BookmarkPopover";

export interface ScoreCardProps {
  cardCollections: CardCollectionDTO[];
  collection?: boolean;
  card: ScoreCardDTO;
  setShowModal: Setter<boolean>;
  fetchCardCollections: () => void;
}

const ScoreCard = (props: ScoreCardProps) => {
  const api_host = import.meta.env.PUBLIC_API_HOST;

  const initialVoteTotal =
    props.card.metadata.total_upvotes - props.card.metadata.total_downvotes;

  const [expanded, setExpanded] = createSignal(props.card.score === 0);
  const [userVote, setUserVote] = createSignal(0);
  const [totalVote, setTotalVote] = createSignal(initialVoteTotal);

  createEffect(() => {
    if (props.card.metadata.vote_by_current_user === null) {
      return;
    }
    setUserVote(props.card.metadata.vote_by_current_user ? 1 : -1);
    setTotalVote(
      props.card.metadata.total_upvotes -
        props.card.metadata.total_downvotes -
        (props.card.metadata.vote_by_current_user ? 1 : -1),
    );
  });

  const deleteVote = (prev_vote: number) => {
    void fetch(`${api_host}/vote/${props.card.metadata.id}`, {
      method: "DELETE",
      credentials: "include",
    }).then((response) => {
      if (!response.ok) {
        setUserVote(prev_vote);
        if (response.status === 401) props.setShowModal(true);
      }
    });
  };

  const createVote = (prev_vote: number, new_vote: number) => {
    if (new_vote === 0) {
      deleteVote(prev_vote);
      return;
    }

    void fetch(`${api_host}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        card_metadata_id: props.card.metadata.id,
        vote: new_vote === 1 ? true : false,
      }),
    }).then((response) => {
      if (!response.ok) {
        setUserVote(prev_vote);
        if (response.status === 401) props.setShowModal(true);
      }
    });
  };

  return (
    <div class="flex w-full flex-col items-center rounded-md bg-neutral-200 p-2 dark:bg-neutral-700">
      <div class="flex w-full">
        <div class="flex w-full items-start">
          <div class="flex flex-col items-center pr-2">
            <Show when={!props.card.metadata.private}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setUserVote((prev) => {
                    const new_val = prev === 1 ? 0 : 1;
                    createVote(prev, new_val);
                    return new_val;
                  });
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
                  e.preventDefault();
                  setUserVote((prev) => {
                    const new_val = prev === -1 ? 0 : -1;
                    createVote(prev, new_val);
                    return new_val;
                  });
                }}
              >
                <Show when={userVote() === -1}>
                  <RiSystemArrowDownCircleFill class="h-8 w-8 !text-turquoise-500" />
                </Show>
                <Show when={userVote() != -1}>
                  <RiSystemArrowDownCircleLine class="h-8 w-8" />
                </Show>
              </button>
            </Show>
          </div>
          <div class="flex w-full flex-col">
            <Show when={props.card.metadata.link}>
              <a
                class="line-clamp-1 break-all text-magenta-500 underline dark:text-turquoise-400"
                target="_blank"
                href={props.card.metadata.link ?? ""}
              >
                {props.card.metadata.link}
              </a>
            </Show>
            <Show when={props.card.metadata.oc_file_path}>
              <div class="flex space-x-2">
                <span class="font-semibold text-neutral-800 dark:text-neutral-200">
                  Brief:{" "}
                </span>
                <a
                  class="line-clamp-1 break-all text-magenta-500 underline dark:text-turquoise-400"
                  target="_blank"
                  href={
                    "https://oc.arguflow.com/" +
                      props.card.metadata.oc_file_path ?? " "
                  }
                >
                  {props.card.metadata.oc_file_path?.split("/").pop() ??
                    props.card.metadata.oc_file_path}
                </a>
              </div>
            </Show>
            <div class="grid w-fit auto-cols-min grid-cols-[1fr,3fr] gap-x-2 text-neutral-800 dark:text-neutral-200">
              <Show when={props.card.score != 0 && !props.collection}>
                <span class="font-semibold">Similarity: </span>
                <span>{props.card.score}</span>
              </Show>
              <Show when={props.card.metadata.author}>
                <span class="font-semibold">Author: </span>
                <a
                  href={`/user/${props.card.metadata.author?.id}`}
                  class="line-clamp-1 break-all underline"
                >
                  {props.card.metadata.author?.username ??
                    props.card.metadata.author?.email}
                </a>
              </Show>
              <span class="font-semibold">Created: </span>
              <span>
                {new Date(props.card.metadata.created_at).toLocaleDateString()}
              </span>
            </div>
            <div class="mb-1 h-1 w-full border-b border-neutral-300 dark:border-neutral-600" />
            <p
              classList={{
                "line-clamp-4 gradient-mask-b-0": !expanded(),
              }}
            >
              {props.card.metadata.content.toString()}
            </p>
          </div>
        </div>
        <div>
          <BookmarkPopover
            cardCollections={props.cardCollections}
            card={props.card}
            fetchCardCollections={props.fetchCardCollections}
            setLoginModal={props.setShowModal}
          />
        </div>
      </div>
      <Show when={props.card.score != 0 || props.collection}>
        <button
          class="ml-2 font-semibold"
          onClick={() => setExpanded((prev) => !prev)}
        >
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
      </Show>
    </div>
  );
};

export default ScoreCard;
