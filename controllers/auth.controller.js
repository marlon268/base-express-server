const bcryptjs = require('bcryptjs');
const { request, response } = require('express');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req = request, res = response) => {
	const { correo, password } = req.body;

	try {
		const usuario = await Usuario.findOne({ correo });

		// Verificar si el correo existe
		if (!usuario) {
			return res
				.status(400)
				.json({ msg: 'Usuario / password no son correctos - correo' });
		}

		// Verificar si el usuario esta activo en la base de datos
		if (!usuario.estado) {
			return res.status(400).json({
				msg: 'Usuario / password no son correctos - Estado: false',
			});
		}

		// Verificar la contraseña
		const validPassword = bcryptjs.compareSync(password, usuario.password);
		if (!validPassword) {
			return res.status(400).json({
				msg: 'Usuario / password no son correctos - password',
			});
		}

		// General el JWT
		const token = await generarJWT(usuario.id);

		res.json({
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: 'Hable con el administrador' });
	}
};

module.exports = {
	login,
};
