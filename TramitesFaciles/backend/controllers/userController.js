const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
    try {
    let { name, lastname, email, type, password, phone } = req.body;

        if (type === "user") type = 1;
        else if (type === "admin") type = 0;
        else
            return res.status(400).json({ error: "El tipo de usuario no es válido" });

        // verificar si ya existe el mail
        const existingUser = await Users.getByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "El email ya está registrado" });
        }

        // encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const create = await Users.createUser(
            name,
            lastname,
            email,
            type,
            hashedPassword,
            phone
        );

        return res.status(201).json({
            ok: true,
            message: "Usuario creado correctamente",
            user: create,
        });
    } catch (error) {
        console.log("Error en createUser:", error);
        return res.status(500).json({
            error: "Error interno del servidor",
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await Users.getAll();
        res.json({ ok: true, users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const id_user = req.params.id;
        const user = await Users.getById(id_user);

        if (!user || user.length === 0)
            return res
                .status(404)
                .json({ ok: false, error: "Usuario no encontrado" });

        res.json({ ok: true, user: user[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const id_user = req.params.id;
        const datos = req.body;
        let { type } = req.body;

        // Convertir el tipo de usuario si está presente
        if (type != undefined && type != null) {
            if (type === "user") {
                type = 1;
            } else if (type === "admin") {
                type = 0;
            } else {
                return res
                    .status(400)
                    .json({ error: "El tipo de usuario no es válido" });
            }

            datos.type = type;
        }

        const update = await Users.updateUser(id_user, datos);
        res.json({ ok: true, user: update });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.changePsw = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const id = req.params.id;

        // Verificar que el usuario existe
        const user = await Users.getById(id);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Verificar que la contraseña actual es correcta
        const valid = await bcrypt.compare(currentPassword, user[0].password);
        if (!valid) {
            return res
                .status(401)
                .json({ error: "La contraseña actual es incorrecta" });
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await Users.changePsw(id, hashedPassword);

        res.json({ ok: true, message: "Contraseña actualizada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const id_user = req.params.id;
        const deleteUsr = await Users.deleteUser(id_user);
        res.json({ ok: true, user: deleteUsr });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(401)
                .json({ error: "Es necesario el email y la contraseña" });
        }

        const user = await Users.login(email);
        console.log("Respuesta Users.login:", user);

        if (!user) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        // Puede venir como array o como objeto|
        const usr = Array.isArray(user) ? user[0] : user;

        if (!usr) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        if (!usr.password) {
            return res
                .status(500)
                .json({ error: "Error interno: usuario sin contraseña" });
        }

        const valid = await bcrypt.compare(password, usr.password);
        if (!valid) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { id: usr.id_user, email: usr.email, type: usr.type },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            message: "Se inicio sesion correctamente",
            token,
            user: { id: usr.id_user, email: usr.email, type: usr.type, name: usr.name, lastname: usr.lastname },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

exports.logout = (req, res) => {
    try {
        return res.status(200).json({
            ok: true,
            message: "Sesión cerrada correctamente",
        });
    } catch (error) {
        console.error("Error en logout:", error);
        return res.status(500).json({
            ok: false,
            error: "Error al cerrar sesión",
        });
    }
};
