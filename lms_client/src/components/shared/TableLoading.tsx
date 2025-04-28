import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const TableDataLoading = () => {
  const columns = Array(5).fill(null);
  const rows = Array(4).fill(null);

  return (
    <div className="rounded-md bg-gray-50 border border-gray-300">
      <Table>
        <TableHeader>
          <TableRow>
            {columns?.map((_, index) => (
              <TableHead key={index} className="  text-center text-gray-900">
                <Skeleton className="h-4 w-26 mx-auto" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows?.map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns?.map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableDataLoading;
