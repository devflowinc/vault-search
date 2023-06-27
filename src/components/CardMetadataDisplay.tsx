/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { For, Show, createSignal, createEffect, createMemo } from "solid-js";
import { CardCollectionDTO, CardMetadataWithVotes, UserDTO, UserDTOWithVotesAndCards, isUserDTO } from "../../utils/apiTypes";
import { BiRegularChevronDown, BiRegularChevronUp, BiRegularPen, BiRegularShare, BiRegularTrash } from "solid-icons/bi";
import BookmarkPopover from "./BookmarkPopover";

const CardMetadataDisplay = (props: { user: UserDTOWithVotesAndCards, card: CardMetadataWithVotes }) => {
  const [expanded, setExpanded] = createSignal(false);
  const apiHost = import.meta.env.PUBLIC_API_HOST;

  const [loginModal, setLoginModal] = createSignal();

  const [cardCollections, setCardCollections] = createSignal<CardCollectionDTO[]>([]);
  const [currentUser, setCurrentUser] = createSignal<UserDTO | null>(null);

  const fetchCardCollections = () => {
    void fetch(`${apiHost}/card_collection`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          setCardCollections(data);
        });
      }
    });
  };

  createEffect(() => {
    void fetch(`${apiHost}/auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          if (isUserDTO(data)) {
            setCurrentUser(data);
          }
        });
        return;
      }
    });
  });

  return (
    <div class="flex w-full flex-col items-center rounded-md bg-neutral-200 p-2 dark:bg-neutral-700">
      <div class="flex w-full items-start">
        <div class="flex w-full flex-col">
          <div class="flex justify-between items-start">
            <div>
              <Show when={props.card.link}>
                <a
                  class="line-clamp-1 break-all text-magenta-500 underline dark:text-turquoise-400"
                  target="_blank"
                  href={props.card.link ?? ""}
                >
                  {props.card.link}
                </a>
              </Show>
              <Show when={props.card.oc_file_path}>
                <div class="flex space-x-2">
                  <span class="font-semibold text-neutral-800 dark:text-neutral-200">
                    Brief:{" "}
                  </span>
                  <a
                    class="line-clamp-1 break-all text-magenta-500 underline dark:text-turquoise-400"
                    target="_blank"
                    href={
                      "https://oc.arguflow.com/" + props.card.oc_file_path ?? ""
                    }
                  >
                    {props.card.oc_file_path?.split("/").pop() ??
                      props.card.oc_file_path}
                  </a>
                </div>
              </Show>
              <div class="grid w-fit auto-cols-min grid-cols-[1fr,3fr] gap-x-2 text-neutral-800 dark:text-neutral-200">
                <span class="font-semibold">Created: </span>
                <span>{new Date(props.card.created_at).toLocaleDateString()}</span>
              </div>
              <div class="grid w-fit auto-cols-min grid-cols-[1fr,3fr] gap-x-2 text-neutral-800 dark:text-neutral-200">
                <span class="font-semibold">Cumulative Score: </span>
                <span>{props.card.total_upvotes - props.card.total_downvotes}</span>
              </div>
              <div class="mb-1 h-1 w-full border-b border-neutral-300 dark:border-neutral-600" />
            </div>
            <div class="flex">
              <button onclick={() => {
              }}>
                <BiRegularPen class="h-5 w-5" />
              </button>
              <button onclick={() => {
                fetch("${apiHost}/card/delete", {
                  method: "DELETE",
                  credentials: "include"
                }).then((response) => {
                  void response.json().then((data) => {

                  });
                })
              }}>
                <BiRegularTrash class="h-5 w-5" />
              </button>
              <div class="py-1">
                <BookmarkPopover
                  fetchCardCollections={fetchCardCollections}
                  cardCollections={cardCollections()}
                  card={props.card}
                  setLoginModal={setLoginModal}
                />
              </div>
            </div>
          </div>
          <p
            classList={{
              "line-clamp-4 gradient-mask-b-0": !expanded(),
            }}
          >
            {props.card.content}
          </p>
        </div>
      </div>
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
    </div>
  );
};

export default CardMetadataDisplay;
