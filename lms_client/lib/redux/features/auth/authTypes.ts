export interface IUserInformation {
  _id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  contact: string;
  activeStatus: boolean;
  role: string;
}

export interface IDataItem {
  id: number;
  name: string;
}

export interface IInitialState {
  loading: boolean;
  userInformation: IUserInformation;
  data: unknown[];
  // data: IDataItem[]; // Array of IDataItem objects
}
