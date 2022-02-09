const { request, response } = require('express');

const { Categoria } = require('../models');

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
	const { limite = 5, desde = 0 } = req.query;
	const query = { estado: true };

	const [total, categorias] = await Promise.all([
		Categoria.countDocuments(query),
		Categoria.find(query)
			.populate('usuario', 'nombre')
			.skip(Number(desde))
			.limit(Number(limite)),
	]);

	res.json({
		total,
		categorias,
	});
};

// obtenerCategoria - populate
const obtenerCategoria = async (req = request, res = response) => {
	const { id } = req.params;
	const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

	res.json(categoria);
};

const crearCategoria = async (req = request, res = response) => {
	const nombre = req.body.nombre.toUpperCase();

	const categoriaBD = await Categoria.findOne({ nombre });

	if (categoriaBD) {
		return res.status(400).json({
			msg: `La categoria ${categoriaBD.nombre} ya existe`,
		});
	}

	// Generar la data a guardar
	const data = {
		nombre,
		usuario: req.usuario.id,
	};

	const categoria = new Categoria(data);

	// Duardar en DB
	await categoria.save();

	res.status(201).json(categoria);
};

// actualizarCategoria
const actualizarCategoria = async (req = request, res = response) => {
	const { id } = req.params;
	const { estado, usuario, ...data } = req.body;

	data.nombre = data.nombre.toUpperCase();
	data.usuario = req.usuario._id;

	const categoria = await Categoria.findByIdAndUpdate(id, data, {
		new: true,
	}).populate('usuario', 'nombre');

	res.json(categoria);
};

// borrarCategoria - cambiar estado a false
const borrarCategoria = async (req = request, res = response) => {
	const { id } = req.params;
	const categoriaBorrada = await Categoria.findByIdAndUpdate(
		id,
		{ estado: false },
		{ new: true }
	);

	res.json(categoriaBorrada);
};

module.exports = {
	crearCategoria,
	obtenerCategorias,
	obtenerCategoria,
	actualizarCategoria,
	borrarCategoria,
};
