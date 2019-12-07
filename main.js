const {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
    screen
} = require('electron')

var mainwin, Loginwin;

const {
    remote
} = require('electron')

app.setPath('userData', app.getPath('home') + '/OneDrive/GameKey')

function createAppWindow() {
    mainwin = new BrowserWindow({
        minWidth: 800,
        minHeight: 600,
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
        maxWidth: 950,
        maxHeight: 700,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    Loginwin.loadURL('file://' + __dirname + '/Login.html')
}



app.on('ready', createLoginWindow)

ipcMain.on('minimize-app', () => {
    if (mainwin != null)
        mainwin.minimize();
    else Loginwin.minimize();
})

ipcMain.on('access-app', () => {
    createAppWindow();
    Loginwin.hide();
})

ipcMain.on('maximize-app', () => {
    var win = remote.getCurrentWindow();
    win.isMaximized() ? win.unmaximize() : win.maximize();
})

ipcMain.on('close-app', () => {
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