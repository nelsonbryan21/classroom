const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const { exec } = require("child_process");
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const app = express();

app.use(cors());
app.use(express.json());

// const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send('¡Servidor backend funcionando!');
});

const authRoutes = require('./routes/auth.routes');

app.use('/uploads/img/perfil', express.static(path.join(__dirname, 'uploads/img/perfil')));
app.use('/uploads/img/alumnosCursos', express.static(path.join(__dirname, 'uploads/img/alumnosCursos')));
app.use('/uploads/docs', express.static(path.join(__dirname, 'uploads/docs')));
app.use('/uploads/docs/temp', express.static(path.join(__dirname, 'uploads/docs/temp')));
app.use('/uploads/img/cursos', express.static(path.join(__dirname, 'uploads/img/cursos')));
app.use('/api', authRoutes);



app.get("/test-office", (req, res) => {
  exec("soffice --version", (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    res.json({
      libreoffice: stdout
    });
  });
});

console.log("Cargando rutas...");
const authRoutes2 = require('./routes/auth.routes');
console.log("Rutas cargadas");

app.get('/health', (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

app.listen(PORT, "0.0.0.0",() => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
