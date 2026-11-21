"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createVehicle } from "./veiculos-crud";

export function CreateVehicleForm() {
    const router = useRouter();
    const [plate, setPlate] = useState("");
    const [model, setModel] = useState("");
    const [brand, setBrand] = useState("");
    const [year, setYear] = useState("");
    const [currentKm, setCurrentKm] = useState("");

    async function onSubmitVehicle(event: any) {
        event.preventDefault();
        let resultado;
        try {
            resultado = await createVehicle(plate, model, brand, Number(year), Number(currentKm));
        } catch {
            toast.error("Erro inesperado ao cadastrar o veículo. Tente novamente.");
            return;
        }
        if (resultado.sucesso) {
            toast.success(resultado.mensagem);
            setPlate("");
            setModel("");
            setBrand("");
            setYear("");
            setCurrentKm("");
            router.push("/");
        } else {
            toast.error(resultado.mensagem);
        }
    };

    return (
        <form
            onSubmit={onSubmitVehicle}
            className="flex flex-col gap-4 max-w-78 p-4"
        >
            <h1 className="text-center font-bold text-xl">Cadastrar Veículo</h1>
            <input
                className="border-gray-400 border-2 p-2 rounded-lg"
                type="text"
                placeholder="Placa"
                value={plate}
                onChange={(event) => setPlate(event.target.value)}
            />
            <input
                className="border-gray-400 border-2 p-2 rounded-lg"
                type="text"
                placeholder="Marca"
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
            />
            <input
                className="border-gray-400 border-2 p-2 rounded-lg"
                type="text"
                placeholder="Modelo"
                value={model}
                onChange={(event) => setModel(event.target.value)}
            />
            <input
                className="border-gray-400 border-2 p-2 rounded-lg"
                type="number"
                placeholder="Ano"
                value={year}
                onChange={(event) => setYear(event.target.value)}
            />
            <input
                className="border-gray-400 border-2 p-2 rounded-lg"
                type="number"
                placeholder="Km atual"
                value={currentKm}
                onChange={(event) => setCurrentKm(event.target.value)}
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