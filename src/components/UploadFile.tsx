import {
  BiRegularLogIn,
  BiRegularXCircle,
  BiSolidFolder,
} from "solid-icons/bi";
import { BsCloudUpload } from "solid-icons/bs";
import { Show, createSignal } from "solid-js";
import { FullScreenModal } from "./Atoms/FullScreenModal";

export const UploadFile = () => {
  const apiHost = import.meta.env.PUBLIC_API_HOST;
  const [file, setFile] = createSignal<File | undefined>();
  const [_private, setPrivate] = createSignal(false);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [showNeedLoginModal, setShowNeedLoginModal] = createSignal(false);
  const [errorText, setErrorText] = createSignal("");

  const handleDragUpload = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(e.dataTransfer?.files[0]);
  };
  const handleDirectUpload = (e: Event & { target: HTMLInputElement }) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(e.target.files![0]);
  };
  const submitEvidence = async (e: Event) => {
    if (!file()) {
      setErrorText("Please select a file to upload");
      setIsSubmitting(false);
      return;
    }
    setErrorText("");
    e.preventDefault();
    setIsSubmitting(true);
    const toBase64 = (file: File) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
    let base64File = await toBase64(file()!);
    base64File = (base64File as string)
      .toString()
      .split(",")[1]
      .replace(/\+/g, "-") // Convert '+' to '-'
      .replace(/\//g, "_") // Convert '/' to '_'
      .replace(/=+$/, ""); // Remove ending '='
    const file_name = file()?.name;
    const file_mime_type = file()?.type;
    const body = JSON.stringify({
      base64_docx_file: base64File,
      file_name: file_name,
      file_mime_type: file_mime_type,
      private: _private(),
    });
    void fetch(`${apiHost}/file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: body,
    }).then((response) => {
      if (response.status === 401) {
        setShowNeedLoginModal(true);
        setIsSubmitting(false);
        return;
      }
      response.json().then((data) => {
        setIsSubmitting(false);
        console.log(data.collection_id);
        window.location.href = `/collection/${data.collection_id}`;
      });
    });
  };
  return (
    <>
      <div class="text-center text-red-500">{errorText()}</div>
      <div class="my-4 flex w-full flex-col gap-y-3">
        <label
          for="dropzone-file"
          class="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-neutral-100 hover:bg-neutral-200 dark:border-gray-600 dark:bg-neutral-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={handleDragUpload}
        >
          <div class="flex flex-col items-center justify-center pb-6 pt-5">
            <Show when={file() == undefined}>
              <BsCloudUpload class="mb-3 h-10 w-10 text-gray-400" />
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">Click to upload</span> or drag and
                drop
              </p>
            </Show>
            <Show when={file() != undefined}>
              <div class="flex items-center">
                <BiSolidFolder
                  classList={{ "mr-1 mb-2": true }}
                  color="#6b7280"
                />
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">{file()?.name}</span>
                </p>
              </div>
            </Show>
          </div>
          <input
            id="dropzone-file"
            type="file"
            class="hidden"
            accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleDirectUpload}
          />
        </label>
        <label>
          <span class="mr-2 items-center align-middle">Private?</span>
          <input
            type="checkbox"
            onChange={(e) => setPrivate(e.target.checked)}
            class="h-4 w-4 rounded-sm	border-gray-300 bg-neutral-500 align-middle accent-turquoise focus:ring-neutral-200 dark:border-neutral-700 dark:focus:ring-neutral-600"
          />
        </label>
        <div class="flex flex-row items-center space-x-2">
          <button
            class="w-fit rounded bg-neutral-100 p-2 hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-800"
            type="submit"
            disabled={isSubmitting()}
            onClick={submitEvidence}
          >
            <Show when={!isSubmitting()}>Submit New Evidence</Show>
            <Show when={isSubmitting()}>
              <div class="animate-pulse">Submitting...</div>
            </Show>
          </button>
        </div>
      </div>
      <Show when={showNeedLoginModal()}>
        <FullScreenModal
          isOpen={showNeedLoginModal}
          setIsOpen={setShowNeedLoginModal}
        >
          <div class="min-w-[250px] sm:min-w-[300px]">
            <BiRegularXCircle class="mx-auto h-8 w-8 !text-red-500" />
            <div class="mb-4 text-xl font-bold">
              Cannot upload files without an account
            </div>
            <div class="mx-auto flex w-fit flex-col space-y-3">
              <a
                class="flex space-x-2 rounded-md bg-magenta-500 p-2 text-white"
                href="/auth/register"
              >
                Register
                <BiRegularLogIn class="h-6 w-6" />
              </a>
            </div>
          </div>
        </FullScreenModal>
      </Show>
    </>
  );
};
