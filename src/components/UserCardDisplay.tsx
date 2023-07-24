import { Show, createEffect, createSignal, For } from "solid-js";
import {
  isUserDTO,
  type CardCollectionDTO,
  type UserDTO,
  type UserDTOWithVotesAndCards,
  CardBookmarksDTO,
} from "../../utils/apiTypes";
import CardMetadataDisplay from "./CardMetadataDisplay";
import { PaginationController } from "./Atoms/PaginationController";
import { CollectionUserPageView } from "./CollectionUserPageView";
import { FullScreenModal } from "./Atoms/FullScreenModal";
import {
  BiRegularChevronLeft,
  BiRegularChevronRight,
  BiRegularLogIn,
  BiRegularXCircle,
} from "solid-icons/bi";
import { ConfirmModal } from "./Atoms/ConfirmModal";

export const UserCardDisplay = (props: { id: string; page: number }) => {
  const apiHost = import.meta.env.PUBLIC_API_HOST as string;

  const [user, setUser] = createSignal<UserDTOWithVotesAndCards>();
  const [loggedUser, setLoggedUser] = createSignal<UserDTO>();
  const [showNeedLoginModal, setShowNeedLoginModal] = createSignal(false);
  const [showConfirmModal, setShowConfirmModal] = createSignal(false);
  const [cardCollections, setCardCollections] = createSignal<
    CardCollectionDTO[]
  >([]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [onDelete, setOnDelete] = createSignal<() => void>(() => {});
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [onCollectionDelete, setOnCollectionDelete] = createSignal(() => {});
  const [
    showConfirmCollectionDeleteModal,
    setShowConfirmCollectionmDeleteModal,
  ] = createSignal(false);
  const [bookmarks, setBookmarks] = createSignal<CardBookmarksDTO[]>([]);

  createEffect(() => {
    void fetch(`${apiHost}/auth`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          isUserDTO(data) ? setLoggedUser(data) : setLoggedUser(undefined);
        });
      }
    });
  });

  // Fetch the card collections for the auth'ed user
  const fetchCardCollections = () => {
    if (!user()) return;

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
    fetchBookmarks();
  });

  createEffect(() => {
    void fetch(`${apiHost}/user/${props.id}/${props.page}`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          setUser(data as UserDTOWithVotesAndCards);
        });
      }
    });
  });
  const fetchBookmarks = () => {
    if (!user()) return;
    void fetch(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${apiHost}/card_collection/bookmark`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collection_ids: user()?.cards.map((c) => c.id),
        }),
      },
    ).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          setBookmarks(data as CardBookmarksDTO[]);
        });
      }
    });
  };

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
          <div class="font-semibold">Date Joined:</div>
          <div class="flex w-full justify-start">
            {new Date(user()?.created_at ?? "").toLocaleDateString()}
          </div>
        </div>
        <div class="mb-4 mt-4 flex  flex-col overflow-hidden border-t border-neutral-500 pt-4 text-xl">
          <CollectionUserPageView
            user={user()}
            loggedUser={loggedUser()}
            setOnDelete={setOnCollectionDelete}
            setShowConfirmModal={setShowConfirmCollectionmDeleteModal}
          />
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
                    signedInUserId={loggedUser()?.id}
                    viewingUserId={props.id}
                    card={card}
                    setShowModal={setShowNeedLoginModal}
                    cardCollections={cardCollections()}
                    fetchCardCollections={fetchCardCollections}
                    setOnDelete={setOnDelete}
                    fetchBookmarks={fetchBookmarks}
                    bookmarks={bookmarks()}
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
              Cannot use collections without an account
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
      <ConfirmModal
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        onConfirm={onDelete}
        message={"Are you sure you want to delete this card?"}
      />
      <ConfirmModal
        showConfirmModal={showConfirmCollectionDeleteModal}
        setShowConfirmModal={setShowConfirmCollectionmDeleteModal}
        onConfirm={onCollectionDelete}
        message={"Are you sure you want to delete this collection?"}
      />
    </>
  );
};
