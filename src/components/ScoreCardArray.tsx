import { Show, createSignal } from "solid-js";
import type { CardMetadataWithVotes } from "../../utils/apiTypes";
import type { ScoreCardProps } from "./ScoreCard";
import { FiChevronLeft } from "solid-icons/fi";
import ScoreCard from "./ScoreCard";

export type ScoreCardAraryProps = Omit<ScoreCardProps, "card"> & {
  cards: CardMetadataWithVotes[];
};

export const ScoreCardArray = (props: ScoreCardAraryProps) => {
  const [curCard, setCurCard] = createSignal(0);

  return (
    <div class="flex space-x-2">
      <Show when={curCard() > 0}>
        <button onClick={() => setCurCard((prev) => prev - 1)}>
          <FiChevronLeft class="h-8 w-8 fill-current" />
        </button>
      </Show>
      <ScoreCard {...props} card={props.cards[curCard()]} />
      <Show when={curCard() < props.cards.length - 1}>
        <button onClick={() => setCurCard((prev) => prev + 1)}>
          <FiChevronLeft class="h-8 w-8 rotate-180 transform fill-current" />
        </button>
      </Show>
    </div>
  );
};
