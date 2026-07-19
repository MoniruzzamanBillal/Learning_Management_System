"use client";

import PageHeader from "@/components/shared/PageHeader/PageHeader";
import GenericTableComponent from "@/components/shared/table/GenericTableComponent";
import TableDataLoading from "@/components/shared/TableLoading";
import { useFetchData } from "@/hooks/useApi";
import { TErrorLog } from "@/types/errorLog.types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { useMemo, useState } from "react";
import ErrorLogDetailModal from "./ErrorLogDetailModal";

export default function ErrorLogsPage() {
  const { data: errorLogData, isLoading } = useFetchData<TErrorLog[]>(
    ["error-logs"],
    "/error-log",
  );

  const [selectedErrorId, setSelectedErrorId] = useState<string | null>(null);

  const errorLogColumns = useMemo<ColumnDef<TErrorLog>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: "Time",
        enableSorting: true,
        cell: ({ row }) => (
          <p className="whitespace-nowrap">
            {format(new Date(row.original.createdAt), "dd-MMM-yyyy HH:mm:ss")}
          </p>
        ),
      },
      {
        accessorKey: "statusCode",
        header: "Status",
        enableSorting: true,
        cell: ({ row }) => {
          const statusCode = row.original.statusCode;
          const isServerError = statusCode >= 500;
          return (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isServerError
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {statusCode}
            </span>
          );
        },
      },
      {
        accessorKey: "method",
        header: "Method",
        enableSorting: true,
      },
      {
        accessorKey: "path",
        header: "Path",
        enableSorting: false,
        cell: ({ row }) => (
          <p className="max-w-[220px] truncate" title={row.original.path}>
            {row.original.path}
          </p>
        ),
      },
      {
        accessorKey: "message",
        header: "Message",
        enableSorting: false,
        cell: ({ row }) => (
          <p className="max-w-[280px] truncate" title={row.original.message}>
            {row.original.message}
          </p>
        ),
      },
      {
        id: "user",
        header: "User",
        enableSorting: false,
        cell: ({ row }) => <p>{row.original.userId?.email ?? "—"}</p>,
      },
      {
        id: "actions",
        header: "Action",
        enableSorting: false,
        cell: ({ row }) => (
          <button
            onClick={() => setSelectedErrorId(row.original._id)}
            className="text-neutral-500 hover:text-neutral-900"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
        ),
      },
    ],
    [],
  );

  const selectedError = errorLogData?.data?.find(
    (log) => log._id === selectedErrorId,
  );

  let content = null;

  if (isLoading) {
    content = <TableDataLoading />;
  } else if (errorLogData?.data) {
    content = (
      <GenericTableComponent
        data={errorLogData.data}
        columns={errorLogColumns}
        showToolbar={false}
      />
    );
  }

  return (
    <div className="ErrorLogsContainer">
      <div className="ErrorLogsWrapper bg-gray-100/90 border border-gray-300 shadow rounded-md p-3">
        <div className="mb-6">
          <PageHeader headerTitle="Error Logs" showAddButton={false} />
        </div>

        {content}

        <ErrorLogDetailModal
          open={!!selectedErrorId}
          onClose={() => setSelectedErrorId(null)}
          errorLog={selectedError}
        />
      </div>
    </div>
  );
}
