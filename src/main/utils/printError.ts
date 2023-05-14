const printError = (err: unknown) => {
	if (err instanceof Error) Error.captureStackTrace(err, printError);
	else if (typeof err === "string") err = new Error(err);
	else err = new Error("An unknown error occurred", { cause: err });
	console.error(err);
};

export default printError;
