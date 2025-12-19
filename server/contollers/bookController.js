import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";

import { Book } from "../models/bookModel.js";
import { Borrow } from "../models/borrowModel.js";
import { ReadingStatus } from "../models/readingStatusModel.js";


export const addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, genre, description, price, quantity } = req.body || {};

  if (!title || !author || !genre || !description || !price || !quantity) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  const book = await Book.create({
    title,
    author,
    genre,
    description,
    price,
    quantity,
  });

  res.status(201).json({
    success: true,
    message: "Book added successfully",
    book,
  });
});


export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find();

  res.status(200).json({
    success: true,
    books,
  });
});


export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  
  await Borrow.deleteMany({ book: id });


  await ReadingStatus.deleteMany({ book: id });

  
  await book.deleteOne();

  res.status(200).json({
    success: true,
    message: "Book completely deleted.",
  });
});



export const updateBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    book: updatedBook,
  });
});
