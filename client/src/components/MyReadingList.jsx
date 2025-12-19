import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen, BookMarked, Pause, CheckCircle2, BookmarkPlus } from "lucide-react";
import { getMyReadingStatuses } from "../store/slices/readingStatusSlice";
import { toggleReadBookPopup } from "../store/slices/popupSlice";
import Header from "../layout/Header";

const MyReadingList = () => {
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { statuses, loading } = useSelector((state) => state.readingStatus);

  useEffect(() => {
    if (isAuthenticated && user?.role === "User") {
      dispatch(getMyReadingStatuses());
    }
  }, [dispatch, isAuthenticated, user]);

  
  if (!isAuthenticated || user?.role !== "User") {
    return null;
  }

  const filterByStatus = (status) =>
    statuses?.filter((item) => item.status === status) || [];

  const getStatusConfig = (status) => {
    const configs = {
      want_to_read: {
        icon: BookmarkPlus,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        gradient: "from-purple-500 to-purple-600",
      },
      reading: {
        icon: BookOpen,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        gradient: "from-blue-500 to-blue-600",
      },
      paused: {
        icon: Pause,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        gradient: "from-yellow-500 to-yellow-600",
      },
      completed: {
        icon: CheckCircle2,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        gradient: "from-green-500 to-green-600",
      },
    };
    return configs[status] || configs.want_to_read;
  };

  const renderSection = (title, status, list) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
      <div className="mb-10">
        
        <div className="flex items-center gap-3 mb-5">
          <div className={`${config.bgColor} ${config.color} p-3 rounded-xl`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{list.length} books</p>
          </div>
        </div>

        
        {list.length === 0 ? (
          <div
            className={`${config.bgColor} ${config.borderColor} border-2 border-dashed rounded-2xl p-8 text-center`}
          >
            <Icon className={`w-12 h-12 ${config.color} mx-auto mb-3 opacity-50`} />
            <p className="text-gray-500 font-medium">No books in this category yet</p>
            <p className="text-sm text-gray-400 mt-1">Start adding books to track your reading journey</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {list.map((item) => (
              <div
                key={item._id}
                className={`group relative bg-white border-2 ${config.borderColor} rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}
                onClick={() => dispatch(toggleReadBookPopup(item.book))}
              >
                
                <div
                  className={`absolute -top-3 -right-3 ${config.bgColor} ${config.color} p-2 rounded-full shadow-md border-2 ${config.borderColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {item.book?.title || "Untitled"}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {item.book?.author || "Unknown Author"}
                  </p>
                </div>

                
                {status !== "want_to_read" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-medium">Progress</span>
                      <span className={`${config.color} font-bold`}>
                        {item.progress || 0}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${item.progress || 0}%` }}
                      />
                    </div>
                    {item.currentPage && item.totalPages && (
                      <p className="text-xs text-gray-500 text-center">
                        Page {item.currentPage} of {item.totalPages}
                      </p>
                    )}
                  </div>
                )}

                
                {item.lastReadAt && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      Last read: {new Date(item.lastReadAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="relative flex-1 p-6 pt-28 bg-gray-50 min-h-screen">
      
      <Header />

      
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
            <BookMarked className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Reading List</h1>
            <p className="text-gray-600 mt-1">
              Track your reading journey and progress
            </p>
          </div>
        </div>

        
        {statuses && statuses.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
              <p className="text-sm text-purple-600 font-semibold">Want to Read</p>
              <p className="text-3xl font-bold text-purple-700">
                {filterByStatus("want_to_read").length}
              </p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-600 font-semibold">Reading</p>
              <p className="text-3xl font-bold text-blue-700">
                {filterByStatus("reading").length}
              </p>
            </div>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-600 font-semibold">Paused</p>
              <p className="text-3xl font-bold text-yellow-700">
                {filterByStatus("paused").length}
              </p>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-600 font-semibold">Completed</p>
              <p className="text-3xl font-bold text-green-700">
                {filterByStatus("completed").length}
              </p>
            </div>
          </div>
        )}
      </div>

     
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your reading list...</p>
          </div>
        </div>
      ) : statuses && statuses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <BookMarked className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Your Reading List is Empty
          </h3>
          <p className="text-gray-600">
            Start adding books to track your reading progress
          </p>
        </div>
      ) : (
        <>
          {renderSection("Want to Read", "want_to_read", filterByStatus("want_to_read"))}
          {renderSection("Currently Reading", "reading", filterByStatus("reading"))}
          {renderSection("Paused", "paused", filterByStatus("paused"))}
          {renderSection("Completed", "completed", filterByStatus("completed"))}
        </>
      )}
    </main>
  );
};

export default MyReadingList;