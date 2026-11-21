"use client";

import { useState } from "react";
import { logout } from "@/app/auth-actions";

export function LogoutButton() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    async function handleLogout() {
        setIsLoggingOut(true);
        await logout();
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-xl border-2 border-gray-900 px-4 py-2 text-sm font-bold uppercase text-gray-900 transition hover:cursor-pointer hover:bg-red-600 hover:border-red-600 hover:text-white disabled:opacity-50"
        >
            {isLoggingOut ? "Saindo..." : "Sair"}
        </button>
    );
}
