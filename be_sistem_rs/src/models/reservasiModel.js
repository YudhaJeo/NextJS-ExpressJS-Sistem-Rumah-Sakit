import db from '../core/config/knex.js';

export async function getAll() {
    return await db.Reservasi.findAll();
}

export async function create(data) {
    return await db.Reservasi.create(data);
}

export async function update(id, data) {
    return await db.Reservasi.update(data, { where: { id } });
}

export async function remove(id) {
    return await db.Reservasi.destroy({ where: { id } });
}
