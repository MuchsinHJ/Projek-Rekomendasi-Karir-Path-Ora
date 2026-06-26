import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Trash2,
  X,
} from "lucide-react";
import { AnalysisHistoryItem } from "../../types/dashboard";
import { cvService } from "../../services/cv.service";
import { parseApiError } from "../../utils/error";

interface Props {
  history: AnalysisHistoryItem[];
  onDeleted?: () => Promise<void> | void;
}

const Riwayat: React.FC<Props> = ({ history, onDeleted }) => {
  const navigate = useNavigate();
  const itemsPerPage = 5;
  const [deletingCvId, setDeletingCvId] = useState<string | null>(null);
  const [pendingDeleteCvId, setPendingDeleteCvId] = useState<string | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(history.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedHistory = history.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const openDeleteModal = (
    event: React.MouseEvent<HTMLButtonElement>,
    cvId: string,
  ) => {
    event.stopPropagation();
    if (!cvId || deletingCvId) return;
    setDeleteError(null);
    setPendingDeleteCvId(cvId);
  };

  const closeDeleteModal = () => {
    if (deletingCvId) return;
    setPendingDeleteCvId(null);
  };

  const handleDelete = async () => {
    if (!pendingDeleteCvId || deletingCvId) return;

    setDeletingCvId(pendingDeleteCvId);
    setDeleteError(null);

    try {
      await cvService.deleteCV(pendingDeleteCvId);
      await onDeleted?.();
      setPendingDeleteCvId(null);
    } catch (error) {
      setDeleteError(parseApiError(error));
    } finally {
      setDeletingCvId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden font-['Newsreader']">
      <div className="flex flex-col gap-3 px-6 py-4 border-b border-gray-100 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-gray-900">Upload History</h2>
        {history.length > itemsPerPage && (
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {safeCurrentPage}/{totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={safeCurrentPage === 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-[#102619] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous history"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={goToNextPage}
                disabled={safeCurrentPage === totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-[#102619] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next history"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {deleteError && (
        <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {deleteError}
        </div>
      )}

      {history.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {paginatedHistory.map((item) => (
            <div
              key={item.id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/analysis/${item.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="rounded-xl bg-[#F4F9F4] p-2 border border-emerald-100 text-emerald-800">
                    <FileText size={18} />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {item.predicted_category}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("en-US")
                        : "-"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {Math.round(item.confidence * 100)}%
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 capitalize">
                    {item.status === "success"
                      ? "Success"
                      : item.status === "pending"
                      ? "Processing"
                      : "Failed"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(event) => openDeleteModal(event, item.cv_id)}
                  disabled={!item.cv_id || deletingCvId === item.cv_id}
                  className="ml-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Delete CV"
                  title="Delete CV"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-6 py-12 text-center flex flex-col items-center justify-center">
          <div className="bg-gray-100 p-3 rounded-full mb-3 text-gray-400">
            <FileText size={24} />
          </div>
          <p className="text-gray-900 text-sm font-bold">
            No documents have been uploaded yet.
          </p>
        </div>
      )}

      {pendingDeleteCvId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={closeDeleteModal}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeDeleteModal}
              disabled={!!deletingCvId}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close delete confirmation"
            >
              <X size={18} />
            </button>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>

            <h3 className="pr-8 text-2xl font-semibold text-red-700 font-['Newsreader']">
              Delete CV?
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              This CV and its related analysis results will be removed from
              your dashboard.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={!!deletingCvId}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!!deletingCvId}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={16} />
                {deletingCvId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Riwayat;
