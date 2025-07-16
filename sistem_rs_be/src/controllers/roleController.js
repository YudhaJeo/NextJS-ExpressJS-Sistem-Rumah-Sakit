import * as RoleModel from '../models/roleModel.js';

export const getRoles = async (req, res) => {
  try {
    const roles = await RoleModel.getAllRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRole = async (req, res) => {
  try {
    const role = await RoleModel.getRoleById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role tidak ditemukan' });
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const [id] = await RoleModel.createRole(req.body);
    res.status(201).json({ message: 'Role berhasil ditambahkan', id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    await RoleModel.updateRole(req.params.id, req.body);
    res.json({ message: 'Role berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await RoleModel.deleteRole(req.params.id);
    res.json({ message: 'Role berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
