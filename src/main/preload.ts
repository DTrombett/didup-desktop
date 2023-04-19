import { contextBridge, ipcRenderer } from "electron";
import type { Profilo } from "portaleargo-api";

type CallbackArgs<A = [], B = []> = [A, B];
type Args = {
	ping: CallbackArgs<[message: string], [message: string]>;
	login: CallbackArgs;
};
type Invoke = {
	getProfiles: CallbackArgs<[], Profilo[]>;
};

const electronHandler = {
	ipcRenderer: {
		send<T extends keyof Args>(channel: T, ...args: Args[T][0]) {
			ipcRenderer.send(channel, ...args);
		},
		on<T extends keyof Args>(channel: T, func: (...args: Args[T][1]) => void) {
			ipcRenderer.on(channel, (_event, ...args: any) => {
				func(...args);
			});
		},
		once<T extends keyof Args>(
			channel: T,
			func: (...args: Args[T][1]) => void
		) {
			ipcRenderer.once(channel, (_event, ...args: any) => {
				func(...args);
			});
		},
		removeAllListeners<T extends keyof Args>(channel: T) {
			ipcRenderer.removeAllListeners(channel);
		},
		invoke<T extends keyof Invoke>(channel: T, ...args: Invoke[T][0]) {
			return ipcRenderer.invoke(channel, ...args) as Promise<Invoke[T][1]>;
		},
	},
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
