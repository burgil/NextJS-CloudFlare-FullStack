interface Env {
	API_HOST: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
	return new Response(`Hello from backend! TODO Login Route! - API host: ${context.env.API_HOST}`);
};
