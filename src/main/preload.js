const { contextBridge, ipcRenderer } = require('electron');

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
      const result = await ipcRenderer.invoke('get-todos')
      return result
  },
  async addTodo(description) {
      await ipcRenderer.invoke('add-todo', description)
  },
  async updateTodo(args) {
      await ipcRenderer.invoke('update-todo', args)
  },
  async deleteTodo(todoId) {
      await ipcRenderer.invoke('delete-todo', todoId)
  },
  async deleteTodos() {
      await ipcRenderer.invoke('delete-todos')
  }
});
