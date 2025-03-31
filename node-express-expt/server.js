const express = require('express');
const app = express();
const PORT = 5000;
app.use(express.json());
let pokemons = [{pkmid: 100, title: "Mewtwo"}, {pkmid: 101, title: "Pikachu"}, {pkmid: 102, title: "Charizard"}];
app.get("/", (req, res) => {
  res.send("These are my favourite pokemons!");
});
app.get("/pokemons", (req, res) => {
  res.json(pokemons);
});
app.post("/pokemons", (req, res) => {
    const newpokemons = {
        pkmid: 400,
        title: req.body.title,
    };
    pokemons.push(newpokemons);
    res.status(201).json(newpokemons);
    })
app.use((req, res, next) => {
    console.log(`${req.method} request recieved for ${req.url}`);
    next();
  })
app.use((req, res, next) => {
    res.status(404).send({error:"Sorry, that route doesn't exist."});
  })
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({error: "Something went wrong!"});
  })
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
