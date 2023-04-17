import chalk from "chalk";
import detectPort from "detect-port";
import { env, exit } from "node:process";

const port = env.PORT ?? "1212";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
detectPort(port, (err, availablePort) => {
	if (port !== String(availablePort))
		throw new Error(
			chalk.whiteBright.bgRed.bold(
				`Port "${port}" on "localhost" is already in use. Please use another port. ex: PORT=4343 npm start`
			)
		);
	else exit(0);
});
