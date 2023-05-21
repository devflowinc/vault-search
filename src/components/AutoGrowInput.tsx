import { BiRegularSearch } from 'solid-icons/bi';

const AutoGrowInput = () => {

  const handleInput = (event: any) => {
    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + "px";
  }

  return (
    <div class="relative mt-2 rounded-md shadow-sm w-full max-w-2xl ">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <BiRegularSearch />
      </div>
      <textarea
        onInput={handleInput}
        class="resize-none bg-transparent overflow-hidden rounded-full w-full h-10 hover:bg-gray-700 focus:bg-gray-700 focus:border-0 text-white pl-10"
      />
    </div>
  );
};

export default AutoGrowInput;
function afterEffects(arg0: () => void) {
    throw new Error('Function not implemented.');
}

