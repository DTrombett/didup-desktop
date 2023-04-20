import { BrowserWindow, app, ipcMain } from "electron";
import { join, resolve } from "node:path";
import {
	argv,
	defaultApp,
	env,
	execPath,
	exit,
	resourcesPath,
} from "node:process";
import { URL } from "node:url";
import type { LoginLink } from "portaleargo-api";
import { Client, generateLoginLink, getToken } from "portaleargo-api";
import installExtensions from "./utils/installExtensions";
import MenuBuilder from "./utils/menu";
import prepareClient from "./utils/prepareClient";
import resolveHtmlPath from "./utils/resolveHtmlPath";

if (!app.requestSingleInstanceLock()) {
	app.quit();
	exit();
}
let urlData: LoginLink | undefined;
let win: BrowserWindow | null = null;
const protocol = "it.argosoft.didup.famiglia.new";
const isDebug = env.NODE_ENV === "development" || env.DEBUG_PROD === "true";
const client = new Client({
	debug: true,
	dataPath: join(app.getPath("userData"), "argo"),
});
const createWindow = async () => {
	if (isDebug) await installExtensions();
	win = new BrowserWindow({
		show: false,
		autoHideMenuBar: true,
		// opacity: 0.9,
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
		minWidth: 600,
		minHeight: 600,
	});
	win.loadURL(resolveHtmlPath("")).catch(console.error);
	prepareClient(client, win).catch(console.error);
	win.maximize();
	win.focus();
	win.on("ready-to-show", () => {
		if (!win) throw new Error('"mainWindow" is not defined');
		win.show();
	});
	win.on("closed", () => {
		win = null;
	});
	win.webContents.on("before-input-event", (event, input) => {
		if (!win) return;
		if (input.alt)
			if (input.key === "ArrowLeft") {
				if (new URL(win.webContents.getURL()).pathname !== "/login") {
					win.webContents.goBack();
					event.preventDefault();
				}
			} else if (input.key === "ArrowRight") {
				win.webContents.goForward();
				event.preventDefault();
			}
	});
	new MenuBuilder(win).buildMenu();
};

app.on("window-all-closed", () => {
	// _Do not_ respect the OSX convention of having the application in memory even
	// after all windows have been closed
	app.quit();
});
app.on("second-instance", async (_, commandLine) => {
	if (!win) return;
	if (win.isMinimized()) win.restore();
	win.focus();
	const url = new URL(commandLine.at(-1)!);

	if (
		url.hostname === "login-callback" &&
		url.searchParams.get("state") === urlData?.state
	) {
		const code = url.searchParams.get("code");

		if (code != null) {
			await getToken(client, {
				codeVerifier: urlData.codeVerifier,
				code,
			}).catch(console.error);
			await client.login();
			win.loadURL(resolveHtmlPath("login")).catch(console.error);
			win.webContents.clearHistory();
		}
	}
});

ipcMain.handle("client", (_event, key?: keyof Client) =>
	key ? client[key] : client
);
ipcMain.on("login", () => {
	urlData = generateLoginLink();
	win?.loadURL(urlData.url).catch(console.error);
});
ipcMain.on("log", (_event, ...args) => {
	console.log(...args);
});

if (env.NODE_ENV === "production")
	(
		require("source-map-support") as {
			install(): void;
		}
	).install();
if (isDebug) (require("electron-debug") as () => void)();
if (defaultApp) {
	if (argv.length >= 2)
		app.setAsDefaultProtocolClient(protocol, execPath, [
			"-r",
			join(
				__dirname,
				"../..",
				"node_modules",
				"ts-node/register/transpile-only"
			),
			resolve("."),
		]);
} else app.setAsDefaultProtocolClient(protocol);

app.whenReady().then(createWindow).catch(console.error);
