"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { deleteVehicle } from "@/app/veiculos-crud";

type DeleteVehicleButtonProps = {
    vehicleId: number;
    vehicleLabel: string;
};

export function DeleteVehicleButton({
    vehicleId,
    vehicleLabel,
}: DeleteVehicleButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        const confirmed = window.confirm(
            `Deseja realmente excluir o veículo "${vehicleLabel}"? Todas as manutenções vinculadas a ele também serão excluídas.`
        );

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);
        try {
            const resultado = await deleteVehicle(vehicleId);

            if (resultado.sucesso) {
                toast.success(resultado.mensagem);
                router.refresh();
            } else {
                toast.error(resultado.mensagem);
            }
        } catch {
            toast.error("Erro inesperado ao excluir o veículo. Tente novamente.");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Excluir veículo"
            aria-label={`Excluir veículo ${vehicleLabel}`}
            className="inline-flex items-center justify-center rounded-md border border-red-300 px-3 py-2 text-red-600 transition hover:cursor-pointer hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
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
