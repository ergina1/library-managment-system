import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const readingStatusSlice = createSlice({
  name: "readingStatus",
  initialState: {
    loading: false,
    statuses: [],
    error: null,
    message: null,
  },
  reducers: {
    
    getMyReadingStatusesRequest(state) {
      state.loading = true;
    },
    getMyReadingStatusesSuccess(state, action) {
      state.loading = false;
      state.statuses = action.payload;
    },
    getMyReadingStatusesFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    
    updateReadingStatusRequest(state) {
      state.loading = true;
    },
    updateReadingStatusSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    updateReadingStatusFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    
    deleteReadingStatusRequest(state) {
      state.loading = true;
    },
    deleteReadingStatusSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    deleteReadingStatusFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    clearReadingStatusErrors(state) {
      state.error = null;
    },
    clearReadingStatusMessage(state) {
      state.message = null;
    },
  },
});

export const {
  getMyReadingStatusesRequest,
  getMyReadingStatusesSuccess,
  getMyReadingStatusesFailed,
  updateReadingStatusRequest,
  updateReadingStatusSuccess,
  updateReadingStatusFailed,
  deleteReadingStatusRequest,
  deleteReadingStatusSuccess,
  deleteReadingStatusFailed,
  clearReadingStatusErrors,
  clearReadingStatusMessage,
} = readingStatusSlice.actions;

export default readingStatusSlice.reducer;


const API = "http://localhost:4000/api/v1/reading-status";

export const getMyReadingStatuses = () => async (dispatch) => {
  try {
    dispatch(getMyReadingStatusesRequest());

    const { data } = await axios.get(
      `${API}/me`,
      { withCredentials: true }
    );

    dispatch(getMyReadingStatusesSuccess(data.statuses));
  } catch (error) {
    dispatch(
      getMyReadingStatusesFailed(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load reading statuses"
      )
    );
  }
};

export const updateReadingStatus =
  (bookId, statusData) => async (dispatch) => {
    try {
      dispatch(updateReadingStatusRequest());

      const { data } = await axios.put(
        `${API}/book/${bookId}`,
        statusData,
        { withCredentials: true }
      );

      dispatch(updateReadingStatusSuccess(data.message));
      dispatch(getMyReadingStatuses());
    } catch (error) {
      dispatch(
        updateReadingStatusFailed(
          error?.response?.data?.message ||
            error.message ||
            "Failed to update reading status"
        )
      );
    }
  };

export const deleteReadingStatus = (bookId) => async (dispatch) => {
  try {
    dispatch(deleteReadingStatusRequest());

    const { data } = await axios.delete(
      `${API}/book/${bookId}`,
      { withCredentials: true }
    );

    dispatch(deleteReadingStatusSuccess(data.message));
    dispatch(getMyReadingStatuses());
  } catch (error) {
    dispatch(
      deleteReadingStatusFailed(
        error?.response?.data?.message ||
          error.message ||
          "Failed to delete reading status"
      )
    );
  }
};
