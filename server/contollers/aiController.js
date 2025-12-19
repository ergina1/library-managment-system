import { Book } from "../models/bookModel.js";
import { Borrow } from "../models/borrowModel.js";
import { User } from "../models/userModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import Groq from "groq-sdk";


const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
};


const parseQuestion = (question) => {
  const q = question.toLowerCase();

  
  if (
    (q.includes("due") || q.includes("return")) &&
    (q.includes("soon") || q.includes("upcoming") || q.includes("approaching"))
  ) {
    return { intent: "BOOKS_DUE_SOON" };
  }

  
  if (q.includes("overdue") || (q.includes("late") && q.includes("return"))) {
    return { intent: "OVERDUE_BOOKS" };
  }

  
  if (
    (q.includes("currently") || q.includes("active")) &&
    q.includes("borrowed")
  ) {
    return { intent: "CURRENTLY_BORROWED" };
  }

  
  if (q.includes("notified") || q.includes("notification")) {
    return { intent: "NOTIFIED_USERS" };
  }

  
  if (q.includes("available") && q.includes("book")) {
    return { intent: "AVAILABLE_BOOKS" };
  }

  
  if (
    (q.includes("unavailable") || q.includes("out of stock")) &&
    q.includes("book")
  ) {
    return { intent: "UNAVAILABLE_BOOKS" };
  }

 
  if (
    q.includes("total") &&
    (q.includes("stats") || q.includes("statistics") || q.includes("summary"))
  ) {
    return { intent: "TOTAL_STATISTICS" };
  }

  return { intent: "UNKNOWN" };
};

/**
 * =========================
 * 🤖 ADMIN AI ASSISTANT
 * =========================
 */
