/* eslint-disable */

'use strict'

import { app, BrowserWindow, protocol } from 'electron'
// import { schemeName, setupProtocolHandler } from './protocol'

const path = require('path')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`


function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 400,
    useContentSize: true,
    width: 400
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', function () {
  createWindow()
})

// app.on('activate', () => {
//   mainWindow.show()
//   mainWindow.loadURL(`${winURL}/#/`)
// })

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

var expressApp = require('express')();
var http = require('http').Server(expressApp);
var io = require('socket.io')(http);
var cors = require('cors')
global.io = io

const { ipcMain } = require('electron')

expressApp.use(cors())

io.set('origins', '*:*');

expressApp.get('/', function (req, res) {
  res.send('hello!');
});

io.on('connection', function (socket) {
  console.log('a user connected');
  const nonce = Math.random().toString(36).substring(7);

  socket.on('auth', function (data) {
    const origin = data.origin.split('//')[1]
    // console.log(winURL)
    mainWindow.show()
    mainWindow.loadURL(`${winURL}/#/authenticate/?domain=${origin}&permissions=${JSON.stringify(data.permissions)}&nonce=${nonce}`)
    console.log('auth!');
  });

  const handler = (event, arg) => {
    socket.emit(arg.channel, arg.data)
    event.returnValue = null
    mainWindow.hide()
  }

  ipcMain.on('synchronous-message', handler)

  socket.on('disconnect', () => {
    ipcMain.removeListener('synchronous-message', handler)
  })
});

http.listen(4242, function () {
  console.log('listening on *:4242');
});

