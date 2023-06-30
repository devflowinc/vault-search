import { For, Setter, createEffect, createSignal } from "solid-js";
import {
  Menu,
  MenuItem,
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "solid-headless";
import { RiSystemAddFill } from "solid-icons/ri";
import type {
  CardBookmarksDTO,
  CardCollectionDTO,
  ScoreCardDTO,
} from "../../utils/apiTypes";
import InputRowsForm from "./Atoms/InputRowsForm";

export interface BookmarkPopoverProps {
  card: ScoreCardDTO;
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
    void fetch(
      `${apiHost}/card_collection/bookmark/${props.card.metadata.id}`,
      {
        method: "GET",
        credentials: "include",
      },
    ).then((response) => {
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
          <PopoverButton
            onClick={() => {
              if (notLoggedIn()) {
                props.setLoginModal(true);
                return;
              }
              fetchCollections();
            }}
          >
            <RiSystemAddFill class="h-5 w-5" />
          </PopoverButton>
          <Transition
            show={isOpen() || usingPanel()}
            enter="transition duration-200"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
          >
            <PopoverPanel
              unmount={false}
              class="absolute w-screen max-w-xs -translate-x-[300px]"
              onMouseEnter={() => setUsingPanel(true)}
              onMouseLeave={() => setUsingPanel(false)}
              onClick={() => setState(true)}
            >
              <Menu class=" flex w-full flex-col justify-end overflow-hidden bg-white drop-shadow-md dark:bg-shark-500">
                <div class="w-full p-2 text-lg font-bold">
                  Add card to collection
                </div>
                <MenuItem as="button" aria-label="Empty" />
                <div class="scrollbar-track-rounded-md scrollbar-thumb-rounded-md max-w-screen max-h-[20vh] transform justify-end overflow-y-auto rounded scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 dark:scrollbar-track-neutral-700 dark:scrollbar-thumb-neutral-600">
                  <For each={props.cardCollections}>
                    {(collection) => {
                      return (
                        <div class="flex w-full items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-neutral-500/80">
                          <p class="flex flex-row justify-start">
                            {collection.name}{" "}
                          </p>

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
                                    card_metadata_id: props.card.metadata.id,
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
                            class="h-4 w-4 rounded-sm	border-gray-300 bg-neutral-500 accent-turquoise focus:ring-neutral-200 dark:border-neutral-700 dark:focus:ring-neutral-600"
                          />
                        </div>
                      );
                    }}
                  </For>
                </div>
                {showCollectionForm() && (
                  <div class="bg-gray-100 dark:bg-neutral-500/80">
                    <div class="px-2 pt-2 text-lg font-bold">
                      New Collection
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
                  <MenuItem
                    as="button"
                    onClick={() => {
                      setShowCollectionForm(true);
                      setState(true);
                    }}
                    class="flex w-full space-x-2 bg-neutral-100 p-2 dark:bg-neutral-500/80"
                  >
                    <RiSystemAddFill class="h-5 w-5" />
                    <p> New Collection </p>
                  </MenuItem>
                )}
              </Menu>
            </PopoverPanel>
          </Transition>
        </div>
      )}
    </Popover>
  );
};

export default BookmarkPopover;
