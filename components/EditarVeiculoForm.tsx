"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { updateVehicle } from "@/app/veiculos-crud";

type VehicleData = {
    id: number;
    plate: string;
    brand: string;
    model: string;
    year: number;
    current_km: number;
};

type EditVehicleFormProps = {
    vehicle: VehicleData;
};

export function EditVehicleForm({ vehicle }: EditVehicleFormProps) {
    const router = useRouter();
    const [plate, setPlate] = useState(vehicle.plate);
    const [brand, setBrand] = useState(vehicle.brand);
    const [model, setModel] = useState(vehicle.model);
    const [year, setYear] = useState(String(vehicle.year));
    const [currentKm, setCurrentKm] = useState(String(vehicle.current_km));
    const [isSaving, setIsSaving] = useState(false);

    async function onSubmitVehicle(event: React.FormEvent) {
        event.preventDefault();
        setIsSaving(true);

        let resultado;
        try {
            resultado = await updateVehicle(
                vehicle.id,
                plate,
                model,
                brand,
                Number(year),
                Number(currentKm)
            );
        } catch {
            toast.error("Erro inesperado ao atualizar o veículo. Tente novamente.");
            setIsSaving(false);
            return;
        }

        if (resultado.sucesso) {
            toast.success(resultado.mensagem);
            router.push("/");
            router.refresh();
        } else {
            toast.error(resultado.mensagem);
            setIsSaving(false);
        }
    }

    return (
        <form
            onSubmit={onSubmitVehicle}
            className="flex flex-col gap-3 w-78 p-4"
        >
            <h1 className="text-center font-bold text-xl">Editar Veículo</h1>

            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Placa
                <input
                    className="border-gray-400 border-2 p-2 rounded-lg text-base font-normal text-gray-900"
                    type="text"
                    placeholder="Placa"
                    value={plate}
                    onChange={(event) => setPlate(event.target.value)}
                />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Marca
                <input
                    className="border-gray-400 border-2 p-2 rounded-lg text-base font-normal text-gray-900"
                    type="text"
                    placeholder="Marca"
                    value={brand}
                    onChange={(event) => setBrand(event.target.value)}
                />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Modelo
                <input
                    className="border-gray-400 border-2 p-2 rounded-lg text-base font-normal text-gray-900"
                    type="text"
                    placeholder="Modelo"
                    value={model}
                    onChange={(event) => setModel(event.target.value)}
                />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Ano
                <input
                    className="border-gray-400 border-2 p-2 rounded-lg text-base font-normal text-gray-900"
                    type="number"
                    placeholder="Ano"
                    value={year}
                    onChange={(event) => setYear(event.target.value)}
                />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Km atual
                <input
                    className="border-gray-400 border-2 p-2 rounded-lg text-base font-normal text-gray-900"
                    type="number"
                    min="0"
                    placeholder="Km atual"
                    value={currentKm}
                    onChange={(event) => setCurrentKm(event.target.value)}
                />
            </label>

            <div className="flex gap-2 pt-2">
                <Link
                    href="/"
                    className="flex-1 border-gray-400 border-2 p-2 rounded-lg text-center hover:bg-gray-200"
                >
                    Cancelar
                </Link>
                <button
                    className="flex-1 border-gray-400 border-2 p-2 rounded-lg hover:cursor-pointer hover:bg-cyan-900 hover:text-white disabled:opacity-50"
                    type="submit"
                    disabled={isSaving}
                >
                    {isSaving ? "Salvando..." : "Salvar"}
                </button>
            </div>
        </form>
    );
}
