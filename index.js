const { app, BrowserWindow } = require("electron");
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  });
  win.webContents.openDevTools()
  win.loadFile("index.html");

  setTimeout(() => {
    win.webContents.send('asynchronous-message', {'SAVED': 'File Saved'});
  }, 5000)
}

app.whenReady().then(() => {
  createWindow();
});
