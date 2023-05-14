import type { ElectronHandler } from "main/preload";

declare global {
	interface Window {
		app: ElectronHandler;
	}
}

export {};
