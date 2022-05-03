const Sequelize = require('sequelize');

const modelName = 'Todo';
const tableName = 'todo_table';

const fields = {
  todoId: {
    type: Sequelize.INTEGER,
    field: 'todo_id',
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

// method: add single todo
const handleAddTodo = (conn, Model) => async (description) => {
  // add todo query:
  const q = 'INSERT INTO todo_table(description) VALUES(:description)';

  const res = await conn.query(q, {
    replacements: {
      description,
    },
  });
  return res[0];
};

// method: get single todo by id
const handleGetTodo = (conn, Model) => async (todoId) => {
  // query:
  const q = [
    `SELECT todo_id, description FROM todo_table`,
    `WHERE todo_id = :todoId`,
  ]
    .filter((i) => i !== null)
    .join(' ');
  const res = await conn.query(q, {
    replacements: {
      todoId,
    },
  });
  return res[0];
};

// method: update single todo description
const handleUpdateTodo = (conn, Model) => async (args) => {
  // query:
  const q = [
    `UPDATE todo_table`,
    `SET description = :description`,
    `WHERE todo_id = :todoId`,
  ]
    .filter((i) => i !== null)
    .join(' ');

  const res = await conn.query(q, {
    replacements: {
      todoId: args.todoId,
      description: args.description,
    },
  });

  return res[0];
};

// method: delete single todo by id
const handleDeleteTodo = (conn, Model) => async (todoId) => {
  // delete todo query:
  const q = [`DELETE FROM todo_table`, `WHERE todo_id = :todoId`]
    .filter((i) => i !== null)
    .join(' ');
  const res = await conn.query(q, {
    replacements: {
      todoId,
    },
  });
  return res[0];
};

// method: get all existing todos
const handleGetTodos = (conn, Model) => async () => {
  // query:
  const q = 'SELECT * FROM todo_table';
  const res = await conn.query(q);
  return res[0];
};

// method: deletes all existing todos
const handleDeleteTodos = (conn, Model) => async () => {
  // query:
  const q = 'DELETE FROM todo_table';
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
  Model.handleAddTodo = handleAddTodo(conn, Model);
  Model.handleGetTodo = handleGetTodo(conn, Model);
  Model.handleUpdateTodo = handleUpdateTodo(conn, Model);
  Model.handleDeleteTodo = handleDeleteTodo(conn, Model);
  Model.handleGetTodos = handleGetTodos(conn, Model);
  Model.handleDeleteTodos = handleDeleteTodos(conn, Model);
  return Model.sync();
};

module.exports = { name: modelName, init };
