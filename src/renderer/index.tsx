import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
window.electron.on("write", (name, value, nonce) => {
	localStorage.setItem(name, value);
	window.electron.send("write", nonce);
});
