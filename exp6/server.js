const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
let users = [
{ id: 1, name: "JD", email: "jaiksdesar@gmail.com" },
{ id: 2, name: "AadiSingh", email: "aadisingh@gmail.com" },
{ id: 3, name: "Ben10", email: "ben10@gmail.com" }
];
const app = express();
const port = 5000;
// Middleware
app.use(cors());
app.use(bodyParser.json());
// Validation Middleware
const validateUser = (req, res, next) => {
const { name, email } = req.body;
if (!name || !email) {
return res.status(400).json({ message: "Student Name and email are required" });
}
next();
};
// Welcome Route
app.get('/', (req, res) => {
res.send('Welcome to the CRUD Express API!');
});
// CREATE - Add a new User
app.post('/users', (req, res) => {
const { name, email } = req.body;
const newUser = { id: users.length + 1, name, email };
users.push(newUser);
res.status(201).json(newUser);
});
// READ - Get all Users
app.get('/users', (req, res) => {
res.json(users);
});
// READ - Get a User by ID
app.get('/users/:id', (req, res) => {
const user = users.find(u => u.id === parseInt(req.params.id));
if (!user) {
return res.status(404).json({ message: 'Student not found' });
}
res.json(user);
});
// UPDATE - Update a User
app.put('/users/:id', validateUser, (req, res) => {
const { name, email } = req.body;
const user = users.find(u => u.id === parseInt(req.params.id));
if (!user) {
return res.status(404).json({ message: 'User not found' });
}
user.name = name;
user.email = email;
res.json(user);
});
// DELETE - Delete a User
app.delete('/users/:id', (req, res) => {
const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
if (userIndex === -1) {
return res.status(404).json({ message: 'User not found' });
}
const deletedUser = users.splice(userIndex, 1);
res.json({ message: 'User deleted successfully', deletedUser });
});
// Start the server
app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});