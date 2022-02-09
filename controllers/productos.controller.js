const { request, response } = require('express');

const { Producto } = require('../models');

// obtenerProductos - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {
	const { limite = 5, desde = 0 } = req.query;
	const query = { estado: true };

	const [total, productos] = await Promise.all([
		Producto.countDocuments(query),
		Producto.find(query)
			.populate('usuario', 'nombre')
			.populate('categoria', 'nombre')
			.skip(Number(desde))
			.limit(Number(limite)),
	]);

	res.json({
		total,
		productos,
	});
};

// obtenerProducto - populate
const obtenerProducto = async (req = request, res = response) => {
	const { id } = req.params;
	const producto = await Producto.findById(id)
		.populate('usuario', 'nombre')
		.populate('categoria', 'nombre');

	res.json(producto);
};

const crearProducto = async (req = request, res = response) => {
	const { estado, usuario, ...body } = req.body;

	const productoDB = await Producto.findOne({ nombre: body.nombre });

	if (productoDB) {
		return res.status(400).json({
			msg: `La producto ${productoDB.nombre} ya existe`,
		});
	}

	// Generar la data a guardar
	const data = {
		...body,
		nombre: body.nombre.toUpperCase(),
		usuario: req.usuario.id,
	};

	const producto = new Producto(data);

	// Duardar en DB
	await producto.save();

	res.status(201).json(producto);
};

// actualizarCategoria
const actualizarProducto = async (req = request, res = response) => {
	const { id } = req.params;
	const { estado, usuario, ...data } = req.body;

	if (data.nombre) {
		data.nombre = data.nombre.toUpperCase();
	}

	data.usuario = req.usuario._id;

	const producto = await Producto.findByIdAndUpdate(id, data, {
		new: true,
	}).populate('usuario', 'nombre');

	res.json(producto);
};

// borrarCategoria - cambiar estado a false
const borrarProducto = async (req = request, res = response) => {
	const { id } = req.params;
	const productoBorrado = await Producto.findByIdAndUpdate(
		id,
		{ estado: false },
		{ new: true }
	);

	res.json(productoBorrado);
};

module.exports = {
	crearProducto,
	obtenerProductos,
	obtenerProducto,
	actualizarProducto,
	borrarProducto,
};
