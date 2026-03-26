import { Checkbox } from "@/components/ui/checkbox";
import { CellContext, ColumnDef, HeaderContext } from "@tanstack/react-table";

export const createRowSelectionColumn = <TData,>(): ColumnDef<TData> => ({
  id: "select",
  size: 48,
  header: (context: HeaderContext<TData, unknown>) => (
    <Checkbox
      className=" border-2 border-neutral-400  rounded-[6px] flex justify-center items-center "
      checked={context.table.getIsAllPageRowsSelected()}
      onCheckedChange={(value) =>
        context.table.toggleAllPageRowsSelected(!!value)
      }
      aria-label="Select all"
    />
  ),
  cell: (context: CellContext<TData, unknown>) => (
    <Checkbox
      className=" border-2 border-neutral-400  rounded-[6px] flex justify-center items-center  "
      checked={context.row.getIsSelected()}
      onCheckedChange={(value) => context.row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
});
