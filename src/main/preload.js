const { exec } = require('child_process');
const { contextBridge, ipcRenderer } = require('electron');
const { resolve, basename } = require('path');
const trash = require('trash');
const fs = require('fs');
const util = require('util');

const execProm = util.promisify(exec);
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});

// Export the apis per feature here:
contextBridge.exposeInMainWorld('api_todos', {
  async getTodos() {
    const result = await ipcRenderer.invoke('get-todos');
    return result;
  },
  async addTodo(description) {
    await ipcRenderer.invoke('add-todo', description);
  },
  async updateTodo(args) {
    await ipcRenderer.invoke('update-todo', args);
  },
  async deleteTodo(todoId) {
    await ipcRenderer.invoke('delete-todo', todoId);
  },
  async deleteTodos() {
    await ipcRenderer.invoke('delete-todos');
  },
});

contextBridge.exposeInMainWorld('api_categories', {
  async getCategories() {
    const result = await ipcRenderer.invoke('get-categories');
    return result;
  },
  async addCategory(name) {
    await ipcRenderer.invoke('add-category', name);
  },
  async updateCategory(args) {
    await ipcRenderer.invoke('update-category', args);
  },
});

contextBridge.exposeInMainWorld('api_accounts', {
  async getAccounts(searchQuery = {}) {
    const result = await ipcRenderer.invoke('get-accounts', searchQuery);
    return result;
  },
  async addAccounts(accounts) {
    await ipcRenderer.invoke('add-accounts', accounts);
  },
});

contextBridge.exposeInMainWorld('api_settings', {
  async getSetting() {
    const result = await ipcRenderer.invoke('get-setting');
    return result;
  },
  async upsertSetting(setting) {
    await ipcRenderer.invoke('upsert-setting', setting);
  },
});

contextBridge.exposeInMainWorld('ipc_function', {
  async execCmd(cmd) {
    const { stdout, stderr } = await execProm(cmd);
    return { stdout, stderr };
  },
  existsSync(dir) {
    return fs.existsSync(dir);
  },
  mkdirSync(dir) {
    return fs.mkdirSync(dir, { recursive: true });
  },
  renameSync(oldPath, newPath) {
    return fs.renameSync(oldPath, newPath);
  },
  resolvePath(dir, subdir) {
    return resolve(dir, subdir);
  },
  statSync(filePath) {
    return fs.statSync(filePath);
  },
  readFileSync(filePath) {
    return fs.readFileSync(filePath);
  },
  basename(filePath) {
    return basename(filePath);
  },
  async readDir(dir) {
    const fileDirs = await readdir(dir);
    return fileDirs;
  },
  async statIsDirectory(res) {
    return (await stat(res)).isDirectory();
  },
  async trash(path) {
    await trash(path);
  },
});
