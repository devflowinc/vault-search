import { Show, createSignal } from "solid-js";
import { FullScreenModal } from "./Atoms/FullScreenModal";

export const FirstVisitPopUp = () => {
  const [isOpen, setIsOpen] = createSignal(true);
  const notFirstVisit = localStorage.getItem("notFirstVisit");
  console.log(notFirstVisit);
  return (
    <Show when={!notFirstVisit}>
      <FullScreenModal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div class="flex-col items-center justify-between">
          <svg
            color="currentColor"
            stroke-width="0"
            style={{ overflow: "visible" }}
            fill="white"
            viewBox="0 0 16 16"
            class="absolute right-3 mt-1 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => {
              setIsOpen(false);
              localStorage.setItem("notFirstVisit", "true");
            }}
          >
            <path
              fill-rule="evenodd"
              d="m8 8.707 3.646 3.647.708-.707L8.707
            8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646
            3.646.707.708L8 8.707z"
              clip-rule="evenodd"
            />
          </svg>
          <img class="w-12" src="/logo_transparent.png" alt="Logo" />
          <p class="text-xl font-bold">Welcome to Arguflow Vault!</p>
          <p class="text-md font-semibol mb-2">
            We recognize that its your first time here and encourage you to
            check out our{" "}
            <a
              class="text-turquoise-500 dark:text-acid-500"
              href="https://docs.arguflow.com"
            >
              documentation
            </a>{" "}
            or watch our tutorial video to get started.
          </p>
          <iframe
            class="h-96 w-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          />
        </div>
      </FullScreenModal>
    </Show>
  );
};
