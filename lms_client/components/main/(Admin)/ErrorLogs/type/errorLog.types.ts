export type TErrorSource = {
  path: string | number;
  message: string;
};

export type TErrorLog = {
  _id: string;
  message: string;
  statusCode: number;
  errorSources: TErrorSource[];
  stack?: string;
  method: string;
  path: string;
  ip?: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  userRole?: string;
  createdAt: string;
};
