const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require('electron')

var mainwin, Loginwin;

var isWin = process.platform === "win32";
if (isWin) app.setPath('userData', app.getPath('home') + '\\OneDrive\\GameKey')

function createAppWindow() {
    mainwin = new BrowserWindow({
        minWidth: 900,
        minHeight: 650,
        //transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            devTools: false
        }
    })

    mainwin.loadURL('file://' + __dirname + '/index.html')
}

function createLoginWindow() {
    Loginwin = new BrowserWindow({
        width: 550,
        height: 685,
        maxWidth: 550,
        maxHeight: 685,
        transparent: true,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            devTools: false
        }
    })
    Loginwin.loadURL('file://' + __dirname + '/Login.html');
    setTimeout(() => {
        Loginwin.show();
    }, 1000);
}

app.on('ready', createLoginWindow)

ipcMain.on('userData-Path', (event) => {
    event.returnValue = app.getPath('userData').replace(/\\/g, '/');
})

ipcMain.on('minimize-app', () => {
    if (mainwin != null)
        mainwin.minimize();
    else Loginwin.minimize();
})

ipcMain.on('access-app', () => {
    createAppWindow();
    Loginwin.close();
    Loginwin = null;
})

ipcMain.on('Log-Out', () => {
    createLoginWindow();
    mainwin.close();
    mainwin = null;
})

ipcMain.on('maximize-app', (event) => {
    mainwin.isMaximized() ? mainwin.unmaximize() : mainwin.maximize();
    event.reply('isMaximized', mainwin.isMaximized())
})

ipcMain.on('isMaximized', (event) => {
    event.reply('isMaximized', mainwin.isMaximized())
})

ipcMain.on('close-app', () => {
    app.quit();
})

ipcMain.on('setSize', (event, width, height) => {
    mainwin.setSize(width, height);
    mainwin.center();
})

ipcMain.on('open-link', (event, link) => {
    var open = require("open");
    open(link);
})

ipcMain.on('Path-request', (event, Platform) => {
    dialog.showOpenDialog(mainwin, {
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

ipcMain.on('xlsx-Export-request', (event, Platform) => {
    dialog.showSaveDialog(mainwin, {
        properties: ['saveFile'],
        title: "Choose Export Path",
        filters: [{
            name: 'Excel File',
            extensions: ['xlsx']
        }]
    }).then(result => {
        if (!result.canceled) event.reply('xlsx-Export-reply', result.filePath, Platform)
    }).catch(err => {
        console.log(err)
    })
})

ipcMain.on('txt-Export-request', (event, Platform) => {
    dialog.showSaveDialog(mainwin, {
        properties: ['saveFile'],
        title: "Choose Export Path",
        filters: [{
            name: 'Text File',
            extensions: ['txt']
        }]
    }).then(result => {
        if (!result.canceled) event.reply('txt-Export-reply', result.filePath, Platform)
    }).catch(err => {
        console.log(err)
    })
})