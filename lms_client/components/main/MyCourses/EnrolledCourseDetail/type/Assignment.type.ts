export type TAssignmentSubmissionTake = {
  content: string;
  status: "submitted" | "graded";
  score: number | null;
  feedback: string | null;
  submissionVersion: number;
};

export type TAssignmentTake = {
  assignmentId: string;
  title: string;
  instructions: string;
  dueDate: string | null;
  submission: TAssignmentSubmissionTake | null;
};
