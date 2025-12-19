import React, { useEffect, useState } from "react";
import { BookA, NotebookPen, Search, BookmarkCheck, Trash2, FileEdit } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Header from "../layout/Header";

import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
  toggleReadingStatusPopup,
  toggleDeleteBookPopup,
  toggleEditBookPopup
} from "../store/slices/popupSlice";

import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";

import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";

import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";
import DeleteBookPopup from "../popups/DeleteBookPopup";
import UpdateBookPopup from "../popups/UpdateBookPopup";
import ReadingStatusPopup from "../popups/readingStatusPopup";



const BookManagement = () => {
  const dispatch = useDispatch();

  
  const { loading, error, message, books } = useSelector(
    (state) => state.book
  );

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const {
    addBookPopup,
    readBookPopup,
    recordBookPopup,
    editBookPopup,
    bookToEdit,
    deleteBookPopup,
    bookIdToDelete,
    readingStatusPopup,
  } = useSelector((state) => state.popup);

  const {
    error: borrowSliceError,
    message: borrowSliceMessage,
  } = useSelector((state) => state.borrow);

  
  const [readBook, setReadBook] = useState({});
  const [borrowBookId, setBorrowBookId] = useState("");
  const [statusBook, setStatusBook] = useState({});
  const [searchedKeyword, setSearchedKeyword] = useState("");

  
  useEffect(() => {
    dispatch(fetchAllBooks());

    if (user?.role === "Admin") {
      dispatch(fetchAllBorrowedBooks());
    }
  }, [dispatch, user]);

  
  useEffect(() => {
    if (message || borrowSliceMessage) {
      toast.success(message || borrowSliceMessage);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }

    if (error || borrowSliceError) {
      toast.error(error || borrowSliceError);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, message, error, borrowSliceError, borrowSliceMessage]);

  
  const openReadPopup = (id) => {
    const book = books.find((b) => b._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const openRecordBookPopup = (id) => {
    setBorrowBookId(id);
    dispatch(toggleRecordBookPopup());
  };

  const openReadingStatusPopup = (id) => {
    const book = books.find((b) => b._id === id);
    setStatusBook(book);
    dispatch(toggleReadingStatusPopup());
  };

  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value.toLowerCase());
  };

  const searchedBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchedKeyword)
  );

  
  return (
    <>
      <Header />

      <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">

          
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {user?.role === "Admin" ? "Book Management" : "Books"}
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and browse books available in the library
            </p>
          </div>

          
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {isAuthenticated && user?.role === "Admin" && (
              <button
                onClick={() => dispatch(toggleAddBookPopup())}
                className="flex items-center gap-3 px-5 h-11 bg-gray-900 text-white rounded-xl hover:bg-black transition shadow w-fit"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-gray-900 text-lg font-bold">
                  +
                </span>
                <span className="font-medium">Add Book</span>
              </button>
            )}

            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                className="h-11 w-full pl-10 pr-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={searchedKeyword}
                onChange={handleSearch}
              />
            </div>
          </div>

          
          {searchedBooks.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4 text-left">Title</th>
                    <th className="px-6 py-4 text-left">Author</th>

                    {user?.role === "Admin" && (
                      <th className="px-6 py-4 text-left">Quantity</th>
                    )}

                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-left">Availability</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {searchedBooks.map((book, index) => (
                    <tr key={book._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-semibold">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">{book.title}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {book.author}
                      </td>

                      {user?.role === "Admin" && (
                        <td className="px-6 py-4">{book.quantity}</td>
                      )}

                      <td className="px-6 py-4">${book.price}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            book.availability
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {book.availability ? "Available" : "Unavailable"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">

                          {/* ADMIN ACTIONS */}
                          {user?.role === "Admin" && (
                            <>
                              <button
                                onClick={() => openReadPopup(book._id)}
                                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                                title="View Book"
                              >
                                <BookA size={18} />
                              </button>

                              <button
                                onClick={() => openRecordBookPopup(book._id)}
                                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                                title="Record Borrow"
                              >
                                <NotebookPen size={18} />
                              </button>
                              <button
  onClick={() => dispatch(toggleEditBookPopup(book))}
  className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
  title="Edit Book"
>
  <FileEdit size={18} />

</button>

                              <Trash2
  className="text-red-500 cursor-pointer"
  onClick={() =>
    dispatch(toggleDeleteBookPopup(book._id))
  }
/>


                            </>
                          )}

                          {/* USER ACTION */}
                          {user?.role === "User" && (
                            <button
                              onClick={() => openReadingStatusPopup(book._id)}
                              className="p-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
                              title="Reading Status"
                            >
                              <BookmarkCheck size={18} />
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow p-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                No books found
              </h3>
              <p className="text-gray-600 mt-2">
                Try adjusting your search or add new books
              </p>
            </div>
          )}
        </div>
      </main>

      
      {addBookPopup && <AddBookPopup />}

      {readBookPopup && user?.role === "Admin" && (
        <ReadBookPopup book={readBook} />
      )}

      {recordBookPopup && user?.role === "Admin" && (
        <RecordBookPopup bookId={borrowBookId} />
      )}

      {editBookPopup && bookToEdit && (
  <UpdateBookPopup book={bookToEdit} />
)}

      {deleteBookPopup && (
  <DeleteBookPopup bookId={bookIdToDelete} />
)}


      {readingStatusPopup && user?.role === "User" && (
        <ReadingStatusPopup book={statusBook} />
      )}


    </>
  );
};

export default BookManagement;
