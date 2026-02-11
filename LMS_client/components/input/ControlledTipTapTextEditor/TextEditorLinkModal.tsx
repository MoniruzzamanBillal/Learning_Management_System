// components/TextEditorLinkModal.tsx
"use client";

interface ITextEditorLinkModalProps {
  isOpen: boolean;
  linkUrl: string;
  onLinkUrlChange: (url: string) => void;
  onAddLink: () => void;
  onClose: () => void;
}

export default function TextEditorLinkModal({
  isOpen,
  linkUrl,
  onLinkUrlChange,
  onAddLink,
  onClose,
}: ITextEditorLinkModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h3 className="text-lg font-semibold mb-4">Add Link</h3>
        <input
          type="url"
          value={linkUrl}
          onChange={(e) => onLinkUrlChange(e.target.value)}
          placeholder="https://example.com"
          className="w-full p-2 border rounded mb-4"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onAddLink}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Link
          </button>
        </div>
      </div>
    </div>
  );
}
