// Copyright (C) 2017 Ford Peprah

const {BrowserWindow, app} = require('electron');

const api = require('./api');
const getPort = require('get-port');
const menu = require('./menu');
const path = require('path');

var mainWindow = null;

/**
 * Called after all windows have been closed.
 *
 * @returns {undefined}
 */
function unready() {
    mainWindow = null;
    app.quit();
    api.server.close();
    return null;
}

/**
 * Called when Electon is ready to launch a window.
 *
 * @returns {undefined}
 */
function ready() {
    // Create the main window.
    var window = new BrowserWindow({
        // Title of the window.  Only applies to Windows/Linux.
        title: 'Gungi',

        // Initial width and height of the window.
        width: 1280,
        height: 768,

        // Minimum dimensions of the window.
        minWidth: 1280,
        minHeight: 768,

        // Title-bar style only applies to Mac.  Sets the buttons to be inset
        // into the window page.
        titleBarStyle: 'hidden-inset',

        // Set the icon displayed in the Window.  This does not apply to Mac.
        icon: 'static/images/gungi.ico',

        webPreferences: {
            // Allow the embedded Javascript to access the node plugins.
            nodeIntegration: true,
            // Enable web GL to allow building 3D applications.
            webgl: true,
            // Disable web security in order to load local resources.
            webSecurity: true
        },

        // Set the background colour of the window.
        backgroundColor: '',

        // Immediately show the window.
        show: true
    });

    /**
     * Shows the window when the 'ready-to-show' event is fired by Electron.
     *
     * @returns {undefined}
     */
    window.on('ready-to-show', () => {
        window.show();
    });

    /**
     * Error handler for when the window fails to render.
     *
     * @returns {undefined}
     */
    window.on('error', () => {
        app.quit();
        api.server.close();
    });

    /**
     * Handler for when the window is closed.
     *
     * @returns {undefined}
     */
    window.on('close', () => {
        app.quit();
        api.server.close();
    });

    getPort({ port: 3000 }).then((port) => {
        console.log('Listening on port:', port);
        api.server.listen(port);

        window.loadURL('file://' + __dirname + '/index.html?port=' + port);
        menu.bind(app);

        mainWindow = window;
    });

    return window;
}

app.on('window-all-closed', unready);
app.on('ready', ready);
