import { Show, createEffect, createSignal, For } from "solid-js";
import type {
  CardCollectionDTO,
  UserDTOWithVotesAndCards,
} from "../../utils/apiTypes";
import CardMetadataDisplay from "./CardMetadataDisplay";
import { PaginationController } from "./Atoms/PaginationController";
import { CollectionUserPageView } from "./CollectionUserPageView";
import { FullScreenModal } from "./Atoms/FullScreenModal";
import { BiRegularLogIn, BiRegularXCircle } from "solid-icons/bi";

export const UserCardDisplay = (props: { id: string; page: number }) => {
  const apiHost = import.meta.env.PUBLIC_API_HOST as string;

  const [user, setUser] = createSignal<UserDTOWithVotesAndCards>();
  const [showNeedLoginModal, setShowNeedLoginModal] = createSignal(false);
  const [showConfirmModal, setShowConfirmModal] = createSignal(false);
  const [cardCollections, setCardCollections] = createSignal<
    CardCollectionDTO[]
  >([]);

  const [onDelete, setOnDelete] = createSignal<() => void>(() => { });

  // Fetch the card collections for the auth'ed user
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
    fetchCardCollections();
  });

  createEffect(() => {
    void fetch(`${apiHost}/user/${props.id}/${props.page}`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          setUser(data);
        });
      }
    });
  });

  return (
    <>
      <Show when={user() != null}>
        <div class="mx-auto grid w-fit grid-cols-[1fr,2fr] justify-items-end gap-x-2 gap-y-2 text-end sm:gap-x-4">
          {user()?.website && (
            <>
              <div class="font-semibold">Website:</div>
              <a
                href={user()?.website ?? "#"}
                target="_blank"
                class="line-clamp-1 flex w-full justify-start text-magenta-500 underline dark:text-turquoise-400"
              >
                {user()?.website}
              </a>
            </>
          )}
          {user()?.email && user()?.visible_email && (
            <>
              <div class="font-semibold">Email:</div>
              <div class="flex w-full justify-start break-all">
                {user()?.email}
              </div>
            </>
          )}
          <div class="font-semibold">Cards Created:</div>
          <div class="flex w-full justify-start">
            <Show when={user() != null}>
              {user()?.total_cards_created.toLocaleString()}
            </Show>
          </div>
          <div class="font-semibold">Cumulative Rating:</div>
          <div class="flex w-full justify-start">
            {(
              (user()?.total_upvotes_received ?? 0) -
              (user()?.total_downvotes_received ?? 0)
            ).toLocaleString()}
          </div>
          <div class="font-semibold">Votes Cast:</div>
          <div class="flex w-full justify-start">
            {user()?.total_votes_cast.toLocaleString()}
          </div>
          <div class="font-semibold">Date Created:</div>
          <div class="flex w-full justify-start">
            {new Date(user()?.created_at ?? "").toLocaleDateString()}
          </div>
        </div>
        <div class="mb-4 mt-4 flex flex-col border-t border-neutral-500 pt-4 text-xl">
          <CollectionUserPageView user={user()} />
        </div>
        <div class="mb-4 mt-4 flex flex-col border-t border-neutral-500 pt-4 text-xl">
          <span>Cards:</span>
        </div>
        <div class="flex w-full flex-col space-y-4">
          <div class="flex w-full flex-col space-y-4">
            <For each={user()?.cards}>
              {(card) => (
                <div class="w-full">
                  <CardMetadataDisplay
                    setShowConfirmModal={setShowConfirmModal}
                    signedInUserId={user()?.id}
                    viewingUserId={props.id}
                    card={card}
                    setShowModal={setShowNeedLoginModal}
                    cardCollections={cardCollections()}
                    fetchCardCollections={fetchCardCollections}
                    setOnDelete={setOnDelete}
                  />
                </div>
              )}
            </For>
          </div>
        </div>
        <div class="mx-auto my-12 flex items-center justify-center space-x-2">
          <PaginationController
            prefix="?"
            query={`/user/${user()?.id ?? ""}`}
            page={props.page}
            totalPages={Math.ceil((user()?.total_cards_created ?? 0) / 25)}
          />
        </div>
      </Show>
      <Show when={showNeedLoginModal()}>
        <FullScreenModal
          isOpen={showNeedLoginModal}
          setIsOpen={setShowNeedLoginModal}
        >
          <div class="min-w-[250px] sm:min-w-[300px]">
            <BiRegularXCircle class="mx-auto h-8 w-8 fill-current !text-red-500" />
            <div class="mb-4 text-xl font-bold">
              Cannot view this card without an account
            </div>
            <div class="mx-auto flex w-fit flex-col space-y-3">
              <a
                class="flex space-x-2 rounded-md bg-magenta-500 p-2 text-white"
                href="/auth/register"
              >
                Register
                <BiRegularLogIn class="h-6 w-6 fill-current" />
              </a>
            </div>
          </div>
        </FullScreenModal>
      </Show>
      <Show when={showConfirmModal()}>
        <FullScreenModal
          isOpen={showConfirmModal}
          setIsOpen={setShowConfirmModal}
        >
          <div class="min-w-[250px] sm:min-w-[300px]">
            <BiRegularXCircle class="mx-auto h-8 w-8 fill-current !text-red-500" />
            <div class="mb-4 text-xl font-bold">
              Are you sure you want to delete this card?
            </div>
            <div class="mx-auto flex w-fit space-x-3">
              <button
                class="flex items-center space-x-2 rounded-md bg-magenta-500 p-2 text-white"
                onClick={() => {
                  setShowConfirmModal(false);
                  onDelete()();
                }}
              >
                Delete
                <BiRegularLogIn class="h-6 w-6 fill-current" />
              </button>
              <button
                class="flex space-x-2 rounded-md bg-neutral-500 p-2 text-white"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </FullScreenModal>
      </Show>
    </>
  );
};
