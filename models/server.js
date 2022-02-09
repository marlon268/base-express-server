const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.db');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;

		this.paths = {
			auth: '/api/auth',
			buscar: '/api/buscar',
			categorias: '/api/categorias',
			productos: '/api/productos',
			usuarios: '/api/usuarios',
		};

		// Conectar a base de datos
		this.conectarDB();

		// Middlewares
		this.middlewares();

		// Rutas de mi aplicación
		this.routes();
	}

	async conectarDB() {
		await dbConnection();
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		// Lectura y parseo del body
		this.app.use(express.json());

		// Directorio publico
		this.app.use(express.static('public'));
	}

	routes() {
		this.app.use(this.paths.auth, require('../routes/auth.route'));
		this.app.use(this.paths.buscar, require('../routes/buscar.route'));
		this.app.use(
			this.paths.categorias,
			require('../routes/categorias.route')
		);
		this.app.use(this.paths.productos, require('../routes/productos.route'));
		this.app.use(this.paths.usuarios, require('../routes/usuarios.route'));
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log('servidor corriendo en puerto', this.port);
		});
	}
}

module.exports = Server;
