/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BiSolidFolder } from "solid-icons/bi";
import type {
  CardCollectionDTO,
  UserDTOWithVotesAndCards,
} from "../../utils/apiTypes";
import { For, createEffect, createSignal } from "solid-js";

export const CollectionUserPageView = (props: {
  user: UserDTOWithVotesAndCards;
}) => {
  const api_host = import.meta.env.PUBLIC_API_HOST;
  const [collections, setCollections] = createSignal<CardCollectionDTO[]>([]);

  createEffect(() => {
    void fetch(`${api_host}/card_collection`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          setCollections(data);
        });
      }
    });
  });

  return (
    <h1>
      <span>Collections Created by</span>{" "}
      <span class="break-all font-bold">
        {props.user.username ?? props.user.email}
      </span>
      <div class="flex flex-wrap gap-x-2">
        {
          <For each={collections()}>
            {(collection) => (
              <button
                class="text-md mt-1 flex w-fit items-center rounded-md bg-neutral-200 p-2 dark:bg-neutral-700"
                onClick={(_) =>
                  (window.location.href = `/collections/${collection.id}`)
                }
              >
                <BiSolidFolder classList={{ "mr-1": true }} />
                {collection.name}
              </button>
            )}
          </For>
        }
      </div>
    </h1>
  );
};
