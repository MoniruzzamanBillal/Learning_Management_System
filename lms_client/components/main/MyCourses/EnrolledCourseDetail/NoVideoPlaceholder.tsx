const NoVideoPlaceholder = () => {
  return (
    <div className="h-[26.5rem] w-full border border-dashed border-gray-200 rounded-xl flex flex-col justify-center items-center">
      <p className="text-gray-800 text-xl font-semibold">No video selected</p>
      <p className="text-gray-700 text-sm">
        Please select a module video to start watching.
      </p>
    </div>
  );
};

export default NoVideoPlaceholder;
