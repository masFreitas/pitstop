import { VehicleList } from "@/components/MeusVeiculos";
import { MaintenanceList } from "@/components/HistoricoManutencao";

export default function Home() {
  return (
    <div>
      <VehicleList></VehicleList>
      <br />
      <MaintenanceList></MaintenanceList>
    </div>
  );
}
