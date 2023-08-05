const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = async () => {

    mongoose.connect(process.env.DB_URL).then(() => {
        console.log('Conexión con base de datos exitosa')
    }).catch((err) => {
        console.log("No se ha podido conectar con la base de datos");
        console.error(err);
    });
};

module.exports = dbConnect;