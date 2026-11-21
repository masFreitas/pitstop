import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { LogoutButton } from "./BotaoSair";

export async function HeaderActions() {
    const user = await getSessionUser();

    if (!user) {
        return (
            <div className="flex items-center gap-3">
                <Link
                    href="/login"
                    className="rounded-xl border-2 border-gray-900 px-4 py-2 text-sm font-bold uppercase text-gray-900 hover:bg-gray-900 hover:text-white"
                >
                    Entrar
                </Link>
                <Link
                    href="/cadastro"
                    className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold uppercase text-white hover:bg-green-700"
                >
                    Criar Conta
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-900">
                Olá, <strong className="font-bold">{user.username}</strong>
            </span>
            <Link
                href="/cadastrar-veiculo"
                className="bg-gray-900 text-white px-4 py-2 text-sm font-bold uppercase rounded-xl hover:bg-green-700"
            >
                Cadastrar Veículo
            </Link>
            <LogoutButton />
        </div>
    );
}
