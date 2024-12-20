"use client"

import { type FormEvent, useState } from "react";

function getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

const isLoggedIn = () => getCookie('auth') === 'true'; // UI Only Boolean! HTTP-Only Token should guard all routes!

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !password) {
            setErrorMessage("Please enter both email and password.");
            return;
        }
        setIsLoading(true);
        setErrorMessage("");
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            if (response.ok) {
                const data = await response.json() as {
                    message: string;
                    success: boolean;
                };
                if (data?.success) {
                    // alert("Login successful!");
                    // location.reload(); // No need to reload
                } else if (data?.message) {
                    setErrorMessage(data.message);
                } else {
                    setErrorMessage("Failed to login, Check the console...");
                    console.error("Failed to login", data);
                }
            } else {
                setErrorMessage("Login failed. Please try again.");
            }
        } catch (e) {
            console.log("Failed to login!", e);
            setErrorMessage("Failed to login! Check the console...");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const response = await fetch("/api/logout");
            if (response.ok) {
                // alert("Logged out successful!");
                // location.reload(); // No need to reload!
            } else {
                alert("Failed to logout!");
            }
        } catch (e) {
            console.log("Failed to logout!", e);
            setErrorMessage("Failed to logout! Check the console...");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoggedIn() ? (
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
                >
                    Logout
                </button>
            ) : (
                <form onSubmit={handleLogin} className="flex flex-col items-center space-y-4 m-auto">
                    <h2 className="text-xl font-semibold">Login</h2>

                    <div className="w-full max-w-xs">
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mt-1 text-black border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="w-full max-w-xs">
                        <label htmlFor="password" className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-1 text-black border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {errorMessage && <div className="text-red-600 text-sm">{errorMessage}</div>}

                    <button
                        type="submit"
                        className="w-full h-12 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
            )}
        </>
    );
}
