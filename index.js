const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require('electron')
var win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 500,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadURL('file://' + __dirname + '/index.html')
}

app.on('ready', createWindow)

ipcMain.on('minimize-app', (event) => {
    win.minimize();
})

ipcMain.on('maximize-app', (event) => {
    win.maximize();
})

ipcMain.on('unmaximize-app', (event) => {
    win.unmaximize();
})

ipcMain.on('close-app', (event) => {
    win.close();
})

ipcMain.on('Path-request', (event, Platform) => {
    dialog.showOpenDialog(win, {
        properties: ['openFile'],
        filters: [{
                name: 'Supported Files',
                extensions: ['txt', 'xlsx']
            },
            {
                name: 'Text Files',
                extensions: ['txt']
            },
            {
                name: 'Excel Files',
                extensions: ['xlsx']
            },
            {
                name: 'All Files',
                extensions: ['*']
            }
        ]
    }).then(result => {
        if (!result.canceled) event.reply('Path-reply', result.filePaths, Platform)
    }).catch(err => {
        console.log(err)
    })

})