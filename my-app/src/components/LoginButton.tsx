"use client"

export default function LoginButton() {

    async function handleLogin() {
        try {
            const response = await fetch("/api/test")
            const data = await response.text();
            alert(data)
        } catch (e) {
            console.log("Failed to login!", e);
            alert("Failed to login! Check the console...");
        }
    }

    return (
        <button onClick={handleLogin} className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44">
            Test Login API
        </button>
    )
}