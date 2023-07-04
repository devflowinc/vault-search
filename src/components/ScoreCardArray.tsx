import { Show, createSignal } from "solid-js";
import type { CardMetadataWithVotes } from "../../utils/apiTypes";
import type { ScoreCardProps } from "./ScoreCard";
import { FiChevronLeft, FiChevronRight } from "solid-icons/fi";
import ScoreCard from "./ScoreCard";

export type ScoreCardAraryProps = Omit<ScoreCardProps, "card"> & {
  cards: CardMetadataWithVotes[];
};

export const ScoreCardArray = (props: ScoreCardAraryProps) => {
  const [curCard, setCurCard] = createSignal(0);

  return (
    <div class="mx-auto flex items-center">
      <div class="w-[32px]">
        <Show when={curCard() > 0}>
          <button onClick={() => setCurCard((prev) => prev - 1)}>
            <FiChevronLeft class="h-8 w-8" />
          </button>
        </Show>
        <Show when={curCard() <= 0}>
          <FiChevronLeft class="h-8 w-8 text-transparent" />
        </Show>
      </div>
      <ScoreCard {...props} card={props.cards[curCard()]} />
      <div class="w-[32px]">
        <Show when={curCard() < props.cards.length - 1}>
          <button onClick={() => setCurCard((prev) => prev + 1)}>
            <FiChevronRight class="h-8 w-8" />
          </button>
        </Show>
        <Show when={curCard() >= props.cards.length - 1}>
          <FiChevronRight class="h-8 w-8 text-transparent" />
        </Show>
      </div>
    </div>
  );
};
