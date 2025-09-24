import express from "express";
import Books from "../models/Book.models.js";
import Review from "../models/Review.models.js";
import authMiddleware from "../middleware/authMiddleware.js";

const bookRouter = express.Router();

bookRouter.post("/", authMiddleware, async (req, res) => {
  const { title, author, description, genre } = req.body;
  try {
    const newBook = new Books({ title, author, description, genre });
    await newBook.save();
    res.status(201).json({ message: "Book created", bookId: newBook._id });
  } catch (error) {
    console.error("Book creation error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

bookRouter.get("/", async (req, res) => {
  try {
    const books = await Books.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

bookRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 5 } = req.query; // pagination for reviews

    const book = await Books.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Get reviews for the book with pagination
    const reviews = await Review.find({ book: id })
      .populate("user", "username email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const avgResult = await Review.aggregate([
      { $match: { book: book._id } },
      { $group: { _id: "$book", avgRating: { $avg: "$rating" } } },
    ]);

    const avgRating = avgResult.length > 0 ? avgResult[0].avgRating : null;

    res.json({
      book,
      averageRating: avgRating,
      reviews,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

bookRouter.post("/:id/reviews", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  try {
    const book = await Books.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const review = new Review({
      user: req.user.id,
      book: book._id,
      rating,
      comment,
    });
    await review.save();
    res.status(201).json({ message: "Review created", reviewId: review._id });
  } catch (error) {
    console.error("Review creation error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default bookRouter;
