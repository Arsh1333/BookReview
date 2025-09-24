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
    // check if book exists
    const book = await Books.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // check if user already reviewed this book
    const existingReview = await Review.findOne({
      book: id,
      user: req.user.id,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You already reviewed this book" });
    }

    const review = new Review({
      user: req.user.id,
      book: id,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Review creation error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

bookRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: "Rating must be between 1 and 5" });
      }
      review.rating = rating;
    }
    if (comment !== undefined) review.comment = comment;

    await review.save();

    res.json({ message: "Review updated successfully", review });
  } catch (err) {
    console.error("Update review error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

bookRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Delete review error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default bookRouter;
