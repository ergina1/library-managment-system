import React, { useEffect } from "react";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { logout, resetAuthSlice } from "../store/slices/authSlice";
import {
  toggleAddNewAdminPopup,
  toggleSettingPopup,
} from "../store/slices/popupSlice";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";

const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();

  const { addNewAdminPopup, settingPopup } = useSelector(
    (state) => state.popup
  );

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }

    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  return (
    <>
      
      {isSideBarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSideBarOpen(false)}
        />
      )}

      <aside
        className={`${
          isSideBarOpen ? "left-0" : "-left-full"
        } z-50 transition-all duration-700 md:relative md:left-0 md:z-10 flex w-64 bg-black text-white flex-col h-full`}
        style={{ position: "fixed" }}
      >
        
        <div className="px-6 py-4 my-8">
          <img src={logo_with_title} alt="logo" />
        </div>

        
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
          
          <button
            className="w-full py-2 font-medium rounded-md hover:bg-white/10 transition-colors flex items-center space-x-2"
            onClick={() => {
              setSelectedComponent("Dashboard");
              setIsSideBarOpen(false);
            }}
          >
            <img src={dashboardIcon} alt="icon" className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          
          <button
            className="w-full py-2 font-medium rounded-md hover:bg-white/10 transition-colors flex items-center space-x-2"
            onClick={() => {
              setSelectedComponent("Books");
              setIsSideBarOpen(false);
            }}
          >
            <img src={bookIcon} alt="icon" className="w-5 h-5" />
            <span>Books</span>
          </button>

          
          <button
            className="w-full py-2 font-medium rounded-md hover:bg-white/10 transition-colors flex items-center space-x-2"
            onClick={() => {
              setSelectedComponent("Chat");
              setIsSideBarOpen(false);
            }}
          >
            <span className="text-lg">💬</span>
            <span>Chat Assistant</span>
          </button>

          
          {isAuthenticated && user?.role === "Admin" && (
            <>
              <button
                className="w-full py-2 font-medium rounded-md hover:bg-white/10 transition-colors flex items-center space-x-2"
                onClick={() => {
                  setSelectedComponent("Catalog");
                  setIsSideBarOpen(false);
                }}
              >
                <img src={catalogIcon} alt="icon" className="w-5 h-5" />
                <span>Catalog</span>
              </button>

              <button
                className="w-full py-2 font-medium rounded-md hover:bg-white/10 transition-colors flex items-center space-x-2"
                onClick={() => {
                  setSelectedComponent("Users");
                  setIsSideBarOpen(false);
                }}
              >
                <img src={usersIcon} alt="icon" className="w-5 h-5" />
                <span>Users</span>
              </button>

              <button
                className="w-full py-2 font-medium rounded-md hover:bg-white/10 transition-colors flex items-center space-x-2"
                onClick={() => {
                  dispatch(toggleAddNewAdminPopup());
                  setIsSideBarOpen(false);
                }}
              >
                <RiAdminFill className="w-5 h-5" />
                <span>Add New Admin</span>
              </button>
            </>
          )}

          
          {isAuthenticated && user?.role === "User" && (
            <>
             
              <button
                className="w-full py-2 font-medium rounded-md hover:bg-white/10 transition-colors flex items-center space-x-2"
                onClick={() => {
                  setSelectedComponent("My Borrowed Books");
                  setIsSideBarOpen(false);
                }}
              >
                <img src={catalogIcon} alt="icon" className="w-5 h-5" />
                <span>My Borrowed Books</span>
              </button>

              
              <button
                className="w-full py-2 font-medium rounded-md hover:bg-white/10 transition-colors flex items-center space-x-2"
                onClick={() => {
                  setSelectedComponent("My Reading List");
                  setIsSideBarOpen(false);
                }}
              >
                <img src={bookIcon} alt="icon" className="w-5 h-5" />
                <span>My Reading List</span>
              </button>
            </>
          )}

          
          <button
            className="w-full py-2 font-medium rounded-md hover:bg-white/10 transition-colors flex items-center space-x-2"
            onClick={() => {
              dispatch(toggleSettingPopup());
              setIsSideBarOpen(false);
            }}
          >
            <img src={settingIcon} alt="icon" className="w-5 h-5" />
            <span>Update Credentials</span>
          </button>
        </nav>

        
        <div className="px-6 py-4">
          <button
            onClick={handleLogout}
            className="py-2 font-medium rounded-md hover:bg-white/10 transition-colors flex items-center justify-center space-x-4 mx-auto w-fit"
          >
            <img src={logoutIcon} alt="icon" className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>

        
        <img
          src={closeIcon}
          alt="close sidebar"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="h-6 w-6 absolute top-0 right-4 mt-4 block md:hidden cursor-pointer hover:opacity-80 transition-opacity"
        />
      </aside>

      
      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup />}
    </>
  );
};

export default SideBar;
