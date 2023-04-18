import chalk from "chalk";
import { env, exit } from "node:process";

export default (expectedEnv) => {
	// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
	if (!expectedEnv) throw new Error('"expectedEnv" not set');

	if (env.NODE_ENV !== expectedEnv) {
		console.log(
			chalk.whiteBright.bgRed.bold(
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				`"process.env.NODE_ENV" must be "${expectedEnv}" to use this webpack config`
			)
		);
		exit(2);
	}
};
