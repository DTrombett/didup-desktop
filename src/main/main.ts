import { BrowserWindow, app, ipcMain, shell } from "electron";
import install, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
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
import MenuBuilder from "./utils/menu";
import printError from "./utils/printError";
import resolvePath from "./utils/resolvePath";

Error.stackTraceLimit = Infinity;
if (!app.requestSingleInstanceLock()) {
	app.quit();
	exit();
}
let res: () => void;
let win: BrowserWindow | null = null;
let urlData: LoginLink | undefined;
const promise = new Promise<void>((_resolve) => {
	res = _resolve;
});
const protocol = "it.argosoft.didup.famiglia.new";
const debug = env.NODE_ENV === "development" || env.DEBUG_PROD === "true";
const client = new Client({
	debug,
	dataProvider: {
		read: async (name: string) => {
			if (!win) return undefined;
			const text: string | null = await win.webContents.executeJavaScript(
				`localStorage.getItem("${name}")`
			);

			if (text == null) return undefined;
			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return JSON.parse(text);
			} catch (err) {
				printError(err);
				return undefined;
			}
		},
		write: async (name, data) => {
			if (!win) return undefined;
			const nonce = Math.random();

			win.webContents.send("write", name, JSON.stringify(data), nonce);
			return new Promise((_resolve) => {
				const listener: (
					event: Electron.IpcMainEvent,
					...args: any[]
				) => void = (_event, n) => {
					if (n === nonce) {
						ipcMain.removeListener("write", listener);
						_resolve();
					}
				};

				ipcMain.on("write", listener);
			});
		},
		reset: async () => {
			if (!win) return undefined;
			return win.webContents.executeJavaScript("localStorage.clear()");
		},
	},
});
const createWindow = async () => {
	win = new BrowserWindow({
		autoHideMenuBar: true,
		backgroundColor: "#202020",
		icon: join(
			app.isPackaged
				? join(resourcesPath, "assets")
				: join(__dirname, "../../assets"),
			"icon.ico"
		),
		minHeight: 500,
		minWidth: 500,
		opacity: 0.99,
		show: false,
		webPreferences: {
			preload: app.isPackaged
				? join(__dirname, "preload.js")
				: join(__dirname, "../../.erb/dll/preload.js"),
		},
		title: "DidUp Desktop",
	});
	void win.loadURL(resolvePath("")).then(res);
	new MenuBuilder(win).buildMenu();
	win.maximize();
	win.once("ready-to-show", async () => {
		await promise;
		if (!win) throw new Error('"mainWindow" is not defined');
		win.show();
		win.focus();
	});
	win.once("closed", () => {
		win = null;
	});
	win.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url).catch(printError);
		return { action: "deny" };
	});
	win.webContents.once("dom-ready", () => {
		if (debug) {
			install([REACT_DEVELOPER_TOOLS], { forceDownload: true }).catch(
				printError
			);
			win?.webContents.openDevTools();
		}
	});
};

app.once("window-all-closed", () => {
	// _Do not_ respect the OSX convention of having the application in memory even after all windows have been closed
	app.quit();
});
app.on("second-instance", async (_, commandLine) => {
	if (!win) return;
	console.log(commandLine);
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
			}).catch(printError);
			const error = await client
				.login()
				.then(() => "")
				.catch((err) => {
					console.log(err);
					if (typeof err === "string") return err;
					if (err instanceof Error) return err.message;
					return "Errore sconosciuto";
				});

			win
				.loadURL(resolvePath(error ? `login?error=${error}` : "profiles"))
				.catch(printError);
		}
	}
});

ipcMain.handle("client", (_event, ...keys: (keyof Client)[]) =>
	Object.fromEntries(keys.map((k) => [k, client[k]]))
);
ipcMain.on("login", () => {
	urlData = generateLoginLink();
	shell.openExternal(urlData.url).catch(printError);
});
ipcMain.on("log", (_event, ...args) => {
	console.log(...args);
});
ipcMain.handle(
	"invokeClientMethod",
	<
		T extends Extract<
			{
				[K in keyof Client]: Client[K] extends (...args: any[]) => any
					? K
					: never;
			}[keyof Client],
			keyof Client
		>
	>(
		_event: unknown,
		key: T,
		pass: boolean,
		...args: Parameters<Client[T]>
	) => {
		const result = (
			client[key] as (...params: Parameters<Client[T]>) => unknown
		)(...args);

		return pass ? result : undefined;
	}
);

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

void app.whenReady().then(createWindow);
