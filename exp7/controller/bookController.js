import book from "../model/bookModel.js";

export const create = async (req, res) => {
try {
const bookData = new book(req.body);
const savedBook = await bookData.save();
res.status(200).json(savedBook);
} catch (error) {
console.error("Error:", error);
res.status(500).json({ error: "Internal Server Error" });
}
};

export const fetch = async (req, res) => {
try {
const books = await book.find();
if (books.length === 0) {
res.status(404).json({ message: "No books found!" });
}
res.status(200).json(books);
} catch (error) {
res.status(500).json({ error: "Internal Server Error." });
}
};

export const update = async (req, res) => {
try {
const id = req.params.id;
const bookExist = await book.findOne({ _id: id });
if (!bookExist) {
return res.status(404).json({ message: "Book not found!" });
}
const updatedBook = await book.findByIdAndUpdate(id, req.body, { new: true });
res.status(201).json(updatedBook);
} catch (error) {
res.status(500).json({ error: "Internal Server Error." });
}
};

export const deletebook = async (req, res) => {
try {
const id = req.params.id;
const bookExist = await book.findById({ _id: id });
if (!bookExist) {
return res.status(404).json({ message: "Book not found!" });
}
await book.findByIdAndDelete(id);
res.status(200).json({ message: "Book deleted successfully." });
} catch (error) {
res.status(500).json({ error: "Internal Server Error." });
}
};