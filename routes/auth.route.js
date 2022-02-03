const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');
// ruta = /api/auth
const router = Router();

router.post(
	'/login',
	[
		check('correo', 'El correo es obligatorio').isEmail(),
		check('password', 'La contraseña es obligatoria').not().isEmpty(),
		validarCampos,
	],
	login
);

router.post(
	'/google',
	[
		check('id_token', 'Token de google es necesario').not().isEmpty(),
		validarCampos,
	],
	googleSignIn
);

module.exports = router;
