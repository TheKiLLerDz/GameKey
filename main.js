const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require('electron');
const fs = require('fs');

var Key, Email;
var mainwin, Loginwin;

var isWin = process.platform === "win32";

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

app.on('ready', getDataPath);

function getDataPath() {
    // use this for portable app process.env.PORTABLE_EXECUTABLE_DIR 
    fs.readFile(app.getAppPath() + '\\UserdataPath.cfg', 'UTF-8', (err, path) => {
        if (err) {
            if (isWin) {
                var newpath = app.getPath('home') + '\\OneDrive\\GameKey';
                ExportUserDataPath(newpath);
                app.setPath('userData', newpath);
            }
            createLoginWindow();
            return;
        }
        app.setPath('userData', path);
        createLoginWindow();
    });
}

function createLoginWindow() {
    Loginwin = new BrowserWindow({
        maxWidth: 550,
        maxHeight: 658,
        minWidth: 550,
        minHeight: 658,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            devTools: false
        }
    });
    Loginwin.loadURL('file://' + __dirname + '/Login.html');
    Loginwin.hide();
}

ipcMain.on('userData-Path', (event) => {
    event.returnValue = app.getPath('userData').replace(/\\/g, '/');
})

ipcMain.on('minimize-app', () => {
    if (mainwin != null)
        mainwin.minimize();
    else Loginwin.minimize();
})

ipcMain.on('access-app', (event, key, email) => {
    Key = key;
    Email = email;
    createAppWindow();
    Loginwin.close();
    Loginwin = null;
})

ipcMain.on('Show-Login', (event, key) => {
    Loginwin.show();
})

ipcMain.on('Key-Changed', (event, key) => {
    Key = key;
})

ipcMain.on('Log-Out', () => {
    app.relaunch();
    app.quit();
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

ipcMain.on('get-data', (event) => {
    event.reply('get-data-reply', Key, Email);
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

ipcMain.on('DB-Path-request', (event, Platform) => {
    dialog.showOpenDialog(Loginwin, {
        properties: ['openDirectory']
    }).then(result => {
        if (!result.canceled) {
            ExportUserDataPath(result.filePaths[0]);
            app.relaunch();
            app.quit();
        }
    }).catch(err => {
        console.log(err)
    })
})

function ExportUserDataPath(path) {
    // use this for portable app process.env.PORTABLE_EXECUTABLE_DIR 
    fs.writeFile(app.getAppPath() + '\\UserdataPath.cfg', path,
        function (err) {
            if (err) console.log(err);
        });
}

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