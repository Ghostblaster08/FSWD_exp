// Importing the mongoose library to interact with MongoDB
import mongoose from "mongoose";
// Defining a schema for the 'books' collection
const bookSchema = new mongoose.Schema({
    bookID: {
        type: String,
        required: true 
        },
        
    bookName: {
        type: String, 
        required: true 
    },
    
    category: { 
        type: String, 
        required: true 
    },
    
    authors: { 
        type: String, 
        required: true 
    },
    
    ISBN: { 
        type: String, 
        required: true 
    },
    
    edition: { 
        type: String, 
        required: true 
    },
    
    year: { 
        type: String, 
        required: true 
    }
});
// Exporting the model for the 'books' collection using the defined schema
export default mongoose.model("books", bookSchema);