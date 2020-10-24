const express = require("express");
const server = express();
const helmet = require("helmet");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const secreto = "jkdlhfjk2h34jk12h34jkdhsafj2384hajkhsd";

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(helmet());
server.use(cors());

// 💩 Reemplazame por data de verdad!
const users = [
  {
    email: "jorgeborges@gmail.com",
    password: "1234",
  },
  {
    email: "juanperez@gmail.com",
    password: "5678",
  },
  {
    email: "robertorodriguez@gmail.com",
    password: "2468",
  },
];

// 💩 Reemplazame por data de verdad!
const products = [
  {
    name: "Linterna",
    owner: "jorgeborges@gmail.com",
    available: true,
  },
  {
    name: "Libro",
    owner: "juanperez@gmail.com",
    available: true,
  },
  {
    name: "Celular",
    owner: "robertorodriguez@gmail.com",
    available: true,
  },
];

server.post("/register", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  users.push(user);
  res.status(201);
  res.json(user);
});

server.post("/login", (req, res) => {
  const usuario = users.find((user) => {
    return user.email === req.body.email && user.password === req.body.password;
  });
  if (usuario) {
    const jwtUsuario = jwt.sign(
      {
        usuario: usuario.email,
      },
      secreto
    );
    // truthiness and falsyness
    res.status(200);
    res.json(jwtUsuario);
  } else {
    res.status(401);
    res.json({ error: "Usuario y/o contraseña incorrectos" });
  }
});

const userAuth = (req, res, next) => {
  const headerAuth = req.headers.authorization;

  if (headerAuth) {
    const token = headerAuth.split(" ")[1];
    try {
      const verifyToken = jwt.verify(token, secreto);
      req.authorizationInfo = verifyToken;
      next();
    } catch (err) {
      console.log(err);
      res.status(401);
      res.send();
    }
  } else {
    res.status(403);
    res.send("Header authorization not found");
  }
};

server.post("/comprar", userAuth, (req, res) => {
  const productName = req.body.name;
  const boughtProduct = products.find(
    (product) => product.name === productName
  );
  if (boughtProduct) {
    if (boughtProduct.availableToBuy === false) {
      res.status(400);
      res.send("El producto no esta disponible");
      return;
    }
    boughtProduct.availableToBuy = false;
    res.send("Producto comprado");
  } else {
    res.status(404);
    res.send("Producto no encontrado");
  }
});

server.get("/products", userAuth, (req, res) => {
  res.send(products);
});

server.post("/newproduct", userAuth, (req, res) => {
  const product = {
    name: req.body.name,
    owner: req.authorizationInfo.owner,
    availableToBuy: true,
  };
  products.push(product);
  res.status(201);
  res.json(product);
});
server.listen(3000, () => {
  console.log("server en puerto 3000");
});
