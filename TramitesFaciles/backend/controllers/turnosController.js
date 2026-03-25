const Turnos = require("../models/turnosModel");

exports.getAllTurnos = async (req, res) => {
    try {
        const turnos = await Turnos.getAll();

        res.json({ ok: true, turno: turnos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllById = async (req, res) => {
    try {
        const id_user = req.params.id_user;
        const turnos = await Turnos.getById(id_user);

        res.json({ ok: true, turno: turnos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createTurno = async (req, res) => {
    try {
        let { id_user, dateCreated, deliveryTime, status, description, service } = req.body;

        // Si el cliente no manda `service` por separado, intentar parsearlo desde `description`
        if ((!service || service.toString().trim() === "") && description) {
            const raw = description.toString();
            const idx = raw.indexOf(":");
            if (idx !== -1) {
                service = raw.slice(0, idx).trim();
                description = raw.slice(idx + 1).trim();
            } else {
                service = "";
            }
        }

            const ocupado = await Turnos.checkDisponibilidad(deliveryTime);
            if (ocupado) {
                return res.status(400).json({ 
                    error: "El horario seleccionado ya está ocupado. Por favor elegí otro." 
            });
        }

        const create = await Turnos.createTurno(
            id_user,
            dateCreated,
            deliveryTime,
            status,
            service,
            description
        );
        
        res.json({ ok: true, turno: create });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTurno = async (req, res) => {
    try {
        const id_ticket = req.params.id;
        const datos = req.body;

        // Si recibimos una descripción combinada, separarla en service+description
        if (datos.description && (!datos.service || datos.service.toString().trim() === "")) {
            const raw = datos.description.toString();
            const idx = raw.indexOf(":");
            if (idx !== -1) {
                datos.service = raw.slice(0, idx).trim();
                datos.description = raw.slice(idx + 1).trim();
            }
        }

        const update = await Turnos.updateTurno(id_ticket, datos);
        res.json({ ok: true, turno: update });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTurno = async (req, res) => {
    try {
        const id_ticket = req.params.id_ticket;
        const deleteTurn = await Turnos.deleteTurno(id_ticket);

        res.json({ ok: true, turno: deleteTurn });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHorariosOcupados = async (req, res) => {
    try {
        const { fecha } = req.params;
        const horarios = await Turnos.getHorariosOcupados(fecha);
        res.json({ ok: true, horariosOcupados: horarios });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};