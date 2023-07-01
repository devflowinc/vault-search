import { BiSolidFolder } from "solid-icons/bi";
import type {
  CardCollectionDTO,
  UserDTOWithVotesAndCards,
} from "../../utils/apiTypes";
import { For, Show, createEffect, createSignal } from "solid-js";

export const CollectionUserPageView = (props: {
  user: UserDTOWithVotesAndCards | undefined;
}) => {
  const api_host = import.meta.env.PUBLIC_API_HOST as string;
  const [collections, setCollections] = createSignal<CardCollectionDTO[]>([]);

  createEffect(() => {
    const userId = props.user?.id;
    if (userId === undefined) return;

    void fetch(`${api_host}/user/collections/${userId}`, {
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
    <Show when={props.user !== undefined}>
      <div>
        <span>Collections:</span>
        <div class="flex flex-wrap gap-x-2">
          {
            <For each={collections()}>
              {(collection) => (
                <button
                  class="mt-1 flex w-fit items-center rounded-md bg-neutral-200 p-2 text-base dark:bg-neutral-700"
                  onClick={(e) => {
                    e.preventDefault();
                    return (window.location.href = `/collection/${collection.id}`);
                  }}
                >
                  <BiSolidFolder class="mr-1 fill-current" />
                  {collection.name}
                </button>
              )}
            </For>
          }
        </div>
      </div>
    </Show>
  );
};
