import type { BrowserWindow, MenuItemConstructorOptions } from "electron";
import { Menu, app, shell } from "electron";
import { env, platform } from "node:process";
import printError from "./printError";
import resolveHtmlPath from "./resolvePath";

type DarwinMenuItemConstructorOptions = MenuItemConstructorOptions & {
	selector?: string;
	submenu?: DarwinMenuItemConstructorOptions[] | Menu;
};

export default class MenuBuilder {
	window: BrowserWindow;

	constructor(mainWindow: BrowserWindow) {
		this.window = mainWindow;
	}

	buildMenu(): Menu {
		if (env.NODE_ENV === "development" || env.DEBUG_PROD === "true")
			this.setupDevEnvironment();
		const menu =
			platform === "darwin" ? this.buildDarwin() : this.buildDefault();

		Menu.setApplicationMenu(menu);
		return menu;
	}

	setupDevEnvironment(): void {
		this.window.webContents.on("context-menu", (_, props) => {
			Menu.buildFromTemplate([
				{
					label: "Inspect element",
					click: () => {
						this.window.webContents.inspectElement(props.x, props.y);
					},
				},
			]).popup({ window: this.window });
		});
	}

	buildDarwin() {
		const subMenuAbout: DarwinMenuItemConstructorOptions = {
			label: "Electron",
			submenu: [
				{
					label: "About ElectronReact",
				},
				{ type: "separator" },
				{ label: "Services", submenu: [] },
				{ type: "separator" },
				{
					label: "Hide ElectronReact",
					// accelerator: "Command+H",
				},
				{
					label: "Hide Others",
					// accelerator: "Command+Shift+H",
				},
				{ label: "Show All" },
				{ type: "separator" },
				{
					label: "Quit",
					// accelerator: "Command+Q",
					click: () => {
						app.quit();
					},
				},
			],
		};
		const subMenuEdit: DarwinMenuItemConstructorOptions = {
			label: "Edit",
			submenu: [
				{ label: "Undo", accelerator: "Command+Z" },
				{ label: "Redo", accelerator: "Shift+Command+Z" },
				{ type: "separator" },
				{ label: "Cut", accelerator: "Command+X" },
				{ label: "Copy", accelerator: "Command+C" },
				{ label: "Paste", accelerator: "Command+V" },
				{
					label: "Select All",
					accelerator: "Command+A",
				},
			],
		};
		const subMenuViewDev: MenuItemConstructorOptions = {
			label: "View",
			submenu: [
				{
					label: "Reload",
					accelerator: "Command+R",
					click: () => {
						this.window.webContents.reload();
					},
				},
				{
					label: "Toggle Full Screen",
					accelerator: "Ctrl+Command+F",
					click: () => {
						this.window.setFullScreen(!this.window.isFullScreen());
					},
				},
				{
					label: "Toggle Developer Tools",
					accelerator: "Alt+Command+I",
					click: () => {
						this.window.webContents.toggleDevTools();
					},
				},
			],
		};
		const subMenuViewProd: MenuItemConstructorOptions = {
			label: "View",
			submenu: [
				{
					label: "Toggle Full Screen",
					accelerator: "Ctrl+Command+F",
					click: () => {
						this.window.setFullScreen(!this.window.isFullScreen());
					},
				},
			],
		};
		const subMenuWindow: DarwinMenuItemConstructorOptions = {
			label: "Window",
			submenu: [
				{
					label: "Minimize",
					accelerator: "Command+M",
				},
				{ label: "Close", accelerator: "Command+W" },
				{ type: "separator" },
				{ label: "Bring All to Front" },
			],
		};
		const subMenuHelp: MenuItemConstructorOptions = {
			label: "Help",
			submenu: [
				{
					label: "Learn More",
					click() {
						return shell.openExternal("https://electronjs.org");
					},
				},
				{
					label: "Documentation",
					click() {
						return shell.openExternal(
							"https://github.com/electron/electron/tree/main/docs#readme"
						);
					},
				},
				{
					label: "Community Discussions",
					click() {
						return shell.openExternal("https://www.electronjs.org/community");
					},
				},
				{
					label: "Search Issues",
					click() {
						return shell.openExternal(
							"https://github.com/electron/electron/issues"
						);
					},
				},
			],
		};
		const subMenuView =
			env.NODE_ENV === "development" || env.DEBUG_PROD === "true"
				? subMenuViewDev
				: subMenuViewProd;

		return Menu.buildFromTemplate([
			subMenuAbout,
			subMenuEdit,
			subMenuView,
			subMenuWindow,
			subMenuHelp,
		]);
	}

	buildDefault() {
		const menu = Menu.buildFromTemplate([
			{
				label: "Did&Up",
				submenu: [
					{
						label: "&Dashboard",
						accelerator: "Alt+D",
						click: () => {
							this.window
								.loadURL(resolveHtmlPath({ hash: "/dashboard" }))
								.catch(printError);
						},
						id: "dashboard",
					},
					{
						label: "&Profilo",
						accelerator: "Alt+P",
						click: () => {
							this.window
								.loadURL(resolveHtmlPath({ hash: "/profiles" }))
								.catch(printError);
						},
						id: "profile",
					},
				],
			},
			{
				label: "&Navigazione",
				submenu: [
					{
						label: "&Ricarica",
						accelerator: "Ctrl+R",
						role: "reload",
					},
					{
						label: "&Indietro",
						accelerator: "Alt+Left",
						click: () => {
							this.window.webContents.goBack();
						},
						id: "back",
					},
					{
						label: "&Avanti",
						accelerator: "Alt+Right",
						click: () => {
							this.window.webContents.goForward();
						},
						id: "forward",
					},
				],
			},
			{
				label: "&Finestra",
				submenu: [
					{
						label: "Schermo &intero",
						accelerator: "F11",
						click: () => {
							this.window.setFullScreen(!this.window.isFullScreen());
						},
					},
					{
						label: "&Strumenti per sviluppatori",
						accelerator: "Ctrl+Shift+I",
						role: "toggleDevTools",
					},
					{
						label: "&Esci",
						accelerator: "Alt+F4",
						role: "quit",
					},
				],
			},
		]);
		const back = menu.getMenuItemById("back")!;
		const forward = menu.getMenuItemById("forward")!;
		const dashboard = menu.getMenuItemById("dashboard")!;
		const profile = menu.getMenuItemById("profile")!;

		this.window.webContents.on("did-navigate-in-page", () => {
			const url = this.window.webContents.getURL();

			back.enabled = this.window.webContents.canGoBack();
			forward.enabled = this.window.webContents.canGoForward();
			dashboard.enabled = !url.endsWith("/dashboard");
			profile.enabled = !url.endsWith("/profiles");
		});
		return menu;
	}
}
