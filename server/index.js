const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0",() => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

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






