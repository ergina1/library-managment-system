import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector } from "react-redux";
import AIAssistant from "./AIAssistant";

ChartJS.register(ArcElement, Tooltip, Legend);



const StatCard = ({ title, value, subtitle }) => (
  <div className="bg-white rounded-2xl p-6 border shadow-sm">
    <p className="text-sm text-gray-500 mb-1">{title}</p>
    <h2 className="text-4xl font-bold text-gray-900">{value}</h2>
    <p className="text-sm text-gray-400 mt-2">{subtitle}</p>
  </div>
);

const LegendItem = ({ label, value, color }) => (
  <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
    <div
      className="w-4 h-4 rounded-full"
      style={{ backgroundColor: color }}
    />
    <div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  </div>
);



const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { allBorrowedBooks } = useSelector((state) => state.borrow);

  const [borrowedCount, setBorrowedCount] = useState(0);
  const [returnedCount, setReturnedCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);

  useEffect(() => {
    if (!users || !allBorrowedBooks) return;

    setUserCount(users.filter((u) => u.role === "User").length);
    setAdminCount(users.filter((u) => u.role === "Admin").length);

    setBorrowedCount(
      allBorrowedBooks.filter((b) => b.returnDate === null).length
    );

    setReturnedCount(
      allBorrowedBooks.filter((b) => b.returnDate !== null).length
    );
  }, [users, allBorrowedBooks]);

  const totalRecords = borrowedCount + returnedCount;

  const chartData = {
    labels: ["Borrowed", "Returned"],
    datasets: [
      {
        data: [borrowedCount, returnedCount],
        backgroundColor: ["#2563eb", "#16a34a"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: "70%",
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: true,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Library Overview
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl">
              "Leadership is not about control — it's about visibility,
              insight, and responsibility."
            </p>
          </div>

          
          <div className="bg-white border rounded-2xl px-6 py-4 shadow-sm min-w-[260px]">
            <p className="text-xs text-gray-500 mb-1">Logged in as</p>
            <p className="text-lg font-semibold text-gray-900">
              {user?.name}
            </p>
            <p className="text-sm text-gray-600">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-black text-white">
              {user?.role}
            </span>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Registered Users"
            value={userCount}
            subtitle="Active members"
          />
          <StatCard
            title="Administrators"
            value={adminCount}
            subtitle="System managers"
          />
          <StatCard
            title="Total Books"
            value={books?.length || 0}
            subtitle="Catalog size"
          />
          <StatCard
            title="Borrow Records"
            value={totalRecords}
            subtitle="All-time activity"
          />
        </div>

        
        <div className="mb-12">
          <AIAssistant />
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-2xl p-8 border shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Administrative Insight
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              This panel reflects real-time system health. Monitoring borrowing
              behavior helps maintain balance, availability, and user
              accountability.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Strong return rates indicate trust and engagement across the
              platform.
            </p>
          </div>

          
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 border shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Borrowing Distribution
            </h3>
            <p className="text-gray-500 mb-8">
              Current state of borrowed vs returned books
            </p>

            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative w-64 h-64">
                <Pie data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-bold text-gray-900">
                    {totalRecords}
                  </p>
                  <p className="text-sm text-gray-500">
                    Total Records
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <LegendItem
                  label="Currently Borrowed"
                  value={borrowedCount}
                  color="#2563eb"
                />
                <LegendItem
                  label="Returned"
                  value={returnedCount}
                  color="#16a34a"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;