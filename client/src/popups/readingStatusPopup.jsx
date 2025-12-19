import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  updateReadingStatus,
  deleteReadingStatus,
  clearReadingStatusErrors,
  clearReadingStatusMessage,
} from "../store/slices/readingStatusSlice";

import { toggleReadingStatusPopup } from "../store/slices/popupSlice";

const ReadingStatusPopup = ({ book }) => {
  const dispatch = useDispatch();

  
  const { user } = useSelector((state) => state.auth);

  
  const { statuses, loading, error, message } = useSelector(
    (state) => state.readingStatus
  );

 
  const existingStatus = statuses.find(
    (s) => s.book?._id === book?._id
  );

 
  const [status, setStatus] = useState(
    existingStatus?.status || "want_to_read"
  );

  const [progress, setProgress] = useState(
    existingStatus?.progress || 0
  );

  
  useEffect(() => {
    if (existingStatus) {
      setStatus(existingStatus.status);
      setProgress(existingStatus.progress);
    }
  }, [existingStatus]);

  
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearReadingStatusErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(clearReadingStatusMessage());
    }
  }, [dispatch, error, message]);


  const handleSave = () => {
    dispatch(
      updateReadingStatus(book._id, {
        status,
        progress,
      })
    );
  };

  const handleRemove = () => {
    dispatch(deleteReadingStatus(book._id));
  };

  
  if (!user || user.role !== "User") return null;

  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-11/12 sm:w-1/2 lg:w-1/3 bg-white rounded-lg shadow-lg">

        
        <div className="flex justify-between items-center bg-black text-white px-6 py-4 rounded-t-lg">
          <h2 className="text-lg font-bold">Reading Status</h2>
          <button
            onClick={() => dispatch(toggleReadingStatusPopup())}
            className="text-xl font-bold"
          >
            &times;
          </button>
        </div>

        
        <div className="p-6">
          <p className="font-semibold mb-4">{book?.title}</p>

          <label className="block text-sm text-gray-600 mb-1">
            Status
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="want_to_read">Want to read</option>
            <option value="reading">Reading</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>

          {status !== "want_to_read" && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Progress: {progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) =>
                  setProgress(Number(e.target.value))
                }
                className="w-full"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            {existingStatus && (
              <button
                onClick={handleRemove}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReadingStatusPopup;
