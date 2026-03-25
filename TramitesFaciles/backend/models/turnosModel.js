const db = require("../config/db");

exports.getAll = async () => {
    const [rows] = await db.query("SELECT * FROM tickets");
    return rows;
};

exports.getById = async (id_user) => {
    const [rows] = await db.query("SELECT * FROM tickets WHERE id_user = ?",[id_user]);
    return rows;
};


exports.createTurno = async (
    id_user,
    dateCreated,
    deliveryTime,
    status,
    service,
    description
) => {
    const [rows] = await db.query(
        "INSERT INTO `tickets` (`id_user`, `dateCreated`, `deliveryTime`, `status`, `service`, `description`) VALUES (?, ?, ?, ?, ?, ?)",
        [id_user, dateCreated, deliveryTime, status, service, description]
    );
    return rows;
};

exports.updateTurno = async (id, datos) => {
    const campos = [];
    const params = [];

    const array = ["id_user", "dateCreated", "deliveryTime", "status", "service", "description"];

    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (datos[element] !== undefined && datos[element] !== null) {
            campos.push(`${element}=?`);
            params.push(datos[element]);
        }
    }


    const sql = `UPDATE tickets SET ${campos.join(", ")} WHERE id_ticket = ?`;
    params.push(id);

    const [rows] = await db.query(sql, params);
    return rows;
};

exports.deleteTurno = async (id_ticket) => {
    const [rows] = await db.query(
        "DELETE FROM tickets WHERE id_ticket = ?", [id_ticket]
    );
    return rows;
};

exports.checkDisponibilidad = async (deliveryTime) => {
    const [rows] = await db.query(
        "SELECT * FROM tickets WHERE deliveryTime = ? AND status != 'cancelado'",
        [deliveryTime]
    );
    return rows.length > 0; // true = ocupado
};

exports.getHorariosOcupados = async (fecha) => {
    const [rows] = await db.query(
        `SELECT deliveryTime FROM tickets 
         WHERE DATE(deliveryTime) = ? 
         AND status != 'cancelado'`,
        [fecha]
    );
    return rows.map(r => {
        const date = new Date(r.deliveryTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    });
};