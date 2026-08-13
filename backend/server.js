const express = require("express");
console.log("ESTE ES MI SERVER");
const mongoose = require("mongoose");
const cors = require("cors");

const Usuario = require("./models/Usuario");

const app = express();

app.use(cors());
app.use(express.json());

// CONEXIÓN
mongoose.connect("mongodb://127.0.0.1:27017/barbertime")
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.log(err));

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {

    const existe = await Usuario.findOne({
      email: req.body.email
    });

    if (existe) {
      return res.status(400).json({
        message: "Ese correo ya existe"
      });
    }

    const usuario = new Usuario(req.body);

    await usuario.save();

    res.json(usuario);

 } catch (err) {

  console.log("======== ERROR ========")
  console.log(err)
  console.log(err.message)

  if (err.errors) {
    console.log(err.errors)
  }

  res.status(500).json({
    message: err.message
  })

}
});

app.post("/api/auth/login", async (req, res) => {

  try {

    const usuario = await Usuario.findOne({
      email: req.body.email,
      password: req.body.password
    });

    if (!usuario) {
      return res.status(400).json({
        message: "Credenciales incorrectas"
      });
    }

    res.json(usuario);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message
    });

  }

});
app.get("/", (req, res) => {
  res.send("Backend BarberTime funcionando");
});

app.listen(3000, () => {
  console.log("🚀 Servidor en puerto 3000");
});