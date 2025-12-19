import React from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header";

const Users = () => {
  const { users } = useSelector((state) => state.user);

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);

    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;

    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

    return `${formattedDate} ${formattedTime}`;
  };

  const filteredUsers = users?.filter((u) => u.role === "User");

  return (
    <>
      <Header />

      <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">

          
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Registered Users
            </h1>
            <p className="text-gray-600 mt-2">
              View all users registered in the library system
            </p>
          </div>

          
          {filteredUsers && filteredUsers.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs uppercase">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs uppercase">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs uppercase">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs uppercase">
                      Role
                    </th>
                    <th className="px-6 py-4 text-center text-xs uppercase">
                      Books Borrowed
                    </th>
                    <th className="px-6 py-4 text-center text-xs uppercase">
                      Registered On
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-semibold">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 text-center font-medium">
                        {user.borrowedBooks.length}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow p-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                No registered users found
              </h3>
              <p className="text-gray-600 mt-2">
                There are currently no users registered in the library
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Users;
