import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { CreateVehicleForm } from "../cadastra-veiculo-form";

async function CreateVehicleContent() {
  await requireUser();
  return <CreateVehicleForm />;
}

export default function CreateVehicle() {
  return (
    <div className="flex items-center justify-center w-full h-full pt-3">
      <div className="border-2 p-4 rounded-xl border-gray-400">
        <Suspense fallback={<p className="p-4">Carregando...</p>}>
          <CreateVehicleContent />
        </Suspense>
      </div>
    </div>
  );
}