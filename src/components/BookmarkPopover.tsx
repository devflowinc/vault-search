import { For, Setter, Show, createEffect, createSignal } from "solid-js";
import {
  Menu,
  MenuItem,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "solid-headless";
import { RiSystemAddFill } from "solid-icons/ri";
import {
  isCardCollectionPageDTO,
  type CardBookmarksDTO,
  type CardCollectionDTO,
  type CardMetadata,
} from "../../utils/apiTypes";
import InputRowsForm from "./Atoms/InputRowsForm";
import { VsBookmark } from "solid-icons/vs";
import { BiRegularChevronLeft, BiRegularChevronRight } from "solid-icons/bi";

export interface BookmarkPopoverProps {
  signedInUserId: string | undefined;
  cardMetadata: CardMetadata;
  cardCollections: CardCollectionDTO[];
  fetchCardCollections: () => void;
  fetchBookmarks: () => void;
  collectionPage: number;
  totalCollectionPages: number;
  setCollectionPage: Setter<number>;
  setLoginModal: Setter<boolean>;
  bookmarks: CardBookmarksDTO;
}

const BookmarkPopover = (props: BookmarkPopoverProps) => {
  const apiHost = import.meta.env.PUBLIC_API_HOST as string;

  const [refetchingCardCollections, setRefetchingCardCollections] =
    createSignal(false);
  const [refetchingBookmarks, setRefetchingBookmarks] = createSignal(false);
  const [showCollectionForm, setShowCollectionForm] = createSignal(false);
  const [notLoggedIn, setNotLoggedIn] = createSignal(false);
  const [collectionFormTitle, setCollectionFormTitle] = createSignal("");
  const [usingPanel, setUsingPanel] = createSignal(false);
  const [bookmarks, setBookmarks] = createSignal<CardBookmarksDTO>();

  const [localCollectionPage, setLocalCollectionPage] = createSignal(1);

  const [localCardCollections, setLocalCardCollections] = createSignal<
    CardCollectionDTO[]
  >([]);

  createEffect(() => {
    setLocalCollectionPage(props.collectionPage);
    setLocalCardCollections(props.cardCollections);
  });

  createEffect(() => {
    if (localCollectionPage() == props.collectionPage) {
      return;
    }

    void fetch(`${apiHost}/card_collection/${localCollectionPage()}`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          if (isCardCollectionPageDTO(data)) {
            setLocalCardCollections(data.collections);
          }
        });
      }
    });
  });

  const refetchBookmarks = () => {
    void fetch(`${apiHost}/card_collection/bookmark`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection_ids: props.cardMetadata.id,
      }),
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          setBookmarks((data as CardBookmarksDTO[])[0]);
          setNotLoggedIn(false);
        });
      }

      if (response.status === 401) {
        setNotLoggedIn(true);
      }
    });
  };
  createEffect(() => {
    setBookmarks(props.bookmarks);
    if (props.signedInUserId === undefined) {
      return;
    }
    if (!refetchingCardCollections()) return;

    props.fetchCardCollections();
    setRefetchingCardCollections(false);
  });

  createEffect(() => {
    if (!refetchingBookmarks()) return;

    refetchBookmarks();
    setRefetchingBookmarks(false);
  });

  createEffect(() => {
    if (!notLoggedIn()) return;

    props.setLoginModal(true);
  });

  return (
    <Popover defaultOpen={false} class="relative">
      {({ isOpen, setState }) => (
        <div>
          <div class="-ml-[3px] flex items-center">
            <PopoverButton
              title="Bookmark"
              onClick={() => {
                if (notLoggedIn()) {
                  props.setLoginModal(true);
                  return;
                }
                refetchBookmarks();
              }}
            >
              <VsBookmark class="z-0 h-5 w-5 fill-current" />
            </PopoverButton>
          </div>
          <Show when={(isOpen() || usingPanel()) && !notLoggedIn()}>
            <PopoverPanel
              unmount={false}
              class="absolute z-50 w-screen max-w-xs -translate-x-[300px]"
              onMouseEnter={() => setUsingPanel(true)}
              onMouseLeave={() => setUsingPanel(false)}
              onClick={() => setState(true)}
            >
              <Menu class=" flex w-full flex-col justify-end space-y-2 overflow-hidden rounded bg-white py-4 drop-shadow-md dark:bg-shark-700">
                <div class="mb-3 w-full px-4 text-center text-lg font-bold">
                  Manage Collections For This Card
                </div>
                <MenuItem as="button" aria-label="Empty" />
                <div class="scrollbar-track-rounded-md scrollbar-thumb-rounded-md max-w-screen mx-1 max-h-[20vh] transform justify-end space-y-2 overflow-y-auto rounded px-4 scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 dark:scrollbar-track-neutral-700 dark:scrollbar-thumb-neutral-600">
                  <For each={localCardCollections()}>
                    {(collection, idx) => {
                      return (
                        <>
                          <Show when={idx() != 0}>
                            <div class="h-px w-full bg-neutral-200 dark:bg-neutral-700" />
                          </Show>
                          <div class="flex w-full items-center justify-between space-x-2">
                            <a
                              href={`/collection/${collection.id}`}
                              class="max-w-[80%] underline"
                            >
                              {collection.name}
                            </a>

                            <input
                              type="checkbox"
                              checked={bookmarks()?.collection_ids.includes(
                                collection.id,
                              )}
                              onChange={(e) => {
                                void fetch(
                                  `${apiHost}/card_collection/${collection.id}`,
                                  {
                                    method: e.currentTarget.checked
                                      ? "POST"
                                      : "DELETE",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    credentials: "include",
                                    body: JSON.stringify({
                                      card_metadata_id: props.cardMetadata.id,
                                    }),
                                  },
                                ).then((response) => {
                                  if (!response.ok) {
                                    e.currentTarget.checked =
                                      !e.currentTarget.checked;
                                  }
                                  setRefetchingBookmarks(true);
                                });
                                setState(true);
                              }}
                              class="h-4 w-4 cursor-pointer rounded-sm border-gray-300 bg-neutral-500 accent-turquoise focus:ring-neutral-200 dark:border-neutral-700 dark:focus:ring-neutral-600"
                            />
                          </div>
                        </>
                      );
                    }}
                  </For>
                  <div class="flex items-center justify-between">
                    <div />
                    <div class="flex items-center">
                      <div class="text-sm text-neutral-400">
                        {localCollectionPage()} / {props.totalCollectionPages}
                      </div>
                      <button
                        class="disabled:text-neutral-400 dark:disabled:text-neutral-500"
                        disabled={localCollectionPage() == 1}
                        onClick={() => {
                          setState(true);
                          setLocalCollectionPage((prev) => prev - 1);
                        }}
                      >
                        <BiRegularChevronLeft class="h-6 w-6 fill-current" />
                      </button>
                      <button
                        class="disabled:text-neutral-400 dark:disabled:text-neutral-500"
                        disabled={
                          localCollectionPage() == props.totalCollectionPages
                        }
                        onClick={() => {
                          setState(true);
                          setLocalCollectionPage((prev) => prev + 1);
                        }}
                      >
                        <BiRegularChevronRight class="h-6 w-6 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
                {showCollectionForm() && (
                  <div class="mx-4 rounded bg-gray-100 py-2 dark:bg-neutral-800">
                    <div class="px-2 text-lg font-bold">
                      Create New Collection
                    </div>
                    <InputRowsForm
                      createButtonText="Create collection"
                      onCreate={() => {
                        const title = collectionFormTitle();
                        if (title.trim() == "") return;
                        void fetch(`${apiHost}/card_collection`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                          body: JSON.stringify({
                            name: title,
                            description: "",
                            is_public: true,
                          }),
                        }).then(() => {
                          setRefetchingCardCollections(true);
                          setShowCollectionForm(false);
                          setCollectionFormTitle("");
                          setState(true);
                        });
                      }}
                      onCancel={() => {
                        setShowCollectionForm(false);
                        setState(true);
                      }}
                      inputGroups={[
                        {
                          label: "Title",
                          inputValue: collectionFormTitle,
                          setInputValue: setCollectionFormTitle,
                        },
                      ]}
                    />
                  </div>
                )}
                {!showCollectionForm() && (
                  <div class="px-4 pt-4">
                    <MenuItem
                      as="button"
                      onClick={() => {
                        setShowCollectionForm(true);
                        setState(true);
                      }}
                      class="flex w-full items-center justify-center rounded-full border border-green-500 bg-transparent px-2 text-lg text-green-500"
                    >
                      <RiSystemAddFill class="h-5 w-5 fill-current" />
                      <p> Create New Collection </p>
                    </MenuItem>
                  </div>
                )}
              </Menu>
            </PopoverPanel>
          </Show>
        </div>
      )}
    </Popover>
  );
};

export default BookmarkPopover;
