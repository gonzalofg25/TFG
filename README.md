# Barber-Dates

Aplicación web para la reserva de citas entre clientes y barberos.

## Descripción del Proyecto

Barber-Dates es una aplicación web diseñada para facilitar la reserva de citas entre clientes y barberos. La aplicación permite a los clientes registrarse, iniciar sesión, buscar barberos y reservar citas de manera eficiente. Los barberos pueden gestionar sus citas y proporcionar feedback a sus clientes.

## Tecnologías Utilizadas

### Backend
- **Node.js**: Entorno de ejecución para aplicaciones en el servidor.
- **Express**: Framework para Node.js que permite crear una API RESTful.
- **MongoDB**: Base de datos NoSQL para manejar grandes volúmenes de datos.

### Frontend
- **React**: Biblioteca para la construcción de interfaces de usuario dinámicas y de alto rendimiento.

## Arquitectura

La arquitectura de la aplicación se basa en una estructura modular que integra un frontend desarrollado con React y un backend desarrollado con Node.js y Express. La comunicación entre el frontend y el backend se realiza a través de una API RESTful, utilizando JSON Web Tokens (JWT) para la autenticación y autorización. La base de datos MongoDB proporciona flexibilidad y capacidad para manejar grandes volúmenes de datos.

## Metodología de Trabajo

Se ha utilizado la metodología Agile para gestionar el proyecto, permitiendo adaptaciones continuas y feedback constante. Esto garantiza una entrega incremental y continua de funcionalidades, mejorando la calidad del producto a través de la retroalimentación continua.

## Despliegue

### Backend
El backend está desplegado en **Render**, una plataforma que permite desplegar aplicaciones Node.js de manera sencilla y eficiente. Los cambios se despliegan automáticamente cada vez que se realiza un push a la rama principal del repositorio en GitHub.

### Frontend
El frontend está desplegado en **Netlify**, ideal para aplicaciones estáticas. Netlify proporciona un flujo de trabajo continuo de integración y despliegue (CI/CD), facilitando la implementación de nuevas versiones del frontend.

## Base de Datos

La estructura de la base de datos está diseñada en MongoDB, con un modelo relacional básico que incluye las siguientes colecciones:
- **User**: Información de los usuarios (Id, Username, Password, Email, Role, Timestamp).
- **Review**: Reseñas de los barberos (Id, Client, Barber, Rating, Comment).
- **Appointment**: Citas agendadas (Id, Client, Barber, Title, Date, Description).

## Estructura de Carpetas

### Backend
La estructura de carpetas para el backend es la siguiente:

\`\`\`
backend/
├── src/
│   ├── config/
│   │   └── morgan.js
│   ├── controllers/
│   │   └── appointmentController.js
│   │   └── authController.js
│   │   └── reviewController.js
│   │   └── users-controller.js
│   ├── loaders/
│   │   └── express-loader.js
│   │   └── index.js
│   │   └── mongodb-loader.js
│   ├── middlewares/
│   │   └── auth-middleware.js
│   │   └── error-middleware.js
│   │   └── query-middleware.js
│   ├── models/
│   │   └── Appointment.js
│   │   └── Review.js
│   │   └── User.js
│   ├── openapi/
│   │   └── examples.yml
│   │   └── index.js
│   │   └── paths.yml
│   │   └── responses.yml
│   │   └── schemas.yml
│   │   └── security.yml
│   ├── routes/
│   │   └── appointment-routes.js
│   │   └── auth-routes.js
│   │   └── index.js
│   │   └── review-routes.js
│   │   └── user-router.js
│   ├── services/
│   │   └── appointmentService.js
│   │   └── authService.js
│   │   └── user-db-services.js
│   ├── utils/
│   │   └── encrypt.js
│   │   └── index.js
│   │   └── logger.js
│   │   └── pagination.js
│   ├── app.js
│   ├── config.js
│   ├── index.js
├── .env
├── .env.template
├── .editorconfig
├── eslintrc.json
├── package.json
├── package-lock.json
\`\`\`

### Frontend
La estructura de carpetas para el frontend es la siguiente:

\`\`\`
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Ejercicio/
│   │   │   └── Login.js
│   │   │   └── PerfilAdmin.js
│   │   │   └── PerfilBarbero.js
│   │   │   └── PerfilUsuario.js
│   │   │   └── Registrarse.js
│   │   ├── App.css
│   │   └── App.js
│   ├── resources/
│   │   └── JosefinSans-Semibold.ttf
│   │   └── logo.svg
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── reportWebVitals.js
│   └── setupTests.js
├── .env
├── package.json
├── package-lock.json
\`\`\`

## Pruebas

Para garantizar la calidad de la aplicación, se han definido los siguientes identificadores de calidad:
- **Funcionalidad**: La aplicación debe permitir la reserva de citas sin errores.
- **Usabilidad**: La interfaz de usuario debe ser intuitiva y fácil de usar.
- **Rendimiento**: La aplicación debe cargar en menos de dos segundos y manejar múltiples usuarios concurrentes.
- **Seguridad**: Los datos sensibles deben estar cifrados y protegidos.
- **Compatibilidad**: La aplicación debe ser compatible con diferentes navegadores y dispositivos.

## Arranque

Si deseas arrancar el proyecto, puede ejecutar el comando **npm run start:all**

## Documentación

Aparte de la documentación de Postman, también hay una documentación en Swagger en la siguiente página https://tfg-ndno.onrender.com/api-docs/