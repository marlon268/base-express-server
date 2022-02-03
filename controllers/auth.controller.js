const bcryptjs = require('bcryptjs');
const { request, response } = require('express');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req = request, res = response) => {
	const { id_token } = req.body;
	try {
		const { nombre, img, correo } = await googleVerify(id_token);

		let usuario = await Usuario.findOne({ correo });

		if (!usuario) {
			// Crear usuario
			const data = {
				nombre,
				correo,
				password: ':p',
				img,
				rol: 'USER_ROLE',
				google: true,
			};

			usuario = new Usuario(data);
			await usuario.save();
		}

		// Si el usuario en BD
		if (!usuario.estado) {
			return res
				.status(401)
				.json({ msg: 'Hable con el administrador usuario bloqueado' });
		}

		// General el JWT
		const token = await generarJWT(usuario.id);

		res.json({ usuario, token });
	} catch (error) {
		console.log(error);
		res.status(400).json({ ok: false, msg: 'El token no se pudo verificar' });
	}
};

module.exports = {
	login,
	googleSignIn,
};
