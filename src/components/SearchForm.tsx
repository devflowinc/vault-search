/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BiRegularSearch, BiRegularX } from "solid-icons/bi";
import { VsTriangleDown } from "solid-icons/vs";
import { For, Show, createEffect, createSignal } from "solid-js";
import {
  Combobox,
  ComboboxItem,
  ComboboxSection,
} from "./Atoms/ComboboxChecklist";
import {
  Menu,
  MenuItem,
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "solid-headless";
import { FaSolidCheck } from "solid-icons/fa";
import type { Filters } from "./ResultsPage";

const filterDataTypeComboboxSections: ComboboxSection[] = [
  {
    name: "Data set",
    comboboxItems: [
      {
        name: "2013OpenEv",
      },
      {
        name: "2014OpenEv",
      },
      {
        name: "2015OpenEv",
      },
      {
        name: "2016OpenEv",
      },
      {
        name: "2017OpenEv",
      },
      {
        name: "2018OpenEv",
      },
      {
        name: "2019OpenEv",
      },
      {
        name: "2020OpenEv",
      },
      {
        name: "2021OpenEv",
      },
      {
        name: "2022OpenEv",
      },
      {
        name: "hsld22-all-2023",
      },
      {
        name: "hspf22-all-2023",
      },
      {
        name: "hspolicy22-all-2023",
      },
      {
        name: "ndtceda22-all-2023",
      },
      {
        name: "nfald22-all-2023",
      },
    ],
  },
];
const filterLinkComboboxSections: ComboboxSection[] = [
  {
    name: "Links",
    comboboxItems: [
      {
        name: "reuters.com",
      },
      {
        name: "bloomberg.com",
      },
      {
        name: "jstor.org",
      },
      {
        name: "tandfonline.com",
      },
      {
        name: "theatlantic.com",
      },
      {
        name: "theguardian.com",
      },
      {
        name: "nytimes.com",
      },
      {
        name: "foreignaffairs.com",
      },
      {
        name: "heritage.org",
      },
      {
        name: "brookings.edu",
      },
      {
        name: "sagepub.com",
      },
      {
        name: "ncbi.nlm.nih.com",
      },
      {
        name: "businessinsider.com",
      },
    ],
  },
];

const SearchForm = (props: {
  query?: string;
  filters: Filters;
  searchType: string;
}) => {
  const initialQuery = props.query ?? "";

  const [searchTypes, setSearchTypes] = createSignal([
    { name: "Full Text", isSelected: false, route: "fulltextsearch" },
    { name: "Semantic", isSelected: true, route: "search" },
  ]);
  const [textareaInput, setTextareaInput] = createSignal(initialQuery);

  const [filterDataTypes, setFilterDataTypes] = createSignal<ComboboxSection[]>(
    filterDataTypeComboboxSections,
  );

  const [filterLinks, setFilterLinks] = createSignal<ComboboxSection[]>(
    filterLinkComboboxSections,
  );
  const customDataTypeFilters = JSON.parse(
    localStorage.getItem("customDatasetFilters") ?? "[]",
  );
  const customLinkFilters = JSON.parse(
    localStorage.getItem("customLinksFilters") ?? "[]",
  );
  if (Object.keys(customDataTypeFilters).length > 0) {
    setFilterDataTypes((prev) => {
      customDataTypeFilters.custom = true;
      const newComboboxItems = [
        ...prev[0].comboboxItems,
        customDataTypeFilters,
      ];
      console.log(newComboboxItems);
      return [
        {
          name: prev[0].name,
          comboboxItems: newComboboxItems,
        },
      ];
    });
  }
  if (Object.keys(customLinkFilters).length > 0) {
    setFilterLinks((prev) => {
      customLinkFilters.custom = true;
      const newComboboxItems = [...prev[0].comboboxItems, customLinkFilters];
      return [
        {
          name: prev[0].name,
          comboboxItems: newComboboxItems,
        },
      ];
    });
  }

  const initialDataTypeFilters = filterDataTypes().flatMap((section) =>
    section.comboboxItems.filter((item) =>
      props.filters.dataTypes.includes(item.name),
    ),
  );
  const initialLinkFilters = filterLinks().flatMap((section) =>
    section.comboboxItems.filter((item) =>
      props.filters.links.includes(item.name),
    ),
  );
  const [selectedDataTypeComboboxItems, setDataTypeSelectedComboboxItems] =
    createSignal<ComboboxItem[]>(initialDataTypeFilters);
  const [selectedLinkComboboxItems, setLinkSelectedComboboxItems] =
    createSignal<ComboboxItem[]>(initialLinkFilters);
  const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;

    textarea.style.height = `${textarea.scrollHeight}px`;
    setTextareaInput(textarea.value);
  };

  const onSubmit = (e: Event) => {
    e.preventDefault();
    const textAreaValue = textareaInput();
    const searchQuery = encodeURIComponent(
      textAreaValue.length > 3800
        ? textAreaValue.slice(0, 3800)
        : textAreaValue,
    );
    const dataTypeFilters = encodeURIComponent(
      selectedDataTypeComboboxItems()
        .map((item) => item.name)
        .join(","),
    );
    const linkFilters = encodeURIComponent(
      selectedLinkComboboxItems()
        .map((item) => item.name)
        .join(","),
    );

    window.location.href =
      `/search?q=${searchQuery}` +
      (dataTypeFilters ? `&datatypes=${dataTypeFilters}` : "") +
      (linkFilters ? `&links=${linkFilters}` : "") +
      (searchTypes()[0].isSelected ? `&searchType=fulltextsearch` : "");
  };

  createEffect(() => {
    resizeTextarea(
      document.getElementById(
        "search-query-textarea",
      ) as HTMLTextAreaElement | null,
    );
    setSearchTypes((prev) => {
      return prev.map((item) => {
        if (props.searchType == item.route) {
          return { ...item, isSelected: true };
        } else {
          return { ...item, isSelected: false };
        }
      });
    });
  });

  return (
    <div class="w-full">
      <form
        class="w-full space-y-4 text-neutral-800 dark:text-white"
        onSubmit={onSubmit}
      >
        <div class="flex space-x-2">
          <div class="pr-0. flex w-full justify-center space-x-2 rounded-md bg-neutral-100 px-4 py-1 pr-[10px] dark:bg-neutral-700 ">
            <Show when={!props.query}>
              <BiRegularSearch class="mt-1 h-6 w-6" />
            </Show>
            <textarea
              id="search-query-textarea"
              class="scrollbar-track-rounded-md scrollbar-thumb-rounded-md mr-2 h-fit max-h-[240px] w-full resize-none whitespace-pre-wrap bg-transparent py-1 scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 focus:outline-none dark:bg-neutral-700 dark:text-white dark:scrollbar-track-neutral-700 dark:scrollbar-thumb-neutral-600"
              placeholder="Search for cards..."
              value={textareaInput()}
              onInput={(e) => resizeTextarea(e.target)}
              onKeyDown={(e) => {
                if (
                  ((e.ctrlKey || e.metaKey) && e.key === "Enter") ||
                  (!e.shiftKey && e.key === "Enter")
                ) {
                  onSubmit(e);
                }
              }}
              rows="1"
            >
              {textareaInput() || props.query}
            </textarea>
            <Show when={textareaInput()}>
              <button
                classList={{
                  "pt-[2px]": !!props.query,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setTextareaInput("");
                  resizeTextarea(
                    document.getElementById(
                      "search-query-textarea",
                    ) as HTMLTextAreaElement,
                  );
                }}
              >
                <BiRegularX class="h-7 w-7" />
              </button>
            </Show>
            <Show when={props.query}>
              <button
                classList={{
                  "border-l border-neutral-600 pl-[10px] dark:border-neutral-200":
                    !!textareaInput(),
                }}
                type="submit"
              >
                <BiRegularSearch class="mt-1 h-6 w-6" />
              </button>
            </Show>
          </div>
        </div>
        <div class="flex space-x-2">
          <Popover defaultOpen={false} class="relative">
            {({ isOpen, setState }) => (
              <>
                <PopoverButton
                  aria-label="Toggle filters"
                  type="button"
                  class="flex items-center space-x-1 text-sm"
                >
                  <span>Filters</span> <VsTriangleDown class="h-3.5 w-3.5" />
                </PopoverButton>
                <Transition
                  show={isOpen()}
                  enter="transition duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <PopoverPanel
                    unmount={false}
                    class="absolute z-10 mt-2 h-fit w-fit rounded-md bg-neutral-200 p-1 shadow-lg dark:bg-neutral-800"
                  >
                    <Menu class="h-0">
                      <MenuItem class="h-0" as="button" aria-label="Empty" />
                    </Menu>
                    <div class="flex w-full min-w-full space-x-2">
                      <Combobox
                        selectedComboboxItems={selectedDataTypeComboboxItems}
                        setSelectedComboboxItems={
                          setDataTypeSelectedComboboxItems
                        }
                        comboboxSections={filterDataTypes}
                        setComboboxSections={setFilterDataTypes}
                        setPopoverOpen={setState}
                      />
                      <Combobox
                        selectedComboboxItems={selectedLinkComboboxItems}
                        setSelectedComboboxItems={setLinkSelectedComboboxItems}
                        comboboxSections={filterLinks}
                        setComboboxSections={setFilterLinks}
                        setPopoverOpen={setState}
                      />
                    </div>
                  </PopoverPanel>
                </Transition>
              </>
            )}
          </Popover>
          <Popover defaultOpen={false} class="relative">
            {({ isOpen, setState }) => (
              <>
                <PopoverButton
                  aria-label="Toggle filters"
                  type="button"
                  class="flex items-center space-x-1 text-sm"
                >
                  <span>Search Type</span>{" "}
                  <VsTriangleDown class="h-3.5 w-3.5" />
                </PopoverButton>
                <Transition
                  show={isOpen()}
                  enter="transition duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <PopoverPanel
                    unmount={false}
                    class="absolute z-10 mt-2 h-fit w-[180px]  rounded-md bg-neutral-200 p-1 shadow-lg dark:bg-neutral-800"
                  >
                    <Menu class="ml-1 space-y-1">
                      <For each={searchTypes()}>
                        {(option) => {
                          const onClick = (e: Event) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSearchTypes((prev) => {
                              return prev.map((item) => {
                                if (item.name === option.name) {
                                  return { ...item, isSelected: true };
                                } else {
                                  return { ...item, isSelected: false };
                                }
                              });
                            });
                            setState(true);
                          };
                          return (
                            <MenuItem
                              as="button"
                              classList={{
                                "flex w-full items-center justify-between rounded p-1 focus:text-black focus:outline-none dark:hover:text-white dark:focus:text-white":
                                  true,
                                "bg-neutral-300 dark:bg-neutral-900":
                                  option.isSelected,
                              }}
                              onClick={onClick}
                            >
                              <div class="flex flex-row justify-start space-x-2">
                                <span class="text-left">{option.name}</span>
                              </div>
                              {option.isSelected && (
                                <span>
                                  <FaSolidCheck class="text-xl" />
                                </span>
                              )}
                            </MenuItem>
                          );
                        }}
                      </For>
                    </Menu>
                  </PopoverPanel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
        <Show when={!props.query}>
          <div class="flex flex-row justify-center space-x-2 px-6 md:px-40">
            <button
              class="w-fit rounded  bg-neutral-100 p-2 text-center hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-800"
              type="submit"
            >
              Search Evidence Vault
            </button>
            <a
              class="w-fit rounded bg-neutral-100 p-2 text-center hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-800"
              href="/create"
            >
              Create Evidence Card
            </a>
          </div>
        </Show>
      </form>
    </div>
  );
};

export default SearchForm;
