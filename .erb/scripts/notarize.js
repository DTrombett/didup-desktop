const { notarize } = require("@electron/notarize");
const { env } = require("node:process");
const { build } = require("../../package.json");

exports.default = async function notarizeMacos(context) {
	const { electronPlatformName, appOutDir } = context;
	if (electronPlatformName !== "darwin") return;

	if (env.CI !== "true") {
		console.warn("Skipping notarizing step. Packaging is not running in CI");
		return;
	}

	if (!("APPLE_ID" in env && "APPLE_ID_PASS" in env)) {
		console.warn(
			"Skipping notarizing step. APPLE_ID and APPLE_ID_PASS env variables must be set"
		);
		return;
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const appName = context.packager.appInfo.productFilename;

	await notarize({
		appBundleId: build.appId,
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		appPath: `${appOutDir}/${appName}.app`,
		appleId: env.APPLE_ID,
		appleIdPassword: env.APPLE_ID_PASS,
	});
};
