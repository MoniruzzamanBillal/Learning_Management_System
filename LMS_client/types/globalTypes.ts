export type TApiResponse<Tdata> = {
  success: boolean;
  message: string;
  data: Tdata;
};
