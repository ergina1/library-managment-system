import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Header from "../layout/Header";
import ReturnBookPopup from "../popups/ReturnBookPopup";

import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";

import {
  fetchAllBooks,
  resetBookSlice,
} from "../store/slices/bookSlice";

import { toggleReturnBookPopup } from "../store/slices/popupSlice";

const Catalog = () => {
  const dispatch = useDispatch();

  
  const { returnBookPopup } = useSelector((state) => state.popup);
  const { allBorrowedBooks, loading, error, message } = useSelector(
    (state) => state.borrow
  );

 
  const [filter, setFilter] = useState("borrowed");
  const [email, setEmail] = useState("");
  const [borrowedBookId, setBorrowedBookId] = useState("");

  
  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const formatDateAndTime = (timeStamp) => {
    const date = new Date(timeStamp);
    return `${formatDate(timeStamp)} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
      2,
      "0"
    )}:${String(date.getSeconds()).padStart(2, "0")}`;
  };

  
  useEffect(() => {
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }

    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, message, error]);

  
  const currentDate = new Date();

  const borrowedBooks = allBorrowedBooks?.filter(
    (row) => new Date(row.dueDate) > currentDate
  );

  const overdueBooks = allBorrowedBooks?.filter(
    (row) => new Date(row.dueDate) <= currentDate
  );

  const booksToDisplay =
    filter === "borrowed" ? borrowedBooks : overdueBooks;

  
  const openReturnBookPopup = (row) => {
    setBorrowedBookId(row.book);
    setEmail(row.user.email);
    dispatch(toggleReturnBookPopup());
  };

 
  return (
    <>
      <Header />

      <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">

         
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Borrowed Books Catalog
            </h1>
            <p className="text-gray-600 mt-2">
              Manage active and overdue borrowed books
            </p>
          </div>

          
          <div className="mb-6 flex gap-2 bg-white p-2 rounded-xl shadow w-fit">
            <button
              onClick={() => setFilter("borrowed")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition
                ${
                  filter === "borrowed"
                    ? "bg-gray-900 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              Borrowed Books
            </button>

            <button
              onClick={() => setFilter("overdue")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition
                ${
                  filter === "overdue"
                    ? "bg-red-600 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
             
            </button>
          </div>

          
          {booksToDisplay && booksToDisplay.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-900 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                        Borrowed At
                      </th>
                      <th className="px-6 py-4 text-center text-xs uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {booksToDisplay.map((row, index) => (
                      <tr
                        key={row._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 font-semibold">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {row.user.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {row.user.email}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          ${row.price}
                        </td>
                        <td className="px-6 py-4">
                          {formatDate(row.dueDate)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDateAndTime(row.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => openReturnBookPopup(row)}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition
                              ${
                                filter === "overdue"
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "bg-gray-900 hover:bg-black text-white"
                              }`}
                          >
                            {filter === "overdue" ? (
                              <>
                                <FaSquareCheck />
                                Returned
                              </>
                            ) : (
                              <>
                                <PiKeyReturnBold />
                                Return
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow p-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                No {filter === "borrowed" ? "borrowed" : "overdue"} books found
              </h3>
              <p className="text-gray-600 mt-2">
                Everything looks up to date 🎉
              </p>
            </div>
          )}
        </div>
      </main>

      
      {returnBookPopup && (
        <ReturnBookPopup bookId={borrowedBookId} email={email} />
      )}
    </>
  );
};

export default Catalog;
