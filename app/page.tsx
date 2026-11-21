import Image from "next/image";
import { VehicleList } from "@/components/MeusVeiculos";

export default function Home() {
  return (
    <div>
      <h1>PitStop</h1>
      <VehicleList></VehicleList>
    </div>
  );
}
