const {
    app,
    BrowserWindow
} = require('electron')

function createWindow() {
    let win = new BrowserWindow({
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