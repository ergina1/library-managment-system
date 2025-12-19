import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popupSlice";
import { FiSettings } from "react-icons/fi";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";

      setTime(`${hours}:${minutes} ${ampm}`);
      setDate(
        now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
    };

    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <header
      className="
        fixed top-0
        left-0 w-full
        md:left-64 md:w-[calc(100%-16rem)]
        h-20
        bg-white
        border-b border-gray-200
        z-40
      "
    >
      <div className="h-full px-4 md:px-6 flex items-center justify-between">

        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold">
            {user?.name?.charAt(0)}
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 text-sm md:text-base">
              {user?.name}
            </span>
            <span className="text-xs md:text-sm text-gray-500">
              {user?.role}
            </span>
          </div>
        </div>

        
        <div className="flex items-center gap-6">

          
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-semibold text-gray-900">{time}</span>
            <span className="text-sm text-gray-500">{date}</span>
          </div>

          
          <button
            onClick={() => dispatch(toggleSettingPopup())}
            className="
              w-10 h-10
              flex items-center justify-center
              rounded-xl
              bg-gray-100
              hover:bg-black
              text-gray-600
              hover:text-white
              transition
            "
            title="Settings"
          >
            <FiSettings size={18} />
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;
