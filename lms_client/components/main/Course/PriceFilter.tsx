import { Input } from "@/components/ui/input";

type TPriceFilterProps = {
  minPrice: string;
  maxPrice: string;
  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;
};

const PriceFilter = ({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
}: TPriceFilterProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mt-4">
      <p className="font-semibold text-gray-900 text-sm mb-3">Price Range</p>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="text-sm"
        />
        <span className="text-gray-400 text-sm">-</span>
        <Input
          type="number"
          min={0}
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="text-sm"
        />
      </div>
    </div>
  );
};

export default PriceFilter;
