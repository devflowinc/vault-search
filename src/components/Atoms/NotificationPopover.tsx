import {
  Transition,
  Popover,
  PopoverButton,
  PopoverPanel,
  Menu,
  MenuItem,
} from "solid-headless";
import {
  isFileUploadCompleteNotificationDTO,
  type NotificationDTO,
  type UserDTO,
  type FileUploadCompleteNotificationDTO,
  isVerificationNotificationDTO,
  NotificationWithPagesDTO,
  VerificationDTO,
} from "../../../utils/apiTypes";
import { IoNotificationsOutline } from "solid-icons/io";
import { For, Show, createEffect, createSignal } from "solid-js";
import { VsCheckAll, VsClose } from "solid-icons/vs";
import { BiRegularChevronLeft, BiRegularChevronRight } from "solid-icons/bi";

export const NotificationPopover = (props: { user: UserDTO | null }) => {
  const apiHost = import.meta.env.PUBLIC_API_HOST as string;
  const similarityScoreThreshold =
    (import.meta.env.SIMILARITY_SCORE_THRESHOLD as number | undefined) ?? 80;

  const [notifs, setNotifs] = createSignal<NotificationDTO[]>([]);
  const [page, setPage] = createSignal(1);
  const [fullCount, setFullCount] = createSignal(0);
  const [totalPages, setTotalPages] = createSignal(0);
  const [usingPanel, setUsingPanel] = createSignal(false);

  createEffect(() => {
    fetchNotifs();
  });

  const fetchNotifs = () => {
    void fetch(`${apiHost}/notifications/${page()}`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      void response.json().then((data) => {
        if (response.ok) {
          const notifData = data as NotificationWithPagesDTO;
          setNotifs(notifData.notifications);
          setTotalPages(notifData.total_pages);
          setFullCount(notifData.full_count);
        }
      });
    });
  };

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
        const isVerif = isVerificationNotificationDTO(notification);
        const isFileUpload = isFileUploadCompleteNotificationDTO(notification);
        setNotifs(
          notifs_inner.filter((notif) => {
            if (isVerif && isVerificationNotificationDTO(notif)) {
              return notif.card_uuid !== notification.card_uuid;
            } else if (
              isFileUpload &&
              isFileUploadCompleteNotificationDTO(notif)
            ) {
              return notif.collection_uuid !== notification.collection_uuid;
            } else {
              return true;
            }
          }),
        );
      }
    });
  };

  const markAllAsRead = () => {
    void fetch(`${apiHost}/notifications_readall`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        setNotifs([]);
      }
    });
  };

  function getTimeIn12HourFormat(date: Date): string {
    return date.toLocaleString("en-US", {
      hour12: true,
      year: "2-digit",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
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
              onClick={() => {
                setPage(1);
                fetchNotifs();
              }}
            >
              <IoNotificationsOutline class="mr-4 h-6 w-6 fill-current" />
              {notifs().length > 0 && (
                <span class="relative">
                  <div class="absolute right-3 top-0 h-2 w-2 rounded-full bg-red-500" />
                </span>
              )}
            </PopoverButton>
            <Transition
              show={isOpen() || usingPanel()}
              enter="transition duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <PopoverPanel
                unmount={true}
                class="absolute left-1/2  z-10  mt-5 h-fit w-fit -translate-x-[100%] transform rounded-md  bg-neutral-100  p-1 px-4 dark:bg-neutral-700 dark:text-white  sm:px-0"
                onMouseEnter={() => setUsingPanel(true)}
                onMouseLeave={() => setUsingPanel(false)}
                onClick={() => setState(true)}
              >
                <Menu class="h-0">
                  <MenuItem class="h-0" as="button" aria-label="Empty" />
                </Menu>
                <div class="e w-full  min-w-[200px] md:min-w-[300px]">
                  <div class="mb-1 flex items-center justify-center text-center align-middle text-sm font-semibold">
                    <div class="items-center text-center">
                      {"Notifications " +
                        (notifs().length > 0 ? `(${fullCount()} pending)` : "")}
                    </div>
                    <button
                      class="absolute right-2 flex justify-end"
                      onClick={() => markAllAsRead()}
                    >
                      <VsCheckAll class="h-4 w-4" />
                    </button>
                  </div>

                  <div class="scrollbar-track-rounded-md scrollbar-thumb-rounded-md flex max-h-[40vh] w-full transform flex-col space-y-1 overflow-hidden overflow-y-auto rounded-lg bg-neutral-100 shadow-lg drop-shadow-lg scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 dark:bg-neutral-700 dark:text-white dark:scrollbar-track-neutral-600 dark:scrollbar-thumb-neutral-500">
                    <For each={notifs()}>
                      {(notification) => {
                        const isVerif =
                          isVerificationNotificationDTO(notification);
                        const isFileUpload =
                          isFileUploadCompleteNotificationDTO(notification);
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
                                  <Show when={isVerif}>
                                    <span class="text-left">
                                      {isVerif &&
                                      notification.similarity_score >
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
                                          href={`/card/${
                                            (notification as VerificationDTO)
                                              .card_uuid
                                          }`}
                                          onClick={() => {
                                            markAsRead(notification);
                                            setState(true);
                                          }}
                                        >
                                          Your{" "}
                                          <text class="underline dark:text-acid-500">
                                            card
                                          </text>{" "}
                                          could not be verified
                                        </a>
                                      )}
                                    </span>
                                  </Show>
                                  <Show when={isFileUpload}>
                                    <span class="text-left">
                                      <a
                                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                        href={`/collection/${
                                          (
                                            notification as FileUploadCompleteNotificationDTO
                                          ).collection_uuid
                                        }`}
                                        onClick={() => {
                                          markAsRead(notification);
                                          setState(true);
                                        }}
                                      >
                                        Your{" "}
                                        <text class="underline dark:text-acid-500">
                                          document
                                        </text>{" "}
                                        collection has been uploaded and
                                        processed
                                      </a>
                                    </span>
                                  </Show>
                                </div>
                              </button>
                              <button>
                                <VsClose
                                  class="mt-1 fill-current text-lg"
                                  onClick={() => {
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
                    <div class="flex items-center justify-between">
                      <div />
                      <div class="flex items-center">
                        <div class="text-sm text-neutral-400">
                          {page()} / {totalPages()}
                        </div>
                        <button
                          class="disabled:text-neutral-400 dark:disabled:text-neutral-500"
                          disabled={page() == 1}
                          onClick={() => {
                            setState(true);
                            setPage((prev) => prev - 1);
                            fetchNotifs();
                          }}
                        >
                          <BiRegularChevronLeft class="h-6 w-6 fill-current" />
                        </button>
                        <button
                          class="disabled:text-neutral-400 dark:disabled:text-neutral-500"
                          disabled={page() == totalPages()}
                          onClick={() => {
                            setState(true);
                            setPage((prev) => prev + 1);
                            fetchNotifs();
                          }}
                        >
                          <BiRegularChevronRight class="h-6 w-6 fill-current" />
                        </button>
                      </div>
                    </div>
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
