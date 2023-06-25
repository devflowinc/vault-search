/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BiRegularLogIn, BiRegularXCircle } from "solid-icons/bi";
import { JSX, Show, createSignal, onMount } from "solid-js";
import { isActixApiDefaultError } from "../../utils/apiTypes";
import { FullScreenModal } from "./Atoms/FullScreenModal";
import type { TinyMCE } from "../../public/tinymce/tinymce";

const SearchForm = () => {
  const apiHost = import.meta.env.PUBLIC_API_HOST;
  const [evidenceLink, setEvidenceLink] = createSignal("");
  const [errorText, setErrorText] = createSignal<
    string | number | boolean | Node | JSX.ArrayElement | null | undefined
  >("");
  const [errorFields, setErrorFields] = createSignal<string[]>([]);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [showNeedLoginModal, setShowNeedLoginModal] = createSignal(false);
  const [_private, setPrivate] = createSignal(false);

  const submitEvidence = (e: Event) => {
    e.preventDefault();
    const cardHTMLContentValue = (
      window as any
    ).tinymce.activeEditor.getContent();
    const cardTextContentValue = (window as any).tinyMCE.activeEditor.getBody()
      .textContent;
    const evidenceLinkValue = evidenceLink();
    if (!cardTextContentValue || !evidenceLinkValue) {
      const errors: string[] = [];
      if (!cardTextContentValue) {
        errors.push("cardContent");
      }
      if (!evidenceLinkValue) {
        errors.push("evidenceLink");
      }
      setErrorFields(errors);
      return;
    }
    setErrorFields([]);
    setIsSubmitting(true);
    void fetch(`${apiHost}/card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        content: cardTextContentValue,
        card_html: cardHTMLContentValue,
        link: evidenceLinkValue,
        private: _private(),
      }),
    }).then((response) => {
      if (response.status === 401) {
        setShowNeedLoginModal(true);
        setIsSubmitting(false);
        return;
      }
        
    response.json().then((data) => {
      if (data.duplicate) {
        window.location.href = `/card/${data.card_metadata.id}?collisions=${data.duplicate}`;
        return;
      }
      window.location.href = `/card/${data.card_metadata.id}`;
      return;
    });

      
    });
    if (errorFields().includes("cardContent")) {
      (window as any).tinymce.activeEditor.focus();
    }
  };
  onMount(() => {
    const options = {
      selector: "#search-query-textarea",
      height: "100%",
      width: "100%",
      plugins: [
        "advlist",
        "autoresize",
        "autolink",
        "lists",
        "link",
        "image",
        "charmap",
        "preview",
        "anchor",
        "searchreplace",
        "visualblocks",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "help",
        "wordcount",
      ],
      autoresize_bottom_margin: 150,
      skin: document.documentElement.classList.contains("dark")
        ? "oxide-dark"
        : "oxide",
      content_css: document.documentElement.classList.contains("dark")
        ? "dark"
        : "default",
      toolbar:
        "undo redo | blocks | " +
        "bold italic backcolor | alignleft aligncenter " +
        "alignright alignjustify | bullist numlist outdent indent | " +
        "removeformat | help",
      content_style:
        "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
      menubar: false,
      entity_encoding: "raw",
      entities: "160,nbsp,38,amp,60,lt,62,gt",
    };
    const tinyMCE: TinyMCE = (window as any).tinymce;
    void tinyMCE.init(options as any);
  });

  return (
    <>
      <form
        class="my-8 flex h-full w-full flex-col space-y-4 text-neutral-800 dark:text-white"
        onSubmit={(e) => {
          e.preventDefault();
          submitEvidence(e);
        }}
      >
        <div class="text-center text-red-500">{errorText()}</div>
        <div class="flex flex-col space-y-2">
          <div>Link to evidence*</div>
          <input
            type="url"
            value={evidenceLink()}
            onInput={(e) => setEvidenceLink(e.target.value)}
            classList={{
              "w-full bg-neutral-100 rounded-md px-4 py-1 dark:bg-neutral-700":
                true,
              "border border-red-500": errorFields().includes("evidenceLink"),
            }}
          />
        </div>
        <div class="flex flex-col space-y-2">
          <div>Card Content*</div>

          <textarea id="search-query-textarea" />
        </div>
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
          >
            <Show when={!isSubmitting()}>Submit New Evidence</Show>
            <Show when={isSubmitting()}>
              <div class="animate-pulse">Submitting...</div>
            </Show>
          </button>
        </div>
      </form>
      <Show when={showNeedLoginModal()}>
        <FullScreenModal
          isOpen={showNeedLoginModal}
          setIsOpen={setShowNeedLoginModal}
        >
          <div class="min-w-[250px] sm:min-w-[300px]">
            <BiRegularXCircle class="mx-auto h-8 w-8 !text-red-500" />
            <div class="mb-4 text-xl font-bold">
              Cannot add evidence without an account
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

export default SearchForm;
