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
    <div className="CategoryFilterContainer sticky top-[6rem]">
      <div className="CategoryFilterWrapper shadow-md rounded border border-gray-400 py-2 px-3">
        <p className=" text-xl font-medium mb-3 text-gray-800  ">Category :</p>

        <div className="categoryData">
          <ul className="text-sm font-medium ">
            {categoryOptions?.map((item, ind: number) => (
              <li key={ind} className="w-full border-b border-gray-400">
                <div className="flex items-center ps-3">
                  <input
                    id={item?.value}
                    type="radio"
                    value={item?.value}
                    onChange={() => setcategoryType(item?.value)}
                    checked={categoryType === item?.value}
                    name="list-radio"
                    className="w-4 h-4  border-gray-300"
                  />
                  <label
                    htmlFor={item?.value}
                    className="w-full py-3 ms-2 text-xs font-medium text-gray-800"
                  >
                    {item?.label}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/*  */}
      </div>
    </div>
  );
};

export default CategoryFilter;
