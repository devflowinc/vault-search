import { Show, createEffect, createSignal } from "solid-js";
import {
  isUserDTO,
  type CardCollectionDTO,
  type CardMetadataWithVotes,
  type ScoreCardDTO,
  type UserDTO,
} from "../../utils/apiTypes";
import ScoreCard from "./ScoreCard";
import { FullScreenModal } from "./Atoms/FullScreenModal";
import { BiRegularLogIn, BiRegularXCircle } from "solid-icons/bi";

export interface SingleCardPageProps {
  cardID: string | undefined;
  defaultResultCards: { metadata: CardMetadataWithVotes; status: number };
  collisions: string;
}
export const SingleCardPage = (props: SingleCardPageProps) => {
  const apiHost = import.meta.env.PUBLIC_API_HOST as string;
  const ScoreDTOCard: ScoreCardDTO = {
    metadata: props.defaultResultCards.metadata,
    score: 0,
  };

  const [showNeedLoginModal, setShowNeedLoginModal] = createSignal(false);
  const [convertedCard, setConvertedCard] =
    createSignal<ScoreCardDTO>(ScoreDTOCard);
  const [error, setError] = createSignal("");
  const [fetching, setFetching] = createSignal(true);
  const [cardCollections, setCardCollections] = createSignal<
    CardCollectionDTO[]
  >([]);
  const [user, setUser] = createSignal<UserDTO | undefined>();

  if (props.defaultResultCards.status == 401) {
    setError("You are not authorized to view this card.");
  }
  if (props.defaultResultCards.status == 404) {
    setError("This card could not be found.");
  }

  // Fetch the card collections for the auth'ed user
  const fetchCardCollections = () => {
    void fetch(`${apiHost}/card_collection`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          setCardCollections(data as CardCollectionDTO[]);
        });
      }
    });
  };

  createEffect(() => {
    fetchCardCollections();
  });

  // Fetch the user info for the auth'ed user
  createEffect(() => {
    void fetch(`${apiHost}/auth`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          isUserDTO(data) ? setUser(data) : setUser(undefined);
        });
      }
    });
  });

  createEffect(() => {
    setFetching(true);
    void fetch(`${apiHost}/card/${props.cardID ?? ""}`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          setConvertedCard({
            metadata: data as CardMetadataWithVotes,
            score: 0,
          });
          setError("");
          setFetching(false);
        });
      }
      if (response.status == 403 || response.status == 404) {
        setFetching(false);
      }
      if (response.status == 401) {
        setShowNeedLoginModal(true);
      }
    });
  });

  return (
    <>
      <div class="mt-12 flex w-full flex-col items-center space-y-4">
        <div class="flex w-full max-w-6xl flex-col space-y-4 px-4 sm:px-8 md:px-20">
          <Show when={props.collisions.length > 0}>
            <div class="flex w-full flex-col items-center rounded-md p-2">
              <div class="text-xl font-bold text-red-500">
                This card has the same meaning another card. It has been added
                to your account as a private card.{" "}
              </div>
            </div>
          </Show>
          <Show when={error().length == 0 && !fetching()}>
            <ScoreCard
              signedInUserId={user()?.id}
              card={convertedCard()}
              setShowModal={setShowNeedLoginModal}
              cardCollections={cardCollections()}
              fetchCardCollections={fetchCardCollections}
            />
          </Show>
          <Show when={error().length > 0 && !fetching()}>
            <div class="flex w-full flex-col items-center rounded-md p-2">
              <div class="text-xl font-bold text-red-500">{error()}</div>
            </div>
          </Show>
        </div>
      </div>
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
    </>
  );
};
