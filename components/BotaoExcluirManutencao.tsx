"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { deleteMaintenance } from "@/app/veiculos-crud";

type DeleteMaintenanceButtonProps = {
    maintenanceId: number;
    servicePart: string;
};

export function DeleteMaintenanceButton({maintenanceId, servicePart}: DeleteMaintenanceButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        const confirmed = window.confirm(
            `Deseja realmente excluir a manutenção "${servicePart}"?`
        );

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);
        try {
            const resultado = await deleteMaintenance(maintenanceId);

            if (resultado.sucesso) {
                toast.success(resultado.mensagem);
                router.refresh();
            } else {
                toast.error(resultado.mensagem);
            }
        } catch {
            toast.error("Erro inesperado ao excluir a manutenção. Tente novamente.");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Excluir manutenção"
            aria-label={`Excluir manutenção ${servicePart}`}
            className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-500 transition hover:cursor-pointer hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
            >
                <path d="M3 6h18" />
                <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
            </svg>
        </button>
    );
}
