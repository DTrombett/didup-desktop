import { BrowserWindow, app, ipcMain, shell } from "electron";
import { join, resolve } from "node:path";
import process, {
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
const mainUrl = new URL(
	app.isPackaged
		? `file://${resolve(__dirname, "../renderer/index.html")}`
		: `http://localhost:${env.PORT ?? 1212}/index.html`
);
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
			const nonce = Math.random();

			win.webContents.send("reset", nonce);
			return new Promise((_resolve) => {
				const listener: (
					event: Electron.IpcMainEvent,
					...args: any[]
				) => void = (_event, n) => {
					if (n === nonce) {
						ipcMain.removeListener("reset", listener);
						_resolve();
					}
				};

				ipcMain.on("reset", listener);
			});
		},
	},
});
const createWindow = async () => {
	win = new BrowserWindow({
		autoHideMenuBar: true,
		backgroundColor: "#282828",
		icon: join(
			app.isPackaged
				? join(resourcesPath, "assets")
				: join(__dirname, "../../assets"),
			"icon.ico"
		),
		minHeight: 500,
		minWidth: 500,
		opacity: app.isPackaged ? 0.999 : 0.99,
		show: false,
		webPreferences: {
			preload: app.isPackaged
				? join(__dirname, "preload.js")
				: join(__dirname, "../../.erb/dll/preload.js"),
		},
		title: "DidUp Desktop",
	});
	void win.loadURL(resolvePath()).then(res);
	new MenuBuilder(win).buildMenu();
	win.maximize();
	win.once("ready-to-show", async () => {
		await promise;
		if (!win) throw new Error('"mainWindow" is not defined');
		win.show();
	});
	win.once("closed", () => {
		win = null;
	});
	win.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url).catch(printError);
		return { action: "deny" };
	});
	win.webContents.on("will-navigate", (event, input) => {
		if (event.isSameDocument) return;
		const url = new URL(input);

		if (url.origin !== mainUrl.origin || url.pathname !== mainUrl.pathname)
			event.preventDefault();
	});
	win.webContents.on("console-message", (_event, _level, message) => {
		console.log(message);
	});
};
const listener = (err: Error): void => {
	printError(err);
};

process.on("uncaughtException", listener);
process.on("unhandledRejection", listener);
process.on("warning", listener);

app.once("window-all-closed", () => {
	// _Do not_ respect the OSX convention of having the application in memory even after all windows have been closed
	app.quit();
});
app.on("second-instance", async (_, commandLine) => {
	if (!win) return;
	const url = new URL(commandLine.at(-1)!);

	if (
		url.hostname === "login-callback" &&
		url.searchParams.get("state") === urlData?.state
	) {
		const code = url.searchParams.get("code");

		if (code != null) {
			win.webContents.send("login");
			await getToken(client, {
				codeVerifier: urlData.codeVerifier,
				code,
			}).catch((err) => {
				win?.webContents.send("login", err);
				printError(err);
			});
		}
	}
	if (win.isMinimized()) win.restore();
	win.focus();
});

ipcMain.on("login", (event) => {
	urlData = generateLoginLink();
	shell
		.openExternal(urlData.url)
		.then(() => {
			event.sender.send("login");
		})
		.catch((err) => {
			event.sender.send("login", err);
			printError(err);
		});
});
ipcMain.handle(
	"invokeClientMethod",
	<
		T extends keyof {
			[K in keyof Client as Client[K] extends (...args: any[]) => any
				? K
				: never]: K;
		}
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

if (app.isPackaged)
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
