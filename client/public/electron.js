const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
// const electronInstaller = require('electron-winstaller');

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const Menu = electron.Menu

let mainWindow;
 
// try {
//   await electronInstaller.createWindowsInstaller({
//     appDirectory: '/tmp/build/my-app-64',
//     outputDirectory: '/tmp/build/installer64',
//     authors: 'My App Inc.',
//     exe: 'myapp.exe'
//   });
//   console.log('It worked!');
// } catch (e) {
//   console.log(`No dice: ${e.message}`);
// }

function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680});
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', function(){
  createWindow();

  const template = [
    {
      label: "File",
      submenu: [
        {
          label: 'submenu1',
          click: function(){
            console.log("Clicked submenu1")
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'submenu2',
          click: function(){
            console.log("Clicked submenu1")
          }
        },
      ]
    },
    {
      label: "Help",
      click: function(){
        electron.shell.openExternal('https://vizion.ai/forum')
      }
    }
  ]

  const menu = Menu.buildFromTemplate(template)

  Menu.setApplicationMenu(menu)
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});