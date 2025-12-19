import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateBook } from "../store/slices/bookSlice";
import { toggleEditBookPopup } from "../store/slices/popupSlice";

const UpdateBookPopup = ({ book }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    quantity: "",
    availability: true,
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
        price: book.price || "",
        quantity: book.quantity || "",
        availability: book.availability ?? true,
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdate = () => {
    dispatch(updateBook(book._id, formData));
    dispatch(toggleEditBookPopup());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-11/12 bg-white rounded-lg shadow-lg sm:w-1/2 lg:w-1/3">

        
        <div className="flex justify-between items-center bg-black text-white px-6 py-4 rounded-t-lg">
          <h2 className="text-lg font-bold">Update Book Info</h2>
          <button
            className="text-white text-lg font-bold"
            onClick={() => dispatch(toggleEditBookPopup())}
          >
            &times;
          </button>
        </div>

        
        <div className="p-6">

          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Book Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
          </div>

          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Author
            </label>
            <input
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
          </div>

          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full resize-none"
              rows="3"
            />
          </div>

          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
          </div>

         
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
          </div>

          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
            />
            <span className="text-gray-700 font-semibold">
              Available
            </span>
          </div>
        </div>

        
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-100 rounded-b-lg">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={() => dispatch(toggleEditBookPopup())}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>

      </div>
    </div>
  );
};

export default UpdateBookPopup;
