const express = require("express");
const app = express();
const axios = require('axios')
const bodyParser = require('body-parser');
const dbConnect = require("./db/dbconnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./db/models/user");
const auth = require("./auth");

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// execute database connection 
dbConnect();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
// register endpoint
app.post("/register", (request, response) => {
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });

      //guardar usuario
      user
        .save()
        .then((result) => {
          response.status(201).send({
            message: "Usuario creado",
            result,
          });
        })
        .catch((error) => {
          response.status(500).send({
            message: "Erro creando el usuario",
            error,
          });
        });
    })
    .catch((e) => {
      response.status(500).send({
        message: "Contraseña no coincide",
        e,
      });
    });
});


app.post("/login", (request, response) => {

  User.findOne({ email: request.body.email })
    .then((user) => {
      bcrypt
        .compare(request.body.password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

app.get("/pokemon", auth, async (request, response) => {
  const pokemonData = await axios.get('https://pokeapi.co/api/v2/pokemon/');
  response.json({ data: pokemonData.data });
})


app.get("/", (request, response, next) => {
  response.json({ message: "Servidor respondiendo" });
  next();
});


module.exports = app;