export const askLibrary = catchAsyncErrors(async (req, res, next) => {
  const question = req.body?.question;

  if (!question || !question.trim()) {
    return next(new ErrorHandler("Please provide a valid question.", 400));
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "AI analytics are available to administrators only.",
    });
  }

  const parsed = parseQuestion(question);

  
  if (parsed.intent === "BOOKS_DUE_SOON") {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const borrows = await Borrow.find({
      returnDate: null,
      dueDate: { $gte: today, $lte: nextWeek },
    })
      .populate("book", "title author")
      .populate("user", "name email")
      .sort({ dueDate: 1 });

    if (!borrows.length) {
      return res.status(200).json({
        success: true,
        interpretation: "Books due soon",
        result: {
          summary: "No books are due in the next 7 days.",
          columns: [],
          rows: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      interpretation: "Books due soon (next 7 days)",
      result: {
        summary: `${borrows.length} book(s) are due for return in the next 7 days.`,
        columns: ["Book Title", "Borrower", "Email", "Due Date"],
        rows: borrows.map((b) => [
          b.book?.title || "N/A",
          b.user?.name || "N/A",
          b.user?.email || "N/A",
          new Date(b.dueDate).toLocaleDateString(),
        ]),
      },
    });
  }

  
  if (parsed.intent === "OVERDUE_BOOKS") {
    const today = new Date();

    const overdueBorrows = await Borrow.find({
      returnDate: null,
      dueDate: { $lt: today },
    })
      .populate("book", "title author")
      .populate("user", "name email")
      .sort({ dueDate: 1 });

    if (!overdueBorrows.length) {
      return res.status(200).json({
        success: true,
        interpretation: "Overdue books",
        result: {
          summary: "No books are currently overdue. Great job!",
          columns: [],
          rows: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      interpretation: "Overdue books",
      result: {
        summary: `${overdueBorrows.length} book(s) are overdue and need immediate attention.`,
        columns: ["Book Title", "Borrower", "Email", "Due Date", "Days Overdue"],
        rows: overdueBorrows.map((b) => {
          const daysOverdue = Math.floor(
            (today - new Date(b.dueDate)) / (1000 * 60 * 60 * 24)
          );
          return [
            b.book?.title || "N/A",
            b.user?.name || "N/A",
            b.user?.email || "N/A",
            new Date(b.dueDate).toLocaleDateString(),
            `${daysOverdue} days`,
          ];
        }),
      },
    });
  }


  if (parsed.intent === "CURRENTLY_BORROWED") {
    const activeBorrows = await Borrow.find({ returnDate: null })
      .populate("book", "title author")
      .populate("user", "name email")
      .sort({ borrowDate: -1 })
      .limit(20);

    if (!activeBorrows.length) {
      return res.status(200).json({
        success: true,
        interpretation: "Currently borrowed books",
        result: {
          summary: "No books are currently borrowed.",
          columns: [],
          rows: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      interpretation: "Currently borrowed books",
      result: {
        summary: `${activeBorrows.length} book(s) are currently borrowed.`,
        columns: ["Book Title", "Borrower", "Borrow Date", "Due Date"],
        rows: activeBorrows.map((b) => [
          b.book?.title || "N/A",
          b.user?.name || "N/A",
          new Date(b.borrowDate).toLocaleDateString(),
          new Date(b.dueDate).toLocaleDateString(),
        ]),
      },
    });
  }

  
  if (parsed.intent === "NOTIFIED_USERS") {
    const notifiedBorrows = await Borrow.find({
      returnDate: null,
      notified: true,
    })
      .populate("book", "title")
      .populate("user", "name email")
      .sort({ notifiedAt: -1 });

    if (!notifiedBorrows.length) {
      return res.status(200).json({
        success: true,
        interpretation: "Notified users",
        result: {
          summary: "No users have been notified recently.",
          columns: [],
          rows: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      interpretation: "Users who received notifications",
      result: {
        summary: `${notifiedBorrows.length} user(s) have been notified about their borrowed books.`,
        columns: ["User Name", "Email", "Book Title", "Notified At"],
        rows: notifiedBorrows.map((b) => [
          b.user?.name || "N/A",
          b.user?.email || "N/A",
          b.book?.title || "N/A",
          b.notifiedAt
            ? new Date(b.notifiedAt).toLocaleDateString()
            : "N/A",
        ]),
      },
    });
  }

  
  if (parsed.intent === "AVAILABLE_BOOKS") {
    const availableBooks = await Book.find({ availability: true }).limit(20);

    return res.status(200).json({
      success: true,
      interpretation: "Available books",
      result: {
        summary: `${availableBooks.length} book(s) are currently available for borrowing.`,
        columns: ["Title", "Author", "Price", "Quantity"],
        rows: availableBooks.map((b) => [
          b.title,
          b.author,
          `$${b.price}`,
          b.quantity,
        ]),
      },
    });
  }

 
  if (parsed.intent === "UNAVAILABLE_BOOKS") {
    const unavailableBooks = await Book.find({ availability: false });

    if (!unavailableBooks.length) {
      return res.status(200).json({
        success: true,
        interpretation: "Unavailable books",
        result: {
          summary: "All books are currently available!",
          columns: [],
          rows: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      interpretation: "Unavailable/Out of stock books",
      result: {
        summary: `${unavailableBooks.length} book(s) are currently unavailable.`,
        columns: ["Title", "Author", "Price"],
        rows: unavailableBooks.map((b) => [b.title, b.author, `$${b.price}`]),
      },
    });
  }

  
  if (parsed.intent === "TOTAL_STATISTICS") {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments({ role: "User" });
    const totalBorrows = await Borrow.countDocuments();
    const activeBorrows = await Borrow.countDocuments({ returnDate: null });
    const availableBooks = await Book.countDocuments({ availability: true });

    return res.status(200).json({
      success: true,
      interpretation: "Library statistics summary",
      result: {
        summary: `Complete overview of library statistics.`,
        columns: ["Metric", "Count"],
        rows: [
          ["Total Books", totalBooks],
          ["Available Books", availableBooks],
          ["Total Users", totalUsers],
          ["Total Borrows (All-time)", totalBorrows],
          ["Currently Borrowed", activeBorrows],
        ],
      },
    });
  }

 
  return res.status(200).json({
    success: true,
    interpretation: "Unknown question",
    result: {
      summary:
        "I couldn't understand your question. Try asking:\n• Which books are due soon?\n• Show me overdue books\n• Currently borrowed books\n• Which users were notified?\n• What books are available?\n• Books that are out of stock\n• Show me total statistics",
      columns: [],
      rows: [],
    },
  });
});

/**
 * =========================
 * 🎯 AI RECOMMENDATIONS (USER)
 * =========================
 */
export const getRecommendations = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  let recommendations = [];

  if (user?.borrowedBooks?.length) {
    const lastBorrowed = user.borrowedBooks[user.borrowedBooks.length - 1];
    const lastBook = await Book.findById(lastBorrowed.bookId);

    if (lastBook?.author) {
      recommendations = await Book.find({
        author: lastBook.author,
        _id: { $ne: lastBook._id },
      }).limit(6);
    }
  }

  if (!recommendations.length) {
    const popularBooks = await Borrow.aggregate([
      { $group: { _id: "$book", borrowCount: { $sum: 1 } } },
      { $sort: { borrowCount: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      { $replaceRoot: { newRoot: "$book" } },
    ]);

    recommendations = popularBooks;
  }

  res.status(200).json({
    success: true,
    recommendations: recommendations.map((b) => ({
      id: b._id,
      title: b.title,
      author: b.author,
      price: b.price,
      availability: b.availability,
    })),
  });
});

/**
 * =========================
 * 💬 USER CHATBOT (GROQ)
 * =========================
 */
export const chatWithLibrary = catchAsyncErrors(async (req, res, next) => {
  const message = req.body?.message;

  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  console.log("🔥 Groq chat request received:", message);

  try {
    const groq = getGroqClient();

    const books = await Book.find().limit(20);
    const context = books
      .map(
        (b) =>
          `Title: ${b.title}, Author: ${b.author}, Price: $${b.price}, Available: ${b.availability ? "Yes" : "No"}`
      )
      .join("\n");

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful library assistant.

Library books:
${context}

Answer clearly and only about books, authors, genres, or recommendations from the library above.
Do NOT invent books that are not listed.
Be friendly and concise.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply =
      chatCompletion.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    console.log("✅ Groq reply:", reply);

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("❌ Groq error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get response from AI",
    });
  }
});