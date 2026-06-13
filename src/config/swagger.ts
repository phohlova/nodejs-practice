import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

interface SwaggerOptions {
	definition: {
		openapi: string;
		info: {
		title: string;
		version: string;
		description: string;
		};
		servers: Array<{ url: string; description: string }>;
		components: {
		securitySchemes: {
			bearerAuth: {
			type: string;
			scheme: string;
			bearerFormat: string;
			};
		};
		};
	};
	apis: string[];
}

const apisPath = path.join(__dirname, '../routes/*').replace(/\\/g, '/');

const options: SwaggerOptions = {
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