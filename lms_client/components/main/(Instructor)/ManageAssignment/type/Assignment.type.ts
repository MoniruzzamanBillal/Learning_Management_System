export type TAssignmentManage = {
  id: string;
  moduleId: string;
  instructorId: string;
  title: string;
  instructions: string;
  dueDate: string | null;
};

export type TAssignmentFormData = {
  title: string;
  instructions: string;
  dueDate?: string;
};

export type TAssignmentSubmissionManage = {
  id: string;
  assignmentId: string;
  userId: string;
  courseId: string;
  content: string;
  submissionVersion: number;
  status: "submitted" | "graded";
  score: number | null;
  feedback: string | null;
  gradedByInstructorId: string | null;
  submittedAt: string;
  gradedAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
};
