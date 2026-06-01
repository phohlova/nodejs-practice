const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const apisPath = path.join(__dirname, '../routes/*.js').replace(/\\/g, '/');

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Currency API',
			version: '1.0.0',
			description: 'API для управления валютными сущностями',
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Development server',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	apis: [apisPath],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;