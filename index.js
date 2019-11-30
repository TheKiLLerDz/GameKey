const {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
    screen
} = require('electron')
var mainwin, Loginwin;

app.setPath('userData', "C:/OneDrive/GameKey")

function createAppWindow() {
    mainwin = new BrowserWindow({
        width: 800,
        height: 500,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            //devTools: false
        }
    })

    mainwin.loadURL('file://' + __dirname + '/index.html')
}

function createLoginWindow() {
    const {
        width,
        height
    } = screen.getPrimaryDisplay().workAreaSize;
    Loginwin = new BrowserWindow({
        width: width * 0.5,
        height: height * 0.7,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    })

    Loginwin.loadURL('file://' + __dirname + '/Login.html')
}

app.on('ready', createLoginWindow)

ipcMain.on('minimize-app', (event) => {
    if (mainwin != null)
        mainwin.minimize();
    else Loginwin.minimize();
})

ipcMain.on('maximize-app', (event) => {
    mainwin.maximize();
})
ipcMain.on('access-app', (event) => {
    createAppWindow();
    Loginwin.hide();
})

ipcMain.on('unmaximize-app', (event) => {
    mainwin.setSize(800, 500);
    mainwin.center();
})

ipcMain.on('close-app', (event) => {
    if (mainwin != null) mainwin.close();
    Loginwin.close();
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