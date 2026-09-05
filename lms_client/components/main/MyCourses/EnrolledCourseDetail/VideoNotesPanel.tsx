"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteVideoNoteFunction,
  saveVideoNoteFunction,
} from "@/functions/videoNote.functions";
import { useDeleteData, useFetchData, useUpdateData } from "@/hooks/useApi";
import { useRef } from "react";
import { TVideoNote } from "./type/VideoNote.type";

type TProps = {
  courseId: string;
  videoId: string;
};

const VideoNotesPanel = ({ courseId, videoId }: TProps) => {
  const queryKey = [`video-note-${courseId}-${videoId}`];
  const endpoint = `/video-note/${courseId}/${videoId}`;

  const { data: noteData, isLoading } = useFetchData<TVideoNote | null>(
    queryKey,
    endpoint,
    { enabled: !!courseId && !!videoId },
  );

  const note = noteData?.data ?? null;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutateAsync: saveNote, isPending: isSaving } = useUpdateData([
    queryKey,
  ]);
  const { mutateAsync: deleteNote, isPending: isDeleting } = useDeleteData([
    queryKey,
  ]);

  // ! for saving the current textarea content as this video's note
  const handleSave = async () => {
    const content = textareaRef.current?.value?.trim() ?? "";
    if (!content) return;

    await saveVideoNoteFunction(
      { url: endpoint, payload: { content } },
      saveNote,
    );
  };

  // ! for deleting this video's note
  const handleDelete = async () => {
    await deleteVideoNoteFunction({ url: endpoint }, deleteNote);
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="VideoNotesPanel bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mt-4">
      <p className="text-lg font-medium mb-2">My Note</p>

      <Textarea
        key={videoId}
        ref={textareaRef}
        defaultValue={note?.content ?? ""}
        placeholder="No note yet — write one while you watch"
        rows={4}
        className="mb-3"
      />

      <div className="flex items-center gap-2">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Note"}
        </Button>

        {note && (
          <Button variant="outline" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default VideoNotesPanel;
