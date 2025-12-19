import React, { useEffect, useState } from "react";
import { BookA } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import Header from "../layout/Header";
import ReadBookPopup from "../popups/ReadBookPopup";

import {
  fetchUserBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";

import { toggleReadBookPopup } from "../store/slices/popupSlice";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();

  
  const { books } = useSelector((state) => state.book);
  const { userBorrowedBooks } = useSelector((state) => state.borrow);
  const { readBookPopup } = useSelector((state) => state.popup);

  
  const [readBook, setReadBook] = useState({});
  const [filter, setFilter] = useState("returned");

  
  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());

    return () => {
      dispatch(resetBorrowSlice());
    };
  }, [dispatch]);

  
  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);

    const formattedDate = `${String(date.getDate()).padStart(
      2,
      "0"
    )}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

    const formattedTime = `${String(date.getHours()).padStart(
      2,
      "0"
    )}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}`;

    return `${formattedDate} ${formattedTime}`;
  };

  const openReadPopup = (id) => {
    const book = books.find((b) => b._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  
  const returnedBooks = userBorrowedBooks?.filter(
    (book) => book.returned === true
  );

  const nonReturnedBooks = userBorrowedBooks?.filter(
    (book) => book.returned === false
  );

  const booksToDisplay =
    filter === "returned" ? returnedBooks : nonReturnedBooks;

  
  return (
    <>
      <Header />

      <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">

         
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Borrowed Books
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage your borrowed books
            </p>
          </div>

          
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg sm:rounded-bl-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${
                filter === "returned"
                  ? "bg-black text-white border-black"
                  : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("returned")}
            >
              Returned Books
            </button>

            <button
              className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg sm:rounded-br-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${
                filter === "nonReturned"
                  ? "bg-black text-white border-black"
                  : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("nonReturned")}
            >
              Non-Returned Books
            </button>
          </div>

          
          {booksToDisplay && booksToDisplay.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs uppercase">ID</th>
                    <th className="px-6 py-4 text-left text-xs uppercase">Book Title</th>
                    <th className="px-6 py-4 text-left text-xs uppercase">Date & Time</th>
                    <th className="px-6 py-4 text-left text-xs uppercase">Due Date</th>
                    <th className="px-6 py-4 text-left text-xs uppercase">Returned</th>
                    <th className="px-6 py-4 text-center text-xs uppercase">View</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {booksToDisplay.map((book, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-semibold">{index + 1}</td>
                      <td className="px-6 py-4 font-medium">{book.bookTitle}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(book.borrowedDate)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(book.dueDate)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            book.returned
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {book.returned ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => openReadPopup(book.bookId)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                          >
                            <BookA size={18} />
                          </button>
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
                {filter === "returned" ? "No returned books found" : "No non-returned books found"}
              </h3>
              <p className="text-gray-600 mt-2">
                {filter === "returned" 
                  ? "Books you return will appear here" 
                  : "You haven't borrowed any books yet"}
              </p>
            </div>
          )}
        </div>
      </main>

      
      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyBorrowedBooks;