"use client";

import {
  CellContext,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  HeaderContext,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

import { createRowSelectionColumn } from "./createRowSelectionColumn";
import TableContent from "./TableContent";
import { TTableFilterGroup } from "./TableFilter";
import TableToolbar from "./TableToolbar";

type TGenericTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  activeTab?: string;

  tableFilterOption?: TTableFilterGroup[];
  filters?: Record<string, string[]>;
  setFilters?: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  showToolbar?: boolean;
  showDateFilter?: boolean;

  selectedDate?: Date;
  setSelectedDate?: React.Dispatch<React.SetStateAction<Date | undefined>>;
  showSerialNumber?: boolean;

  //

  enableRowSelection?: boolean;
  onSelectedRowsChange?: (rows: TData[]) => void;
};

export default function GenericTableComponent<TData>({
  data,
  columns,
  activeTab,

  tableFilterOption,
  filters,
  setFilters,
  showToolbar = true,
  showDateFilter = false,
  showSerialNumber = true,

  selectedDate,
  setSelectedDate,

  enableRowSelection = false,
  onSelectedRowsChange,
}: TGenericTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const finalColumns = useMemo(() => {
    if (!enableRowSelection) return columns;

    const rowSelectCol = createRowSelectionColumn<TData>();

    return columns.map((col, index) => {
      if (index !== 0) return col;

      return {
        ...col,
        id: col.id || `col-${index}`,
        header: (context: HeaderContext<TData, unknown>) => {
          const checkbox =
            typeof rowSelectCol.header === "function"
              ? rowSelectCol.header(context)
              : rowSelectCol.header;

          return (
            <div className="flex items-center gap-2">
              {checkbox}
              {typeof col.header === "function"
                ? (
                    col.header as (
                      context: HeaderContext<TData, unknown>,
                    ) => React.ReactNode
                  )(context)
                : col.header}
            </div>
          );
        },
        cell: (context: CellContext<TData, unknown>) => {
          const checkbox =
            typeof rowSelectCol.cell === "function"
              ? rowSelectCol.cell(context)
              : rowSelectCol.cell;

          return (
            <div className="flex items-center gap-2">
              {checkbox}
              {context.renderValue() as React.ReactNode}
            </div>
          );
        },
      };
    });
  }, [columns, enableRowSelection]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      sorting,
      pagination,
      rowSelection,
    },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    if (!onSelectedRowsChange) return;

    const selectedRows = table
      ?.getSelectedRowModel()
      ?.rows?.map((row) => row?.original);

    onSelectedRowsChange(selectedRows);
  }, [rowSelection, onSelectedRowsChange, table]);

  return (
    <>
      {showToolbar && (
        <div className="mb-2   ">
          <TableToolbar
            activeTab={activeTab}
            tableFilterOption={tableFilterOption}
            filters={filters}
            setFilters={setFilters}
            showDateFilter={showDateFilter}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
      )}

      <div className=" ">
        <TableContent table={table} showSerialNumber={showSerialNumber} />
      </div>
    </>
  );
}
