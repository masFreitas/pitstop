import { listMaintenance } from "@/app/veiculos-crud";
import { DeleteMaintenanceButton } from "./BotaoExcluirManutencao";

export async function MaintenanceList() {
    const maintenances = await listMaintenance();
    const totalGasto = maintenances.reduce(
        (total, maintenance) => total + maintenance.cost,
        0
    );

    return (
        <div className="p-3">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                    Histórico de Manutenções
                </h2>
                <p className="text-sm font-semibold text-gray-700">
                    Total gasto:{" "}
                    <span className="text-lg font-bold text-green-700">
                        {totalGasto.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </span>
                </p>
            </div>
            <div className="overflow-x-auto rounded-s border-2 border-gray-300">
                <table className="w-full border-collapse text-left text-sm">
                    <thead className="border-b-2 border-gray-300 bg-gray-100 text-xs uppercase text-gray-600">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Veículo</th>
                            <th className="px-4 py-3 font-semibold">Serviço ou Peça</th>
                            <th className="px-4 py-3 font-semibold">Km</th>
                            <th className="px-4 py-3 font-semibold">Data</th>
                            <th className="px-4 py-3 text-right font-semibold">Valor</th>
                            <th className="px-4 py-3 text-center font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {maintenances.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                    Nenhuma manutenção registrada.
                                </td>
                            </tr>
                        ) : (
                            maintenances.map((maintenance) => (
                                <tr key={maintenance.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-semibold text-gray-900">
                                        <span>
                                            {maintenance.vehicle.brand} {maintenance.vehicle.model}
                                        </span>
                                        <span className="ml-2 rounded-md border border-gray-400 px-2 py-0.5 text-xs font-semibold uppercase text-gray-700">
                                            {maintenance.vehicle.plate}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">
                                        {maintenance.service_part}
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">
                                        {Number(maintenance.km_maintenance).toLocaleString("pt-BR")} km
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">
                                        {maintenance.date_maintenance.toLocaleDateString("pt-BR")}
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                        {maintenance.cost.toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <DeleteMaintenanceButton 
                                            maintenanceId={maintenance.id}
                                            servicePart={maintenance.service_part}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
