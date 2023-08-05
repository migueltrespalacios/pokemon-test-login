const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Por favor ingrese un correo electronico"],
        unique: [true, "Correo electronico ya existe"],
    },

    password: {
        type: String,
        required: [true, "Por favor ingrese una contraseña"],
        unique: false,
    },
});

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);