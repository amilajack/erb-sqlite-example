const Sequelize = require('sequelize');
const _ = require('lodash');

const modelName = 'Account';
const tableName = 'account_table';

const fields = {
  accountId: {
    type: Sequelize.INTEGER,
    field: 'account_id',
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  birthday: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  categoryId: {
    type: Sequelize.NUMBER,
    field: 'category_id',
    allowNull: false,
  },
  friendCount: {
    type: Sequelize.NUMBER,
    field: 'friend_count',
    allowNull: false,
    default: 0,
  },
  groupCount: {
    type: Sequelize.NUMBER,
    field: 'group_count',
    allowNull: false,
    default: 0,
  },
};

// method: add single account
const handleAddAccount = (conn, Model) => async (args) => {
  // add account query:
  const q =
    'INSERT INTO account_table(name, email, birthday, category_id, friend_count, group_count) VALUES (:name, :email, :birthday, :categoryId, :friendCount, :groupCount)';

  const res = await conn.query(q, {
    replacements: {
      name: args.name,
      email: args.email,
      birthday: args.birthday,
      categoryId: args.categoryId,
      friendCount: args.friendCount,
      groupCount: args.groupCount,
    },
  });
  return res[0];
};

// method: get single account by id
const handleGetAccount = (conn, Model) => async (accountId) => {
  // query:
  const q = [
    `SELECT account_id, name, email, birthday, category_id AS categoryId, friend_count AS friendCount, group_count AS groupCount FROM account_table`,
    `WHERE account_id = :accountId`,
  ]
    .filter((i) => i !== null)
    .join(' ');
  const res = await conn.query(q, {
    replacements: {
      accountId,
    },
  });
  return res[0];
};

// method: update single account description
const handleUpdateAccount = (conn, Model) => async (args) => {
  // query:
  const q = [
    `UPDATE account_table`,
    `SET name = :name, email = :email, birthday = :birthday, category_id = :categoryId, friend_count = :friendCount, group_account = :groupCcount`,
    `WHERE account_id = :accountId`,
  ]
    .filter((i) => i !== null)
    .join(' ');

  const res = await conn.query(q, {
    replacements: {
      accountId: args.accountId,
      name: args.name,
      email: args.email,
      birthday: args.birthday,
      categoryId: args.categoryId,
      friendAccount: args.friendCount,
      groupCount: args.groupCount,
    },
  });

  return res[0];
};

// method: delete single account by id
const handleDeleteAccount = (conn, Model) => async (accountId) => {
  // delete account query:
  const q = [`DELETE FROM account_table`, `WHERE account_id = :accountId`]
    .filter((i) => i !== null)
    .join(' ');
  const res = await conn.query(q, {
    replacements: {
      accountId,
    },
  });
  return res[0];
};

// method: get all existing accounts
const handleGetAccounts = (conn, Model) => async (searchQuery) => {
  // query:
  const q = [
    `SELECT account_id AS accountId, account_table.name, email, birthday, account_table.category_id AS categoryId, category_table.name AS category, friend_count AS friendCount, group_count AS groupCount`,
    `FROM account_table`,
    `INNER JOIN category_table`,
    `ON account_table.category_id = category_table.category_id WHERE 1 = 1`,
  ];
  let replacements = {};
  if (!_.isEmpty(_.get(searchQuery, 'categories', []))) {
    q.push(`AND categoryId in (:categories)`);
    replacements = {
      ...replacements,
      ...{ categories: _.get(searchQuery, 'categories') },
    };
  }
  if (!_.isEmpty(_.get(searchQuery, 'name', ''))) {
    q.push(`AND account_table.name like :name`);
    replacements = {
      ...replacements,
      ...{ name: `%${_.get(searchQuery, 'name')}%` },
    };
  }
  const query = q.filter((i) => i !== null).join(' ');
  const res = await conn.query(query, { replacements });
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
  Model.handleAddAccount = handleAddAccount(conn, Model);
  Model.handleGetAccount = handleGetAccount(conn, Model);
  Model.handleUpdateAccount = handleUpdateAccount(conn, Model);
  Model.handleDeleteAccount = handleDeleteAccount(conn, Model);
  Model.handleGetAccounts = handleGetAccounts(conn, Model);
  return Model.sync();
};

module.exports = { name: modelName, init };
