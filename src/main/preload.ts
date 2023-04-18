import type { IpcRendererEvent } from "electron";
import { contextBridge, ipcRenderer } from "electron";

type OnCallback = Parameters<Electron.IpcRenderer["on"]>[1];
export type Args = {
	ping: [message: string];
};

const electronHandler = {
	ipcRenderer: {
		sendMessage<T extends keyof Args>(channel: T, ...args: Args[T]) {
			ipcRenderer.send(channel, ...args);
		},
		on<T extends keyof Args>(channel: T, func: (...args: Args[T]) => void) {
			const subscription = (_event: IpcRendererEvent, ...args: Args[T]) => {
				func(...args);
			};

			ipcRenderer.on(channel, subscription as OnCallback);

			return () => {
				ipcRenderer.removeListener(channel, subscription as OnCallback);
			};
		},
		once<T extends keyof Args>(channel: T, func: (...args: Args[T]) => void) {
			ipcRenderer.once(channel, ((_event, ...args: Args[T]) => {
				func(...args);
			}) as OnCallback);
		},
	},
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
