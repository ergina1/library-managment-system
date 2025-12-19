import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const UserDashboard = () => {
  
  const userBorrowedBooks = [
    { id: 1, returned: false },
    { id: 2, returned: false },
    { id: 3, returned: false },
    { id: 4, returned: true },
    { id: 5, returned: true },
    { id: 6, returned: true },
    { id: 7, returned: true },
    { id: 8, returned: true },
  ];

  const [borrowedCount, setBorrowedCount] = useState(0);
  const [returnedCount, setReturnedCount] = useState(0);

  useEffect(() => {
    const borrowed = userBorrowedBooks.filter(
      (book) => book.returned === false
    ).length;

    const returned = userBorrowedBooks.filter(
      (book) => book.returned === true
    ).length;

    setBorrowedCount(borrowed);
    setReturnedCount(returned);
  }, [userBorrowedBooks]);

  const totalBooks = borrowedCount + returnedCount;

  const chartData = {
    labels: ["Currently Borrowed", "Returned"],
    datasets: [
      {
        data: [borrowedCount, returnedCount],
        backgroundColor: [
          "rgba(59, 130, 246, 0.9)",
          "rgba(34, 197, 94, 0.9)",
        ],
        borderColor: ["#3b82f6", "#22c55e"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: { size: 14, weight: "600" },
        bodyFont: { size: 13 },
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const percentage =
              totalBooks > 0
                ? ((value / totalBooks) * 100).toFixed(1)
                : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: true,
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            My Dashboard
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Track your reading journey and borrowing activity
          </p>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-blue-100 text-sm font-medium mb-2">
              Currently Borrowed
            </p>
            <h2 className="text-5xl font-bold text-white mb-3">
              {borrowedCount}
            </h2>
            <p className="text-blue-100 text-sm">
              {borrowedCount === 1 ? "Book" : "Books"} awaiting return
            </p>
          </div>

          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-green-100 text-sm font-medium mb-2">
              Successfully Returned
            </p>
            <h2 className="text-5xl font-bold text-white mb-3">
              {returnedCount}
            </h2>
            <p className="text-green-100 text-sm">
              {returnedCount === 1 ? "Book" : "Books"} returned on time
            </p>
          </div>

          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
            <p className="text-purple-100 text-sm font-medium mb-2">
              Total Activity
            </p>
            <h2 className="text-5xl font-bold text-white mb-3">
              {totalBooks}
            </h2>
            <p className="text-purple-100 text-sm">
              Books borrowed all time
            </p>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Borrowing Overview
            </h3>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
              <div className="w-64 h-64 relative">
                <Pie data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-4xl font-bold text-gray-900">
                    {totalBooks}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">
                    Total Books
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-blue-50 rounded-xl p-4">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Currently Borrowed
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {borrowedCount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-green-50 rounded-xl p-4">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Returned
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {returnedCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl shadow-lg p-6 sm:p-8 flex items-start gap-5">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500 text-white shadow">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <div>
              <h4 className="text-lg font-bold text-amber-900">
                Friendly Reminder
              </h4>
              <p className="text-sm text-amber-800 mt-2 leading-relaxed">
                Please remember to return your borrowed books on time to avoid
                late fees and keep your borrowing privileges active.
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-amber-700">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                Stay on track with your reading journey
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
