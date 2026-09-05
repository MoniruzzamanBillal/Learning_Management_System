export type TQuizOptionTake = {
  optionId: string;
  optionText: string;
  isCorrect?: boolean;
  wasSelected?: boolean;
};

export type TQuizQuestionTake = {
  questionId: string;
  questionText: string;
  options: TQuizOptionTake[];
};

export type TQuizTakeQuestionMode = {
  quizId: string;
  title: string;
  description?: string | null;
  questions: TQuizQuestionTake[];
};

export type TQuizTakeResultMode = {
  attemptId: string;
  score: number;
  totalQuestions: number;
  questions: TQuizQuestionTake[];
};

export type TQuizTakeData = TQuizTakeQuestionMode | TQuizTakeResultMode;
