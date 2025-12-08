import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerDefinition } from './docs/swaggerDef.js';

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', './routes/*.ts'], 
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  try {
    
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  } catch (error) {
    console.error(error)
  }
};
