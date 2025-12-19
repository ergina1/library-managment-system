import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import SideBar from "../layout/SideBar";
import Header from "../layout/Header";

import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import MyBorrowedBooks from "../components/MyBorrowedBooks";
import Users from "../components/Users";
import AIAssistant from "../components/AIAssistant";
import ChatBot from "../components/ChatBot";
import MyReadingList from "../components/MyReadingList"; 

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="relative md:pl-64 flex flex-col min-h-screen bg-gray-100">
        
        <div className="md:hidden z-50 fixed right-6 top-4 sm:top-6 flex justify-center items-center bg-black rounded-md h-9 w-9 text-white shadow-lg">
          <GiHamburgerMenu
            className="text-2xl cursor-pointer"
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          />
        </div>

        
        <SideBar
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
          setSelectedComponent={setSelectedComponent}
        />

        
        <Header />

        
        <main className="flex-1 p-6 pt-24">
          {(() => {
            switch (selectedComponent) {
              case "Dashboard":
                return user?.role === "User" ? (
                  <UserDashboard />
                ) : (
                  <AdminDashboard />
                );

              case "Books":
                return <BookManagement />;

              case "Catalog":
                if (user?.role === "Admin") return <Catalog />;
                return null;

              case "Users":
                if (user?.role === "Admin") return <Users />;
                return null;

              case "AI Assistant":
                if (user?.role === "Admin") return <AIAssistant />;
                return null;

              case "Chat":
                return <ChatBot />;

              case "My Borrowed Books":
                return <MyBorrowedBooks />;

              
              case "My Reading List":
                if (user?.role === "User") return <MyReadingList />;
                return null;

              default:
                return user?.role === "User" ? (
                  <UserDashboard />
                ) : (
                  <AdminDashboard />
                );
            }
          })()}
        </main>
      </div>
    </>
  );
};

export default Home;
