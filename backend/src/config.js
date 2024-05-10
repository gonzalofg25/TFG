import 'dotenv/config';

const Config = {
    SECRET: process.env.SECRET_KEY || 'products-api', // Cambio realizado
    port: process.env.PORT || 8080,
    icon: {
       host: process.env.MONGODB_HOST,
       port: process.env.MONGODB_PORT,
       dbName: process.env.MONGODB_DBNAME,
       user: process.env.MONGODB_USER,
       password: process.env.MONGODB_PASSWORD,
    },
};

export default Config;