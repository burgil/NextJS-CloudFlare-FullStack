interface Env {
	API_HOST: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const response = Response.json({
        success: true
    })
    response.headers.append("Set-Cookie", `token=; path=/; secure; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
    response.headers.append("Set-Cookie", `auth=false; path=/; secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
    return response;
};
