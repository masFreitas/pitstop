"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { register } from "@/app/auth-actions";

export function CadastroForm() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsSubmitting(true);

        let resultado;
        try {
            resultado = await register(username, password, confirmPassword);
        } catch {
            toast.error("Erro inesperado ao criar conta. Tente novamente.");
            setIsSubmitting(false);
            return;
        }

        if (resultado.sucesso) {
            toast.success(resultado.mensagem);
            router.push("/");
            router.refresh();
        } else {
            toast.error(resultado.mensagem);
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-78 p-4">
            <h1 className="text-center font-bold text-xl">Criar Conta</h1>

            <input
                className="border-gray-400 border-2 p-2 rounded-lg"
                type="text"
                placeholder="Usuário"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
            />

            <input
                className="border-gray-400 border-2 p-2 rounded-lg"
                type="password"
                placeholder="Senha (mín. 6 caracteres)"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />

            <input
                className="border-gray-400 border-2 p-2 rounded-lg"
                type="password"
                placeholder="Confirmar senha"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
            />

            <button
                className="bg-gray-900 text-white font-semibold p-2 rounded-lg hover:cursor-pointer hover:bg-green-700 disabled:opacity-50"
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Criando..." : "Criar conta"}
            </button>

            <p className="text-center text-sm text-gray-600">
                Já tem conta?{" "}
                <Link href="/login" className="font-semibold text-gray-900 underline hover:text-green-700">
                    Entrar
                </Link>
            </p>
        </form>
    );
}
