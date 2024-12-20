interface Env {
	API_HOST: string;
}

const REPLACE_ME_WITH_D1_DB: {
	[key: string]: {
		pass: string
	}
} = {
	"admin@example.com": {
		pass: "1234!!##$$"
	}
}

const TEMPORARY_TOKENS: {
	[key: string]: string
} = {};

function generateToken(n: number) {
	var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var token = '';
	for (var i = 0; i < n; i++) {
		token += chars[Math.floor(Math.random() * chars.length)];
	}
	return token;
}

export const onRequest: PagesFunction<Env> = async (context) => {
	const cookieString = context.request.headers.get("Cookie");
	console.log("cookies to parse:", cookieString);

	if (context.request.method === "POST") {
		const contentType = context.request.headers.get("content-type");
		if (contentType?.includes("application/json")) {
			const body = await context.request.json() as {
				email: string;
				password: string;
			};
			// TODO Add more server validations
			if (!body.email || !body.password) {
				return Response.json({
					message: "Email or password is missing!",
					success: false
				});
			}
			// TODO Optimize code and convert to D1 database
			if (REPLACE_ME_WITH_D1_DB[body.email]?.pass === body.password) {
				const response = Response.json({
					message: "Successfully Logged In!",
					success: true
				})
				const newToken = generateToken(128);
				TEMPORARY_TOKENS[body.email] = newToken;
				response.headers.set("Set-Cookie", `token=${newToken}; path=/; secure; HttpOnly; SameSite=Strict`);
				response.headers.set("Set-Cookie", `auth=true; path=/; secure; SameSite=Strict`);
				return response;
			} else {
				return Response.json({
					message: "Invalid Credentials!",
					success: false
				});
			}
		}
	}
	return Response.json({
		message: "Invalid request",
		success: false
	});
};

/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
async function readRequestBody(request: Request) {
	const contentType = request.headers.get("content-type");
	if (contentType?.includes("application/json")) {
		return JSON.stringify(await request.json());
	} else if (contentType?.includes("application/text")) {
		return request.text();
	} else if (contentType?.includes("text/html")) {
		return request.text();
	} else if (contentType?.includes("form")) {
		const formData = await request.formData();
		const body: { [key: string]: FormDataEntryValue } = {};
		for (const entry of formData.entries()) {
			body[entry[0]] = entry[1];
		}
		return JSON.stringify(body);
	} else {
		// Perhaps some other type of data was submitted in the form
		// like an image, or some other binary data.
		return "a file";
	}
}
