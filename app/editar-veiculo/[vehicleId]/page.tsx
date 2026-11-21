import { Suspense } from "react";
import { notFound } from "next/navigation";
import { listVehicleById } from "@/app/veiculos-crud";
import { EditVehicleForm } from "@/components/EditarVeiculoForm";

type EditarVeiculoPageProps = {
    params: Promise<{ vehicleId: string }>;
};

async function EditarVeiculoContent({ params }: EditarVeiculoPageProps) {
    const { vehicleId } = await params;
    const id = Number(vehicleId);

    if (Number.isNaN(id)) {
        notFound();
    }

    const vehicle = await listVehicleById(id);

    if (!vehicle) {
        notFound();
    }

    return (
        <EditVehicleForm
            key={`${vehicle.id}-${vehicle.plate}-${vehicle.brand}-${vehicle.model}-${vehicle.year}-${vehicle.current_km}`}
            vehicle={vehicle}
        />
    );
}

export default function EditarVeiculoPage({ params }: EditarVeiculoPageProps) {
    return (
        <div className="flex items-center justify-center w-full h-full pt-3">
            <div className="border-2 p-4 rounded-xl border-gray-400">
                <Suspense fallback={<p className="p-4">Carregando veículo...</p>}>
                    <EditarVeiculoContent params={params} />
                </Suspense>
            </div>
        </div>
    );
}
