import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    settingPopup: false,
    addBookPopup: false,
    readBookPopup: false,
    recordBookPopup: false,
    returnBookPopup: false,
    addNewAdminPopup: false,
    deleteBookPopup: false,
    bookIdToDelete: null,
    editBookPopup: false,
    bookToEdit: null,
    readingStatusPopup: false,
  },
  reducers: {
    toggleSettingPopup(state) {
      state.settingPopup = !state.settingPopup;
    },

    toggleAddBookPopup(state) {
      state.addBookPopup = !state.addBookPopup;
    },

    toggleReadBookPopup(state) {
      state.readBookPopup = !state.readBookPopup;
    },

    toggleRecordBookPopup(state) {
      state.recordBookPopup = !state.recordBookPopup;
    },

    toggleAddNewAdminPopup(state) {
      state.addNewAdminPopup = !state.addNewAdminPopup;
    },

    toggleReturnBookPopup(state) {
      state.returnBookPopup = !state.returnBookPopup;
    },

    toggleDeleteBookPopup(state, action) {
    state.deleteBookPopup = !state.deleteBookPopup;
    state.bookIdToDelete = action?.payload || null;
},

    toggleEditBookPopup(state, action) {
  state.editBookPopup = !state.editBookPopup;
  state.bookToEdit = action?.payload || null;
},

    toggleReadingStatusPopup(state) {
      state.readingStatusPopup = !state.readingStatusPopup;
    },

    closeAllPopup(state) {
      state.addBookPopup = false;
      state.addNewAdminPopup = false;
      state.readBookPopup = false;
      state.recordBookPopup = false;
      state.returnBookPopup = false;
      state.settingPopup = false;
      state.readingStatusPopup = false;
      
    },
  },
});

export const {
  closeAllPopup,
  toggleAddBookPopup,
  toggleAddNewAdminPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
  toggleReturnBookPopup,
  toggleSettingPopup,
  toggleReadingStatusPopup,
  toggleDeleteBookPopup,
  toggleEditBookPopup

} = popupSlice.actions;

export default popupSlice.reducer;
