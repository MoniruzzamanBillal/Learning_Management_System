"use client";

import BaseModal from "@/components/shared/Modal/BaseModal";
import { TErrorLog } from "@/types/errorLog.types";
import { format } from "date-fns";

type TErrorLogDetailModalProps = {
  open: boolean;
  onClose: () => void;
  errorLog: TErrorLog | undefined;
};

export default function ErrorLogDetailModal({
  open,
  onClose,
  errorLog,
}: TErrorLogDetailModalProps) {
  if (!errorLog) return null;

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Error Details"
      className="max-w-[95vw] w-[90vw] "
    >
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-neutral-400">Time</p>
            <p className="font-medium">
              {format(new Date(errorLog.createdAt), "dd-MMM-yyyy HH:mm:ss")}
            </p>
          </div>
          <div>
            <p className="text-neutral-400">Status Code</p>
            <p className="font-medium">{errorLog.statusCode}</p>
          </div>
          <div>
            <p className="text-neutral-400">Method</p>
            <p className="font-medium">{errorLog.method}</p>
          </div>
          <div>
            <p className="text-neutral-400">Path</p>
            <p className="font-medium break-all">{errorLog.path}</p>
          </div>
          <div>
            <p className="text-neutral-400">IP</p>
            <p className="font-medium">{errorLog.ip ?? "—"}</p>
          </div>
          <div>
            <p className="text-neutral-400">User</p>
            <p className="font-medium">
              {errorLog.userId?.email ?? "—"}
              {errorLog.userRole ? ` (${errorLog.userRole})` : ""}
            </p>
          </div>
        </div>

        <div>
          <p className="text-neutral-400">Message</p>
          <p className="font-medium">{errorLog.message}</p>
        </div>

        {errorLog.errorSources?.length > 0 && (
          <div>
            <p className="text-neutral-400 mb-1">Error Sources</p>
            <ul className="list-disc pl-5 space-y-1">
              {errorLog.errorSources.map((source, index) => (
                <li key={index}>
                  <span className="font-medium">{source.path}</span>:{" "}
                  {source.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {errorLog.stack && (
          <div>
            <p className="text-neutral-400 mb-1">Stack Trace</p>
            <pre className="max-h-64 overflow-auto rounded-md bg-neutral-900 p-3 font-mono text-xs text-neutral-100 whitespace-pre-wrap">
              {errorLog.stack}
            </pre>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
