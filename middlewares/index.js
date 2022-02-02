const validaCampos = require('./validar-campos');
const validarJWT = require('./validar-jwt');
const validaRoles = require('./validar-roles');

module.exports = {
	...validaCampos,
	...validarJWT,
	...validaRoles,
};
