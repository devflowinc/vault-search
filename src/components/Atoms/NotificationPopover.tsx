import {
  Transition,
  Popover,
  PopoverButton,
  PopoverPanel,
  Menu,
  MenuItem,
} from "solid-headless";
import type { NotificationDTO, UserDTO } from "../../../utils/apiTypes";
import { IoNotificationsOutline } from "solid-icons/io";
import { For, createEffect, createSignal } from "solid-js";
import { VsClose } from "solid-icons/vs";

export const NotificationPopover = (props: { user: UserDTO | null }) => {
  const apiHost = import.meta.env.PUBLIC_API_HOST as string;
  const similarityScoreThreshold = import.meta.env
    .SIMILARITY_SCORE_THRESHOLD as number;

  const [notifs, setNotifs] = createSignal<NotificationDTO[]>([]);

  createEffect(() => {
    void fetch(`${apiHost}/notifications`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      void response.json().then((data) => {
        if (response.ok) {
          const notifs = data as NotificationDTO[];
          setNotifs(notifs.filter((notif) => !notif.user_read));
        }
      });
    });
  });

  const markAsRead = (notification: NotificationDTO) => {
    const notifs_inner = notifs();
    void fetch(`${apiHost}/notifications`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        notification_id: notification.id,
      }),
    }).then((response) => {
      if (response.ok) {
        setNotifs(
          notifs_inner.filter(
            (notif) => notif.card_uuid !== notification.card_uuid,
          ),
        );
      }
    });
  };
  function getTimeIn12HourFormat(date: Date): string {
    let hours: number = date.getHours();
    let minutes: number = date.getMinutes();
    let ampm: string = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be treated as 12

    // Add leading zeros to minutes if necessary
    const formattedMinutes: string =
      minutes < 10 ? "0" + minutes : String(minutes);

    return `${hours}:${formattedMinutes} ${ampm}`;
  }

  return (
    <Transition
      show={!!props.user}
      enter="transition duration-700"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Popover defaultOpen={false} class="relative flex items-center">
        {({ isOpen, setState }) => (
          <>
            <PopoverButton
              aria-label="Toggle user actions menu"
              classList={{ flex: true }}
            >
              <IoNotificationsOutline class="mr-4 h-6 w-6 fill-current" />
              {notifs().length > 0 && (
                <span class="relative">
                  <div class="absolute right-3 top-0 h-2 w-2 rounded-full bg-red-500" />
                </span>
              )}
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
                unmount={true}
                class="dark:text-whit  absolute  left-1/2  z-10 mt-5 h-fit w-fit -translate-x-[100%] transform  rounded-md  bg-neutral-100 p-1 px-4 dark:bg-neutral-700  sm:px-0"
              >
                <Menu class="h-0">
                  <MenuItem class="h-0" as="button" aria-label="Empty" />
                </Menu>
                <div class="e w-full  min-w-[200px] md:min-w-[300px]">
                  <div class="mb-1 text-center text-sm font-semibold">
                    {"Notifications " +
                      (notifs().length > 0
                        ? `(${notifs().length} pending)`
                        : "")}
                  </div>
                  <div class="flex flex-col space-y-1 overflow-hidden rounded-lg bg-neutral-100 shadow-lg drop-shadow-lg dark:bg-neutral-700 dark:text-white">
                    <For each={notifs()}>
                      {(notification) => {
                        return (
                          <div>
                            <div class="flex space-x-2 rounded-md px-2 hover:cursor-pointer focus:bg-neutral-100 focus:outline-none dark:hover:bg-neutral-600 dark:hover:bg-none dark:focus:bg-neutral-600">
                              <button
                                type="button"
                                classList={{
                                  "flex w-full items-center justify-between rounded p-1 focus:text-black focus:outline-none dark:hover:text-white dark:focus:text-white":
                                    true,
                                }}
                              >
                                <div class="flex flex-row justify-start space-x-2 py-2 ">
                                  <span class="text-left">
                                    {notification.similarity_score >
                                    similarityScoreThreshold ? (
                                      <a
                                        href={`/card/${notification.card_uuid}`}
                                        onClick={() => {
                                          markAsRead(notification);
                                          setState(true);
                                        }}
                                      >
                                        Your{" "}
                                        <text class="underline dark:text-acid-500">
                                          card
                                        </text>{" "}
                                        was approved! 🎉
                                      </a>
                                    ) : (
                                      <a
                                        href={`/card/${notification.card_uuid}`}
                                        onClick={() => {
                                          markAsRead(notification);
                                          setState(true);
                                        }}
                                      >
                                        Your{" "}
                                        <text class="underline dark:text-acid-500">
                                          card
                                        </text>{" "}
                                        could not be verified.
                                      </a>
                                    )}
                                  </span>
                                </div>
                              </button>
                              <button>
                                <VsClose
                                  class="mt-1 fill-current text-lg"
                                  onClick={(e) => {
                                    markAsRead(notification);
                                    setState(true);
                                  }}
                                />
                              </button>
                              <text class="absolute right-1 text-xs text-gray-300">
                                {getTimeIn12HourFormat(
                                  new Date(notification.created_at),
                                )}
                              </text>
                            </div>
                          </div>
                        );
                      }}
                    </For>
                  </div>
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    </Transition>
  );
};
