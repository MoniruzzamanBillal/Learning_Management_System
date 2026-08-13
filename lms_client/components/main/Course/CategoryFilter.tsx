const categoryOptions = [
  { value: "", label: "All" },
  { value: "Web Development", label: "Web Development" },
  { value: "App Development", label: "App Development" },
  { value: "Software Development", label: "Software Development" },
  { value: "Cybersecurity", label: "Cybersecurity" },
  { value: "DevOps", label: "DevOps" },
  { value: "Cloud Computing", label: "Cloud Computing" },
  { value: "UI/UX Design", label: "UI/UX Design" },
  { value: "Blockchain Development", label: "Blockchain Development" },
];

type TCategoryFilterProps = {
  categoryType: string;
  setcategoryType: (category: string) => void;
};

const CategoryFilter = ({
  categoryType,
  setcategoryType,
}: TCategoryFilterProps) => {
  return (
    <div className="sticky top-20">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="font-semibold text-gray-900 text-sm mb-3">Category</p>
        <div className="flex flex-col gap-1">
          {categoryOptions.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setcategoryType(item.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                categoryType === item.value
                  ? "bg-indigo-50 text-prime-100 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
