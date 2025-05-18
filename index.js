const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Permitir solicitudes desde otros dominios
app.use(cors());
// Permitir recibir datos en formato JSON
app.use(express.json());

// Conectar a MongoDB Atlas
mongoose.connect('mongodb+srv://Admin:admin1234@cluster0.e4qksjc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));
  
  
// Definir un esquema para los pedidos
const pedidoSchema = new mongoose.Schema({
  mesa: String,
  productos: Array,
  total: Number,
  estado: { type: String, default: 'pendiente' }
});

// Crear un modelo de Pedido
const Pedido = mongoose.model('Pedido', pedidoSchema);

// Ruta para recibir un nuevo pedido
app.post('/api/pedidos', async (req, res) => {
  const nuevoPedido = new Pedido(req.body);
  await nuevoPedido.save();
  res.send({ mensaje: 'Pedido guardado exitosamente' });
});

// Ruta para obtener todos los pedidos
app.get('/api/pedidos', async (req, res) => {
  const pedidos = await Pedido.find();
  res.send(pedidos);
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
