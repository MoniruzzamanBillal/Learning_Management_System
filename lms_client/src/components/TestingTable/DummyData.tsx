export type TPayment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const dummyPaymentData: TPayment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "1a2b3c4d",
    amount: 250,
    status: "success",
    email: "john.doe@example.com",
  },
  {
    id: "5e6f7g8h",
    amount: 90,
    status: "failed",
    email: "jane.smith@example.com",
  },
  {
    id: "9i0j1k2l",
    amount: 180,
    status: "success",
    email: "alice.brown@example.com",
  },
  {
    id: "9i0j1k2l",
    amount: 180,
    status: "success",
    email: "alice.brown@example.com",
  },
  {
    id: "3m4n5o6p",
    amount: 75,
    status: "pending",
    email: "test.user@example.com",
  },
  {
    id: "3m4n5o6p",
    amount: 75,
    status: "pending",
    email: "test.user@example.com",
  },
];
