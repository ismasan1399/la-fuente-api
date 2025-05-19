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

// Definir un esquema para los pedidos (mesa y domicilio)
const pedidoSchema = new mongoose.Schema({
  mesa: String,
  cliente: String,
  productos: Array,
  total: Number,
  estado: { type: String, default: 'pendiente' },
  telefono: String,
  direccion: String
});


// Crear un modelo de Pedido
const Pedido = mongoose.model('Pedido', pedidoSchema);

// Ruta para recibir un nuevo pedido
app.post('/api/pedidos', async (req, res) => {
  try {
    const nuevoPedido = new Pedido(req.body);
    await nuevoPedido.save();
    res.send({ mensaje: '✅ Pedido guardado exitosamente' });
  } catch (error) {
    console.error('❌ Error al guardar el pedido:', error);
    res.status(500).send({ mensaje: '❌ Error al guardar el pedido' });
  }
});

// Ruta para obtener todos los pedidos
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.send(pedidos);
  } catch (error) {
    console.error('❌ Error al obtener los pedidos:', error);
    res.status(500).send({ mensaje: '❌ Error al obtener pedidos' });
  }
});

// Ruta para actualizar el estado de un pedido por ID
app.put('/api/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(pedido);
  } catch (error) {
    console.error('❌ Error al actualizar el pedido:', error);
    res.status(500).send({ mensaje: '❌ Error al actualizar el pedido' });
  }
});

// Ruta para eliminar un pedido por ID
app.delete('/api/pedidos/:id', async (req, res) => {
  try {
    const resultado = await Pedido.findByIdAndDelete(req.params.id);
    if (!resultado) {
      return res.status(404).send({ mensaje: "Pedido no encontrado" });
    }
    res.send({ mensaje: "Pedido eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el pedido:", error);
    res.status(500).send({ mensaje: "Error interno del servidor" });
  }
});


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor escuchando en puerto ${PORT}`));
