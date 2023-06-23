/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Show, createEffect, createSignal, For } from "solid-js";
import type {
  CardCollectionDTO,
  CardsWithTotalPagesDTO,
  ScoreCardDTO,
} from "../../utils/apiTypes";
import ScoreCard from "./ScoreCard";
import { BiRegularLogIn, BiRegularXCircle } from "solid-icons/bi";
import { FullScreenModal } from "./Atoms/FullScreenModal";
import { PaginationController } from "./Atoms/PaginationController";

export interface Filters {
  dataTypes: string[];
  links: string[];
}
export interface ResultsPageProps {
  query: string;
  page: number;
  defaultResultCards: CardsWithTotalPagesDTO;
  filters: Filters;
  searchType: string;
}

const ResultsPage = (props: ResultsPageProps) => {
  const dataTypeFilters = encodeURIComponent(props.filters.dataTypes.join(","));
  const linkFilters = encodeURIComponent(props.filters.links.join(","));
  const apiHost = import.meta.env.PUBLIC_API_HOST;
  const initialResultCards = props.defaultResultCards.score_cards;
  const totalPages = props.defaultResultCards.total_card_pages;

  const [cardCollections, SetCardCollections] = createSignal<
    CardCollectionDTO[]
  >([]);

  const [resultCards, setResultCards] =
    createSignal<ScoreCardDTO[]>(initialResultCards);
  const [showNeedLoginModal, setShowNeedLoginModal] = createSignal(false);

  const fetchCardCollections = () => {
    void fetch(`${apiHost}/card_collection`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          SetCardCollections(data);
        });
      }
    });
  };

  createEffect(() => {
    const abortController = new AbortController();

    void fetch(`${apiHost}/card/${props.searchType}/${props.page}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      signal: abortController.signal,
      body: JSON.stringify({
        content: props.query,
        filter_oc_file_path: props.filters.dataTypes,
        filter_link_url: props.filters.links,
      }),
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          setResultCards(data.score_cards);
        });
      }
    });

    fetchCardCollections();

    return () => {
      abortController.abort();
    };
  });

  return (
    <>
      <div class="mt-12 flex w-full flex-col items-center space-y-4">
        <Show when={resultCards().length === 0}>
          <button
            onClick={() => {
              window.location.href = `/search?q=${props.query}&page=${
                props.page + 1
              }`;
            }}
          >
            <div class="text-2xl">No results found</div>
          </button>
        </Show>
        <div class="flex w-full max-w-6xl flex-col space-y-4 px-4 sm:px-8 md:px-20">
          <For each={resultCards()}>
            {(card) => (
              <div>
                <ScoreCard
                  cardCollections={cardCollections()}
                  card={card}
                  setShowModal={setShowNeedLoginModal}
                  fetchCardCollections={fetchCardCollections}
                />
              </div>
            )}
          </For>
        </div>
      </div>
      <div class="mx-auto my-12 flex items-center space-x-2">
        <PaginationController
          query={
            `/search?q=${props.query}` +
            (dataTypeFilters ? `&datatypes=${dataTypeFilters}` : "") +
            (linkFilters ? `&links=${linkFilters}` : "") +
            (props.searchType == "fulltextsearch"
              ? `&searchType=fulltextsearch`
              : "")
          }
          page={totalPages}
          totalPages={props.page}
        />
      </div>
      <Show when={showNeedLoginModal()}>
        <FullScreenModal
          isOpen={showNeedLoginModal}
          setIsOpen={setShowNeedLoginModal}
        >
          <div class="min-w-[250px] sm:min-w-[300px]">
            <BiRegularXCircle class="mx-auto h-8 w-8 !text-red-500" />
            <div class="mb-4 text-center text-xl font-bold">
              Cannot vote or use collections without an account
            </div>
            <div class="mx-auto flex w-fit flex-col space-y-3">
              <a
                class="flex space-x-2 rounded-md bg-magenta-500 p-2 text-white"
                href="/auth/register"
              >
                Register
                <BiRegularLogIn class="h-6 w-6" />
              </a>
            </div>
          </div>
        </FullScreenModal>
      </Show>
    </>
  );
};

export default ResultsPage;
