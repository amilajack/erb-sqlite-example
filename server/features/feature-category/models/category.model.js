const Sequelize = require('sequelize');

const modelName = 'Category';
const tableName = 'category_table';

const fields = {
  categoryId: {
    type: Sequelize.INTEGER,
    field: 'category_id',
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

// method: add single category
const handleAddCategory = (conn, Model) => async (name) => {
  // add category query:
  const q = 'INSERT INTO category_table(name) VALUES(:name)';

  const res = await conn.query(q, {
    replacements: {
      name,
    },
  });
  return res[0];
};

// method: get single category by id
const handleGetCategory = (conn, Model) => async (categoryId) => {
  // query:
  const q = [
    `SELECT category_id, name FROM category_table`,
    `WHERE category_id = :categoryId`,
  ]
    .filter((i) => i !== null)
    .join(' ');
  const res = await conn.query(q, {
    replacements: {
      categoryId,
    },
  });
  return res[0];
};

// method: update single category description
const handleUpdateCategory = (conn, Model) => async (args) => {
  // query:
  const q = [
    `UPDATE category_table`,
    `SET name = :name`,
    `WHERE category_id = :categoryId`,
  ]
    .filter((i) => i !== null)
    .join(' ');

  const res = await conn.query(q, {
    replacements: {
      categoryId: args.categoryId,
      name: args.name,
    },
  });

  return res[0];
};

// method: delete single category by id
const handleDeleteCategory = (conn, Model) => async (categoryId) => {
  // delete category query:
  const q = [`DELETE FROM category_table`, `WHERE category_id = :categoryId`]
    .filter((i) => i !== null)
    .join(' ');
  const res = await conn.query(q, {
    replacements: {
      categoryId,
    },
  });
  return res[0];
};

// method: get all existing categories
const handleGetCategories = (conn, Model) => async () => {
  // query:
  const q = 'SELECT category_id AS categoryId, name AS name FROM category_table';
  const res = await conn.query(q);
  return res[0];
};

const options = {
  tableName,
  freezeTableName: true,
  underscored: true,
  createdAt: false,
  updatedAt: false,
};

const init = (conn) => {
  const Model = conn.define(modelName, fields, options);
  // export the model methods here
  Model.handleAddCategory = handleAddCategory(conn, Model);
  Model.handleGetCategory = handleGetCategory(conn, Model);
  Model.handleUpdateCategory = handleUpdateCategory(conn, Model);
  Model.handleDeleteCategory = handleDeleteCategory(conn, Model);
  Model.handleGetCategories = handleGetCategories(conn, Model);
  return Model.sync();
};

module.exports = { name: modelName, init };
