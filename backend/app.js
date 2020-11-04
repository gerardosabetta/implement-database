const express = require("express");
const server = express();
const helmet = require("helmet");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const secreto = "jkdlhfjk2h34jk12h34jkdhsafj2384hajkhsd";
const MD5 = require("./utils");
const db = require("./db");

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(helmet());
server.use(cors());

server.post("/register", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  users.push(user);
  res.status(201);
  res.json(user);
});

server.post("/login", async (req, res) => {
  const MD5Password = MD5(req.body.password);
  const usuarioEncontrados = await db.sequelize.query(
    "SELECT * FROM `usuario` WHERE email = :email AND password = :password",
    {
      replacements: { email: req.body.email, password: MD5Password },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  if (usuarioEncontrados.length === 1) {
    const jwtUsuario = jwt.sign(
      {
        user_id: usuarioEncontrados[0].user_id,
        usuario: usuarioEncontrados[0].email,
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

server.post("/comprar/:productId", userAuth, async (req, res) => {
  const productId = req.params.productId;
  try {
    await db.sequelize.query(
      "UPDATE productos SET comprador_id = :compradorId WHERE producto_id = :productId",
      {
        replacements: {
          compradorId: req.authorizationInfo.user_id,
          productId: productId,
        },
        type: db.sequelize.QueryTypes.UPDATE,
      }
    );
    res.json("Salio todo bien :D");
  } catch (err) {
    res.status(500);
    res.send("Algo salio mal", err);
  }

  console.log(consulta);
});

server.get("/products", userAuth, async (req, res) => {
  const consulta = await db.sequelize.query(
    "SELECT productos.producto_id, productos.nombre, productos.vendedor_id, productos.comprador_id, usuario.email AS vendedor_email FROM productos JOIN usuario ON productos.vendedor_id = usuario.user_id;",
    {
      type: db.sequelize.QueryTypes.SELECT,
    }
  );
  res.json(consulta);
});

server.post("/products", userAuth, async (req, res) => {
  await db.sequelize.query(
    "INSERT INTO productos (`nombre`, `vendedor_id`) VALUES (:nombre, :vendedorId)",
    {
      replacements: {
        nombre: req.body.nombre,
        vendedorId: req.authorizationInfo.user_id,
      },
      type: db.sequelize.QueryTypes.INSERT,
    }
  );

  res.status(201);
  res.json("Salio todo bien :D");
});
server.listen(3000, () => {
  console.log("server en puerto 3000");
});
