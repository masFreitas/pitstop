"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createMaintenance } from "@/app/veiculos-crud";

type VehicleResumo = {
    id: number;
    brand: string;
    model: string;
    plate: string;
    current_km: number;
};

type CreateMaintenanceFormProps = {
    vehicle: VehicleResumo;
};

export function CreateMaintenanceForm({ vehicle }: CreateMaintenanceFormProps) {
    const router = useRouter();
    const [servicePart, setServicePart] = useState("");
    const [cost, setCost] = useState("");
    const [kmMaintenance, setKmMaintenance] = useState(String(vehicle.current_km));
    const [dateMaintenance, setDateMaintenance] = useState("");

    async function onSubmitMaintenance(event: any) {
        event.preventDefault();

        const parsedDate = dateMaintenance
            ? new Date(`${dateMaintenance}T12:00:00`)
            : undefined;

        let resultado;
        try {
            resultado = await createMaintenance(vehicle.id, servicePart, Number(cost), Number(kmMaintenance), parsedDate);
        } catch {
            toast.error("Erro inesperado ao cadastrar o manutencao. Tente novamente.");
            return;
        }
        if (resultado.sucesso) {
            toast.success(resultado.mensagem);
            setServicePart("");
            setCost("");
            setKmMaintenance("");
            setDateMaintenance("");
            router.push("/");
        } else {
            toast.error(resultado.mensagem);
        }
    };

    return (
        <form
            onSubmit={onSubmitMaintenance}
            className="flex flex-col gap-4 max-w-78 p-4"
        >
            <h1 className="text-center font-bold text-xl">Cadastrar Manutenção</h1>
            <hr />
            <h3 className="text-center font-bold text-md">{vehicle.brand}/{vehicle.model} - {vehicle.plate}</h3>
            <input
                className="border-gray-400 border-2 p-2 rounded-lg"
                type="text"
                placeholder="Serviço ou Peça"
                value={servicePart}
                onChange={(event) => setServicePart(event.target.value)}
            />
            <input
                className="border-gray-400 border-2 p-2 rounded-lg"
                type="number"
                step="0.01"
                min="1"
                placeholder="Valor"
                value={cost}
                onChange={(event) => setCost(event.target.value)}
            />
            <input
                className="border-gray-400 border-2 p-2 rounded-lg"
                type="number"
                min={vehicle.current_km}
                placeholder="KM Manutenção"
                value={kmMaintenance}
                onChange={(event) => setKmMaintenance(event.target.value)}
            />
            <input
                className="border-gray-400 border-2 p-2 rounded-lg"
                type="date"
                placeholder="Data da Manutenção"
                value={dateMaintenance}
                onChange={(event) => setDateMaintenance(event.target.value)}
            />
            <button
                className="border-gray-400 border-2 p-2 rounded-lg hover:cursor-pointer hover:bg-cyan-900"
                type="submit"
            >
                Enviar
            </button>
        </form>
    );
}