import { REPLACE_ME_WITH_D1_DB, TEMPORARY_TOKENS } from "../../example_database";

interface Env {
    API_HOST: string;
}

function getCookie(cookies: string | null, cname: string) {
    if (!cookies) return "";
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(cookies);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const cookieString = context.request.headers.get("Cookie");
    const token = getCookie(cookieString, 'token');
    if (token) {
        const userEmail = TEMPORARY_TOKENS[token];
        if (userEmail) {
            const user = REPLACE_ME_WITH_D1_DB[userEmail];
            if (user) {
                return Response.json({
                    message: "Your Priavte Todo List:",
                    success: true,
                    todo_list: user.todo_list
                });
            }
        }
    }
    return Response.json({
        message: "Invalid Token!",
        success: false
    });
};
