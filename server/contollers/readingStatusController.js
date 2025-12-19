import { ReadingStatus } from "../models/readingStatusModel.js";
import { Book } from "../models/bookModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";


export const getMyReadingStatusForBook = catchAsyncErrors(
  async (req, res, next) => {
    const { bookId } = req.params;

    const status = await ReadingStatus.findOne({
      user: req.user._id,
      book: bookId,
    });

    res.status(200).json({
      success: true,
      status,
    });
  }
);


export const getMyReadingStatuses = catchAsyncErrors(
  async (req, res, next) => {
    const statuses = await ReadingStatus.find({
      user: req.user._id,
    }).populate("book");

    res.status(200).json({
      success: true,
      statuses,
    });
  }
);



export const updateMyReadingStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { bookId } = req.params;
    const { status, progress } = req.body || {};

    const book = await Book.findById(bookId);
    if (!book) {
      return next(new ErrorHandler("Book not found", 404));
    }

    let readingStatus = await ReadingStatus.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (!readingStatus) {
      readingStatus = await ReadingStatus.create({
        user: req.user._id,
        book: bookId,
        status,
        progress,
        startedAt: status === "reading" ? new Date() : null,
        completedAt: status === "completed" ? new Date() : null,
      });
    } else {
      readingStatus.status = status ?? readingStatus.status;
      readingStatus.progress = progress ?? readingStatus.progress;

      if (status === "reading" && !readingStatus.startedAt) {
        readingStatus.startedAt = new Date();
      }

      if (status === "completed") {
        readingStatus.completedAt = new Date();
        readingStatus.progress = 100;
      }

      await readingStatus.save();
    }

    res.status(200).json({
      success: true,
      message: "Reading status updated successfully",
      readingStatus,
    });
  }
);


export const deleteMyReadingStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { bookId } = req.params;

    const status = await ReadingStatus.findOneAndDelete({
      user: req.user._id,
      book: bookId,
    });

    if (!status) {
      return next(new ErrorHandler("Reading status not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Reading status removed successfully",
    });
  }
);
