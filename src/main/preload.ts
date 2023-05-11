import { contextBridge, ipcRenderer } from "electron";
import type { Client } from "portaleargo-api";

type CallbackArgs<A = [], B = []> = [A, B];
type Args = {
	ping: CallbackArgs<[message: string], [message: string]>;
	login: CallbackArgs;
	write: CallbackArgs<
		[nonce: number],
		[name: string, value: string, nonce: number]
	>;
};

const electron = {
	send<T extends keyof Args>(channel: T, ...args: Args[T][0]) {
		ipcRenderer.send(channel, ...args);
	},
	on<T extends keyof Args>(channel: T, func: (...args: Args[T][1]) => void) {
		ipcRenderer.on(channel, (_event, ...args: any) => {
			func(...args);
		});
	},
	once<T extends keyof Args>(channel: T, func: (...args: Args[T][1]) => void) {
		ipcRenderer.once(channel, (_event, ...args: any) => {
			func(...args);
		});
	},
	removeAllListeners<T extends keyof Args>(channel: T) {
		ipcRenderer.removeAllListeners(channel);
	},
	getClient<T extends keyof Client>(...keys: T[] & [T]) {
		return ipcRenderer.invoke("client", ...keys) as Promise<Pick<Client, T>>;
	},
	log(this: void, ...args: unknown[]) {
		ipcRenderer.send("log", ...args);
	},
	invokeClientMethod<
		T extends Extract<
			{
				[K in keyof Client]: Client[K] extends (...args: any[]) => any
					? K
					: never;
			}[keyof Client],
			keyof Client
		>
	>(key: T, pass = true, ...args: Parameters<Client[T]>) {
		return ipcRenderer.invoke(
			"invokeClientMethod",
			key,
			pass,
			...args
		) as Promise<Awaited<ReturnType<Client[T]>>>;
	},
};

contextBridge.exposeInMainWorld("electron", electron);

export type ElectronHandler = typeof electron;
