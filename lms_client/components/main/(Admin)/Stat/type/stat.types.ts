export type TRevenuePoint = {
  date: string;
  total: number;
};

export type TEnrollmentPoint = {
  date: string;
  count: number;
};

export type TAdminStats = {
  totalCourses: number;
  totalStudents: number;
  totalInstructors: number;
  publishedCourses: number;
  revenue: number;
  revenueOverTime: TRevenuePoint[];
  enrollmentsOverTime: TEnrollmentPoint[];
  averageCompletion: number;
};
