export type TerrorSource = {
  path: string | number;
  message: string;
}[];
export type TerrorMessages = {
  path: string | number;
  message: string;
}[];

export type TgenericResponse = {
  statusCode: number;
  message: string;
  errorSources: TerrorSource;
};
