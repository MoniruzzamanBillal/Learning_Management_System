import { createSlice } from "@reduxjs/toolkit";
import { IInitialState } from "./filterTypes";

const initialState: IInitialState = {
  sortBy: [],
  resourceTypes: [],
  languages: [],
  keywords: [],
  courseCategories: [],
  level: [],
  organizationIds: [],
  newsTags: [],
  newsCategories: [],
  eventTags: [],
  eventCategories: [],
  featured: false,
  IsSuggested: false,
};

const filteringSlice = createSlice({
  name: "filtering",
  initialState,
  reducers: {
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setResourceTypes: (state, action) => {
      state.resourceTypes = action.payload;
    },
    setLanguages: (state, action) => {
      state.languages = action.payload;
    },
    setKeywords: (state, action) => {
      state.keywords = action.payload;
    },
    setNewsTags: (state, action) => {
      state.newsTags = action.payload;
    },
    setCourseCategories: (state, action) => {
      state.courseCategories = action.payload;
    },
    setLevel: (state, action) => {
      state.level = action.payload;
    },
    setOrganizationIds: (state, action) => {
      state.organizationIds = action.payload;
    },
    setNewsCategories: (state, action) => {
      state.newsCategories = action.payload;
    },
    setEventTags: (state, action) => {
      state.eventTags = action.payload;
    },
    setEventCategories: (state, action) => {
      state.eventCategories = action.payload;
    },
    setFeatured: (state, action) => {
      state.featured = action.payload;
    },
    setIsSuggested: (state, action) => {
      state.IsSuggested = action.payload;
    },
    clearFilters: (state) => {
      state.sortBy = [];
      state.resourceTypes = [];
      state.languages = [];
      state.keywords = [];
      state.courseCategories = [];
      state.level = [];
      state.organizationIds = [];
      state.newsTags = [];
      state.newsCategories = [];
      state.eventTags = [];
      state.eventCategories = [];
      state.featured = false
      state.IsSuggested = false
    },
  },
});

export const {
  setSortBy,
  setResourceTypes,
  setLanguages,
  setKeywords,
  setCourseCategories,
  setOrganizationIds,
  setLevel,
  clearFilters,
  setNewsTags,
  setNewsCategories,
  setEventTags,
  setEventCategories,
  setFeatured,
  setIsSuggested
} = filteringSlice.actions;
export default filteringSlice.reducer;
