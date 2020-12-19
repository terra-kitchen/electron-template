"use strict"

import { app, BrowserWindow } from "electron"
import * as path from "path"
import { format as formatUrl } from "url"

const isDevelopment = process.env.NODE_ENV !== "production"

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let main

function createMainWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 320,
    minHeight: 480,
    titleBarStyle: "hidden",
    webPreferences: { nodeIntegration: true },
  })

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

  const url = isDevelopment
    ? `http://localhost:${process.env.PORT || "3000"}`
    : "https://terra.kitchen"

  window.removeMenu()
  window.loadURL(url)
  window.on("closed", () => (main = null))

  window.webContents.on("devtools-opened", () => {
    window.focus()
    setImmediate(() => window.focus())
  })

  return window
}

// quit application when all windows are closed
// on macOS it is common for applications to stay open until the user explicitly quits
app.on("window-all-closed", () => process.platform !== "darwin" && app.quit())

// on macOS it is common to re-create a window even after all windows have been closed
app.on("activate", () => main === null && (main = createMainWindow()))

// create main BrowserWindow when electron is ready
app.on("ready", () => (main = createMainWindow()))
