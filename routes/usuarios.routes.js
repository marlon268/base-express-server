const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const {
	esRolValido,
	emailExiste,
	existeUsuarioPorId,
} = require('../helpers/db-validators');

const {
	usuariosGet,
	usuariosPost,
	usuariosPut,
	usuariosDelete,
	usuariosPatch,
} = require('../controllers/usuarios.controllers');

// ruta = /api/usuarios
const router = Router();

router.get('/', usuariosGet);

router.post(
	'/',
	[
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check(
			'password',
			'El password es olbigatorio y debe de contener seis caracteres o mas'
		).isLength({ min: 6 }),
		check('correo', 'El correo no es válido').isEmail(),
		check('correo').custom(emailExiste),
		//check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
		check('rol').custom(esRolValido),
		validarCampos,
	],
	usuariosPost
);

router.put(
	'/:id',
	[
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existeUsuarioPorId),
		check('rol').custom(esRolValido),
		validarCampos,
	],
	usuariosPut
);

router.delete(
	'/:id',
	[
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existeUsuarioPorId),
		validarCampos,
	],
	usuariosDelete
);

router.patch('/', usuariosPatch);

module.exports = router;
