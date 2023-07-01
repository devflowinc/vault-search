import { Setter, Show, createSignal } from "solid-js";
import type {
  CardCollectionDTO,
  CardMetadataWithVotes,
} from "../../utils/apiTypes";
import { BiRegularChevronDown, BiRegularChevronUp } from "solid-icons/bi";
import sanitizeHtml from "sanitize-html";
import { VsFileSymlinkFile } from "solid-icons/vs";
import BookmarkPopover from "./BookmarkPopover";
import { FiLock, FiTrash } from "solid-icons/fi";

export interface CardMetadataDisplayProps {
  signedInUserId?: string;
  viewingUserId?: string;
  card: CardMetadataWithVotes;
  cardCollections: CardCollectionDTO[];
  setShowModal: Setter<boolean>;
  setShowConfirmModal: Setter<boolean>;
  fetchCardCollections: () => void;
  setOnDelete: Setter<() => void>;
}

const CardMetadataDisplay = (props: CardMetadataDisplayProps) => {
  const api_host = import.meta.env.PUBLIC_API_HOST as string;

  const [expanded, setExpanded] = createSignal(false);
  const [deleting, setDeleting] = createSignal(false);
  const [deleted, setDeleted] = createSignal(false);

  const onDelete = () => {
    if (props.signedInUserId !== props.viewingUserId) return;

    props.setOnDelete(() => {
      // eslint-disable-next-line solid/reactivity
      return () => {
        setDeleting(true);
        void fetch(`${api_host}/card/${props.card.id}`, {
          method: "DELETE",
          credentials: "include",
        }).then((response) => {
          setDeleting(false);
          if (response.ok) {
            setDeleted(true);
            return;
          }
          alert("Failed to delete card");
        });
      };
    });

    props.setShowConfirmModal(true);
  };

  return (
    <Show when={!deleted()}>
      <div class="flex w-full flex-col items-center rounded-md bg-neutral-200 p-2 dark:bg-neutral-800">
        <div class="flex w-full items-start space-x-2">
          <div class="flex w-full flex-col">
            <Show when={props.card.link}>
              <a
                class="line-clamp-1 w-fit break-all text-magenta-500 underline dark:text-turquoise-400"
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
                  href={`https://oc.arguflow.com/${
                    props.card.oc_file_path ?? ""
                  }`}
                >
                  {props.card.oc_file_path?.split("/").pop() ??
                    props.card.oc_file_path}
                </a>
              </div>
            </Show>
            <div class="grid w-fit auto-cols-min grid-cols-[1fr,3fr] gap-x-2 text-neutral-800 dark:text-neutral-200">
              <span class="font-semibold">Created: </span>
              <span>
                {new Date(props.card.created_at).toLocaleDateString()}
              </span>
            </div>
            <div class="flex w-fit gap-x-2 text-neutral-800 dark:text-neutral-200">
              <span class="font-semibold">Cumulative Score: </span>
              <span>
                {props.card.total_upvotes - props.card.total_downvotes}
              </span>
            </div>
          </div>
          <div class="flex gap-x-1">
            <Show when={props.card.private}>
              <FiLock class="h-5 w-5 text-green-500" />
            </Show>
            <Show when={props.signedInUserId == props.viewingUserId}>
              <button
                title="Delete"
                classList={{
                  "h-fit text-red-700 dark:text-red-400": true,
                  "animate-pulse": deleting(),
                }}
                onClick={() => onDelete()}
              >
                <FiTrash class="h-5 w-5" />
              </button>
            </Show>
            <a title="Open" href={`/card/${props.card.id}`}>
              <VsFileSymlinkFile class="cursor-pointe h-5 w-5 fill-current" />
            </a>
            <BookmarkPopover
              cardCollections={props.cardCollections}
              cardMetadata={props.card}
              fetchCardCollections={props.fetchCardCollections}
              setLoginModal={props.setShowModal}
            />
          </div>
        </div>
        <div class="mb-1 h-1 w-full border-b border-neutral-300 dark:border-neutral-600" />
        <Show when={props.card.card_html == null}>
          <p
            classList={{
              "line-clamp-4 gradient-mask-b-0": !expanded(),
            }}
          >
            {props.card.content.toString()}
          </p>
        </Show>
        <Show when={props.card.card_html != null}>
          <div
            classList={{
              "line-clamp-4 gradient-mask-b-0": !expanded(),
            }}
            // eslint-disable-next-line solid/no-innerhtml
            innerHTML={sanitizeHtml(
              props.card.card_html !== undefined ? props.card.card_html : "",
            )}
          />
        </Show>
        <button
          class="ml-2 font-semibold"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded() ? (
            <div class="flex flex-row items-center">
              <div>Show Less</div>{" "}
              <BiRegularChevronUp class="h-8 w-8  fill-current" />
            </div>
          ) : (
            <div class="flex flex-row items-center">
              <div>Show More</div>{" "}
              <BiRegularChevronDown class="h-8 w-8  fill-current" />
            </div>
          )}
        </button>
      </div>
    </Show>
  );
};

export default CardMetadataDisplay;
