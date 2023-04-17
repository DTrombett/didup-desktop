/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { BrowserWindow, app, ipcMain, shell } from "electron";
import { join } from "node:path";
import { env, platform, resourcesPath } from "node:process";
import MenuBuilder from "./menu";
import { resolveHtmlPath } from "./util";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
let mainWindow: BrowserWindow | null = null;

ipcMain.on("ipc-example", async (event, arg) => {
	const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
	console.log(msgTemplate(arg));
	event.reply("ipc-example", msgTemplate("pong"));
});
if (env.NODE_ENV === "production")
	(
		require("source-map-support") as {
			install(): void;
		}
	).install();
const isDebug = env.NODE_ENV === "development" || env.DEBUG_PROD === "true";

if (isDebug) (require("electron-debug") as () => void)();
const installExtensions = async () => {
	const installer: Record<string, string> & {
		default: (extensions: string[], forceDownload: boolean) => Promise<void>;
	} = require("electron-devtools-installer");

	return installer
		.default(
			["REACT_DEVELOPER_TOOLS"].map((name) => installer[name]),
			!!env.UPGRADE_EXTENSIONS!
		)
		.catch(console.log);
};
const createWindow = async () => {
	if (isDebug) await installExtensions();
	mainWindow = new BrowserWindow({
		show: false,
		width: 1024,
		height: 728,
		icon: join(
			app.isPackaged
				? join(resourcesPath, "assets")
				: join(__dirname, "../../assets"),
			"icon.png"
		),
		webPreferences: {
			preload: app.isPackaged
				? join(__dirname, "preload.js")
				: join(__dirname, "../../.erb/dll/preload.js"),
		},
	});
	mainWindow.loadURL(resolveHtmlPath("index.html")).catch(console.error);
	mainWindow.on("ready-to-show", () => {
		if (!mainWindow) throw new Error('"mainWindow" is not defined');

		if (env.START_MINIMIZED!) mainWindow.minimize();
		else mainWindow.show();
	});
	mainWindow.on("closed", () => {
		mainWindow = null;
	});
	new MenuBuilder(mainWindow).buildMenu();
	// Open urls in the user's browser
	mainWindow.webContents.setWindowOpenHandler((edata) => {
		shell.openExternal(edata.url).catch(console.error);
		return { action: "deny" };
	});
};
/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed
	if (platform !== "darwin") app.quit();
});
app
	.whenReady()
	.then(() => {
		app.on("activate", () => {
			// On macOS it's common to re-create a window in the app when the
			// dock icon is clicked and there are no other windows open.
			if (mainWindow === null) void createWindow();
		});
		return createWindow();
	})
	.catch(console.error);
