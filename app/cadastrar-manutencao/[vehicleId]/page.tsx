import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { listVehicleById } from "@/app/veiculos-crud";
import { CreateMaintenanceForm } from "@/components/CadastrarManutencaoForm";

type CadastrarManutencaoPageProps = {
    params: Promise<{ vehicleId: string }>;
};

async function CadastrarManutencaoContent({params}: CadastrarManutencaoPageProps) {
    await requireUser();
    const { vehicleId } = await params;
    const id = Number(vehicleId);

    if (Number.isNaN(id)) {
        notFound();
    }

    const vehicle = await listVehicleById(id);

    if (!vehicle) {
        notFound();
    }

    return <CreateMaintenanceForm vehicle={vehicle} />;
}

export default function CadastrarManutencaoPage({
    params,
}: CadastrarManutencaoPageProps) {
    return (
        <div className="flex items-center justify-center w-full h-full pt-3">
            <div className="border-2 p-4 rounded-xl border-gray-400">
                <Suspense fallback={<p className="p-4">Carregando veículo...</p>}>
                    <CadastrarManutencaoContent params={params} />
                </Suspense>
            </div>
        </div>
    );
}
