import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json()); // Middleware to parse JSON

// MongoDB Client
let db;
const client = new MongoClient(MONGO_URI); // No options needed
await client.connect();

MongoClient.connect(MONGO_URI, { useNewUrlParser: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db('mydatabase'); // Use 'mydatabase' as the database name
  })
  .catch(err => console.error('MongoDB connection error:', err));

// === CRUD Routes ===
// Testing...
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
  });
  
// 1. CREATE: Add a new item
app.post('/items', async (req, res) => {
  try {
    const newItem = req.body;
    const result = await db.collection('items').insertOne(newItem);
    res.status(201).json({ message: 'Item created', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. READ: Get all items
app.get('/items', async (req, res) => {
  try {
    const items = await db.collection('items').find().toArray();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. READ: Get a single item by ID
app.get('/items/:id', async (req, res) => {
  try {
    const item = await db.collection('items').findOne({ _id: new ObjectId(req.params.id) });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. UPDATE: Modify an item by ID
app.put('/items/:id', async (req, res) => {
  try {
    const updatedItem = req.body;
    const result = await db.collection('items').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedItem }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: 'Item not found' });

    res.json({ message: 'Item updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. DELETE: Remove an item by ID
app.delete('/items/:id', async (req, res) => {
  try {
    const result = await db.collection('items').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) return res.status(404).json({ error: 'Item not found' });

    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// Close the Server
process.on('SIGINT', async () => {
    console.log('Closing MongoDB connection...');
    await db.client.close();
    process.exit(0);
  });
  