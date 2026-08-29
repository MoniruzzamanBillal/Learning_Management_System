export type TQuizOptionManage = {
  id?: string;
  optionText: string;
  isCorrect: boolean;
  optionOrder: number;
};

export type TQuizQuestionManage = {
  id?: string;
  questionText: string;
  questionOrder: number;
  options: TQuizOptionManage[];
};

export type TQuizManage = {
  id: string;
  moduleId: string;
  instructorId: string;
  title: string;
  description?: string | null;
  questions: TQuizQuestionManage[];
};

export type TQuizFormData = {
  title: string;
  description?: string;
  questions: TQuizQuestionManage[];
};
