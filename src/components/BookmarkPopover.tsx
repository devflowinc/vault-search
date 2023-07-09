import { For, Setter, Show, createEffect, createSignal } from "solid-js";
import {
  Menu,
  MenuItem,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "solid-headless";
import { RiSystemAddFill } from "solid-icons/ri";
import type {
  CardBookmarksDTO,
  CardCollectionDTO,
  CardMetadata,
} from "../../utils/apiTypes";
import InputRowsForm from "./Atoms/InputRowsForm";
import { VsBookmark } from "solid-icons/vs";

export interface BookmarkPopoverProps {
  signedInUserId: string | undefined;
  cardMetadata: CardMetadata;
  cardCollections: CardCollectionDTO[];
  fetchCardCollections: () => void;
  setLoginModal: Setter<boolean>;
}

const BookmarkPopover = (props: BookmarkPopoverProps) => {
  const apiHost = import.meta.env.PUBLIC_API_HOST as string;

  const [refetchingCardCollections, setRefetchingCardCollections] =
    createSignal(false);
  const [showCollectionForm, setShowCollectionForm] = createSignal(false);
  const [notLoggedIn, setNotLoggedIn] = createSignal(false);
  const [collectionFormTitle, setCollectionFormTitle] = createSignal("");
  const [cardCollections, setCardCollections] =
    createSignal<CardBookmarksDTO[]>();
  const [usingPanel, setUsingPanel] = createSignal(false);

  const fetchCollections = () => {
    if (!props.signedInUserId) {
      setNotLoggedIn(true);
      return;
    }
    void fetch(`${apiHost}/card_collection/bookmark/${props.cardMetadata.id}`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        void response.json().then((collection) => {
          setCardCollections(collection as CardBookmarksDTO[]);
        });
      }
      if (response.status == 401) {
        setNotLoggedIn(true);
      }
    });
  };

  createEffect(() => {
    fetchCollections();
  });

  createEffect(() => {
    if (!refetchingCardCollections()) return;

    props.fetchCardCollections();
    setRefetchingCardCollections(false);
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
                fetchCollections();
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
                  <For each={props.cardCollections}>
                    {(collection, idx) => {
                      return (
                        <>
                          <Show when={idx() != 0}>
                            <div class="h-px w-full bg-neutral-200 dark:bg-neutral-700" />
                          </Show>
                          <div class="flex w-full items-center justify-between space-x-2">
                            <p class="max-w-[80%]">{collection.name}</p>

                            <input
                              type="checkbox"
                              checked={cardCollections()?.some(
                                (c) => c.collection_id == collection.id,
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
                                });
                                setState(true);
                              }}
                              class="h-4 w-4 cursor-pointer	rounded-sm border-gray-300 bg-neutral-500 accent-turquoise focus:ring-neutral-200 dark:border-neutral-700 dark:focus:ring-neutral-600"
                            />
                          </div>
                        </>
                      );
                    }}
                  </For>
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
