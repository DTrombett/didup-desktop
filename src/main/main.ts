import { BrowserWindow, app, ipcMain, shell } from "electron";
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
let win: BrowserWindow | null = null;
let urlData: LoginLink | undefined;
let loadUrl = resolveHtmlPath("");
const protocol = "it.argosoft.didup.famiglia.new";
const debug = env.NODE_ENV === "development" || env.DEBUG_PROD === "true";
const client = new Client({
	debug,
	dataPath: join(app.getPath("userData"), "argo"),
});
const createWindow = async () => {
	if (debug) void installExtensions();
	win = new BrowserWindow({
		show: false,
		autoHideMenuBar: true,
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
	new MenuBuilder(win).buildMenu();
	win.loadURL(loadUrl).catch(console.error);
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
	win.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url).catch(console.error);
		return { action: "deny" };
	});
};

prepareClient(client)
	.then((url) => {
		if (win) return win.loadURL(url);
		loadUrl = url;
		return undefined;
	})
	.catch(console.error);
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
if (debug) (require("electron-debug") as () => void)();
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
