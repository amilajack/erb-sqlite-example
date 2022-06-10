const Sequelize = require('sequelize');
const _ = require('lodash');

const modelName = 'Setting';
const tableName = 'setting_table';

const fields = {
  settingId: {
    type: Sequelize.INTEGER,
    field: 'setting_id',
    primaryKey: true,
    autoIncrement: true,
  },
  key: {
    type: Sequelize.STRING,
    field: 'key',
    allowNull: true,
  },
  value: {
    type: Sequelize.STRING,
    field: 'value',
    allowNull: true,
  },
};

const handleUpsertSetting = (conn, Model) => async (setting) => {
  Object.keys(setting).forEach(async (keyObj) => {
    const key = _.snakeCase(keyObj);
    let q = `SELECT key, value FROM setting_table where key = :key`;
    const res = await conn.query(q, {
      replacements: {
        key,
      },
    });
    if (_.isEmpty(res[0])) {
      q = 'INSERT INTO setting_table(key, value) VALUES (:key, :value)';
      await conn.query(q, {
        replacements: {
          key,
          value: JSON.stringify(setting[keyObj]),
        },
      });
    } else {
      q = [`UPDATE setting_table`, `SET value = :value`, `WHERE key = :key`]
        .filter((i) => i !== null)
        .join(' ');
      await conn.query(q, {
        replacements: {
          key,
          value: JSON.stringify(setting[keyObj]),
        },
      });
    }
  });
};

const handleGetSetting = (conn, Model) => async () => {
  const q = `SELECT key, value FROM setting_table`;
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
  Model.handleUpsertSetting = handleUpsertSetting(conn, Model);
  Model.handleGetSetting = handleGetSetting(conn, Model);
  return Model.sync();
};

module.exports = { name: modelName, init };
