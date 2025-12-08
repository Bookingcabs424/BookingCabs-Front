export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'BookingCabs API',
    version: '1.0.0',
    description: 'API documentation for BookingCabs app',
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // optional, just for documentation
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};
