import { createSlice } from "@reduxjs/toolkit";
import { IInitialState } from "./permissionTypes";

const initialState: IInitialState = {
  hasPermission: false,
  adminOrganizationPermission: false,
};

const permissionSlice = createSlice({
  name: "filtering",
  initialState,
  reducers: {
    setPermission: (state, action) => {
      state.hasPermission = action.payload;
    },
    setAdminOrganizationPermission: (state, action) => {
      state.adminOrganizationPermission = action.payload;
    },
  },
});

export const { setPermission, setAdminOrganizationPermission } =
  permissionSlice.actions;
export default permissionSlice.reducer;
