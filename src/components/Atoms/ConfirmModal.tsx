import { Accessor, Setter, Show } from "solid-js";
import { FullScreenModal } from "./FullScreenModal";
import { BiRegularLogIn, BiRegularXCircle } from "solid-icons/bi";

interface ConfirmModalProps {
  showConfirmModal: Accessor<boolean>;
  setShowConfirmModal: Setter<boolean>;
  onConfirm: Accessor<() => void>;
}

export const ConfirmModal = (props: ConfirmModalProps) => {
  return (
    <Show when={props.showConfirmModal()}>
      <FullScreenModal
        isOpen={props.showConfirmModal}
        setIsOpen={props.setShowConfirmModal}
      >
        <div class="min-w-[250px] sm:min-w-[300px]">
          <BiRegularXCircle class="mx-auto h-8 w-8 fill-current !text-red-500" />
          <div class="mb-4 text-xl font-bold">
            Are you sure you want to delete this card?
          </div>
          <div class="mx-auto flex w-fit space-x-3">
            <button
              class="flex items-center space-x-2 rounded-md bg-magenta-500 p-2 text-white"
              onClick={() => {
                props.setShowConfirmModal(false);
                props.onConfirm()();
              }}
            >
              Delete
              <BiRegularLogIn class="h-6 w-6 fill-current" />
            </button>
            <button
              class="flex space-x-2 rounded-md bg-neutral-500 p-2 text-white"
              onClick={() => props.setShowConfirmModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </FullScreenModal>
    </Show>
  );
};
