import { FiTrash } from "solid-icons/fi";
import type {
  CardCollectionDTO,
  UserDTO,
  UserDTOWithVotesAndCards,
} from "../../utils/apiTypes";
import { For, Setter, Show, createEffect, createSignal } from "solid-js";

export interface CollectionUserPageViewProps {
  user: UserDTOWithVotesAndCards | undefined;
  loggedUser: UserDTO | undefined;
  setOnDelete: Setter<() => void>;
  setShowConfirmModal: Setter<boolean>;
}

export const CollectionUserPageView = (props: CollectionUserPageViewProps) => {
  const api_host = import.meta.env.PUBLIC_API_HOST as string;
  const [collections, setCollections] = createSignal<CardCollectionDTO[]>([]);
  const [deleting, setDeleting] = createSignal(false);

  createEffect(() => {
    const userId = props.user?.id;
    if (userId === undefined) return;

    void fetch(`${api_host}/user/collections/${userId}`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          setCollections(data as CardCollectionDTO[]);
        });
      }
    });
  });

  const deleteCollection = (collection: CardCollectionDTO) => {
    if (props.user?.id !== collection.author_id) return;

    props.setOnDelete(() => {
      return () => {
        setDeleting(true);
        void fetch(`${api_host}/card_collection`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collection_id: collection.id,
          }),
        }).then((response) => {
          if (response.ok) {
            setDeleting(false);
            setCollections((prev) => {
              return prev.filter((c) => c.id != collection.id);
            });
          }
          if (response.status == 403) {
            setDeleting(false);
          }
          if (response.status == 401) {
            setDeleting(false);
          }
        });
      };
    });

    props.setShowConfirmModal(true);
  };
  return (
    <Show when={props.user !== undefined}>
      <div>
        <span>Collections:</span>
        <div class="mt-2 flow-root">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Private
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Created at
                    </th>
                    <Show
                      when={
                        props.loggedUser != undefined &&
                        props.loggedUser.id == collections()[0]?.author_id
                      }
                    >
                      <th
                        scope="col"
                        class="relative hidden py-3.5 pl-3 pr-4 sm:pr-0"
                      >
                        <span class="sr-only">Delete</span>
                      </th>
                    </Show>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                  <For each={collections()}>
                    {(collection) => (
                      <tr>
                        <td class="cursor-pointer whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-500 dark:text-white">
                          <a
                            class="w-full"
                            href={`/collection/${collection.id}`}
                          >
                            {collection.name}
                          </a>
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {collection.description}
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
                          {!collection.is_public ? "✓" : ""}
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-left text-sm text-gray-500 dark:text-gray-300">
                          {new Date(
                            collection.created_at,
                          ).toLocaleDateString() +
                            " " +
                            //remove seconds from time
                            new Date(collection.created_at)
                              .toLocaleTimeString()
                              .replace(/:\d+\s/, " ")}
                        </td>
                        <Show
                          when={
                            props.user != undefined &&
                            props.user.id == collection.author_id
                          }
                        >
                          <td
                            classList={{
                              "relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0":
                                true,
                              "hidden block":
                                props.loggedUser == undefined ||
                                props.loggedUser.id != collection.author_id,
                            }}
                          >
                            <button
                              classList={{
                                "h-fit text-red-700 dark:text-red-400": true,
                                "animate-pulse": deleting(),
                              }}
                              onClick={() => deleteCollection(collection)}
                            >
                              <FiTrash class="h-5 w-5" />
                            </button>
                          </td>
                        </Show>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};
