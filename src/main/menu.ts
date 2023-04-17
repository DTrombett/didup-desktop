import type { BrowserWindow, MenuItemConstructorOptions } from "electron";
import { Menu, app, shell } from "electron";
import { env, platform } from "node:process";

type DarwinMenuItemConstructorOptions = MenuItemConstructorOptions & {
	selector?: string;
	submenu?: DarwinMenuItemConstructorOptions[] | Menu;
};

export default class MenuBuilder {
	mainWindow: BrowserWindow;

	constructor(mainWindow: BrowserWindow) {
		this.mainWindow = mainWindow;
	}

	buildMenu(): Menu {
		if (env.NODE_ENV === "development" || env.DEBUG_PROD === "true")
			this.setupDevelopmentEnvironment();
		const menu = Menu.buildFromTemplate(
			platform === "darwin"
				? this.buildDarwinTemplate()
				: this.buildDefaultTemplate()
		);

		Menu.setApplicationMenu(menu);
		return menu;
	}

	setupDevelopmentEnvironment(): void {
		this.mainWindow.webContents.on("context-menu", (_, props) => {
			Menu.buildFromTemplate([
				{
					label: "Inspect element",
					click: () => {
						this.mainWindow.webContents.inspectElement(props.x, props.y);
					},
				},
			]).popup({ window: this.mainWindow });
		});
	}

	buildDarwinTemplate(): MenuItemConstructorOptions[] {
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
					accelerator: "Command+H",
				},
				{
					label: "Hide Others",
					accelerator: "Command+Shift+H",
				},
				{ label: "Show All" },
				{ type: "separator" },
				{
					label: "Quit",
					accelerator: "Command+Q",
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
						this.mainWindow.webContents.reload();
					},
				},
				{
					label: "Toggle Full Screen",
					accelerator: "Ctrl+Command+F",
					click: () => {
						this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
					},
				},
				{
					label: "Toggle Developer Tools",
					accelerator: "Alt+Command+I",
					click: () => {
						this.mainWindow.webContents.toggleDevTools();
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
						this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
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

		return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
	}

	buildDefaultTemplate() {
		const templateDefault = [
			{
				label: "&File",
				submenu: [
					{
						label: "&Open",
						accelerator: "Ctrl+O",
					},
					{
						label: "&Close",
						accelerator: "Ctrl+W",
						click: () => {
							this.mainWindow.close();
						},
					},
				],
			},
			{
				label: "&View",
				submenu:
					env.NODE_ENV === "development" || env.DEBUG_PROD === "true"
						? [
								{
									label: "&Reload",
									accelerator: "Ctrl+R",
									click: () => {
										this.mainWindow.webContents.reload();
									},
								},
								{
									label: "Toggle &Full Screen",
									accelerator: "F11",
									click: () => {
										this.mainWindow.setFullScreen(
											!this.mainWindow.isFullScreen()
										);
									},
								},
								{
									label: "Toggle &Developer Tools",
									accelerator: "Alt+Ctrl+I",
									click: () => {
										this.mainWindow.webContents.toggleDevTools();
									},
								},
						  ]
						: [
								{
									label: "Toggle &Full Screen",
									accelerator: "F11",
									click: () => {
										this.mainWindow.setFullScreen(
											!this.mainWindow.isFullScreen()
										);
									},
								},
						  ],
			},
			{
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
			},
		];

		return templateDefault;
	}
}
