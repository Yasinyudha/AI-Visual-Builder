import { app, BrowserWindow, dialog, ipcMain, Menu } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';

// Register native folder selector dialog
ipcMain.handle('select-workspace', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'], // Forces folder selection mode
        title: 'Select Workspace Folder',
    });

    if (result.canceled || result.filePaths.length === 0) {
        return null;
    }

    return result.filePaths[0]; // Returns absolute folder path
});

let pythonProcess: ChildProcess | null = null;

// Function to start Python FastAPI backend automatically
function startPythonBackend() {
    pythonProcess = spawn('python3', [
        path.join(__dirname, '../../backend/server.py'),
    ]);

    pythonProcess.stdout?.on('data', (data) => {
        console.log(`Python: ${data}`);
    });

    pythonProcess.stderr?.on('data', (data) => {
        console.error(`Python Error: ${data}`);
    });
}

// Function to create the main Electron window
function createWindow() {
    Menu.setApplicationMenu(null);

    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173');
    } else {
        win.loadFile(path.join(__dirname, '../renderer/index.html'));
    }
}

// App lifecycle hooks
app.whenReady().then(() => {
    startPythonBackend();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Kill Python process when Electron app closes
app.on('will-quit', () => {
    if (pythonProcess) {
        pythonProcess.kill();
    }
});
