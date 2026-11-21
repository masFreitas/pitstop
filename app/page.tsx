import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { VehicleList } from "@/components/MeusVeiculos";
import { MaintenanceList } from "@/components/HistoricoManutencao";

async function HomeContent() {
  await requireUser();

  return (
    <div>
      <VehicleList />
      <br />
      <MaintenanceList />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<p className="p-4">Carregando...</p>}>
      <HomeContent />
    </Suspense>
  );
}
