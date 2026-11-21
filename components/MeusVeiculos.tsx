"use server";

import Link from "next/link";
import { listVehicles } from "@/app/veiculos-crud";
import { DeleteVehicleButton } from "@/components/BotaoExcluirVeiculo";

export async function VehicleList() {
    const vehicles = await listVehicles();

    const vehiclesList = vehicles.map((vehicle) => (
        <li
            key={vehicle.id}
            className="flex flex-col gap-3 rounded-s border-2 border-gray-300 p-5"
        >
            <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-bold leading-tight text-gray-900">
                    {vehicle.brand} {vehicle.model}
                </h2>
                <span className="rounded-md border border-gray-400 px-2 py-0.5 text-sm font-semibold uppercase">
                    {vehicle.plate}
                </span>
            </div>

            <div className="flex gap-6 border-t border-gray-300 pt-3 text-sm">
                <div>
                    <p className="text-gray-500">Ano</p>
                    <p className="font-semibold text-gray-800">{vehicle.year}</p>
                </div>
                <div>
                    <p className="text-gray-500">Km</p>
                    <p className="font-semibold text-gray-800">
                        {Number(vehicle.current_km).toLocaleString("pt-BR")}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 border-t border-gray-300 pt-3">
                <Link
                    href={`/cadastrar-manutencao/${vehicle.id}`}
                    className="block flex-1 rounded-md bg-gray-900 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-green-700"
                >
                    + Nova manutenção
                </Link>
                <DeleteVehicleButton
                    vehicleId={vehicle.id}
                    vehicleLabel={`${vehicle.brand} ${vehicle.model} (${vehicle.plate})`}
                />
            </div>
        </li>
    ));

    return (
        <div className="p-3">
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {vehiclesList}
            </ul>
        </div>
    );
}
