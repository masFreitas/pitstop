import { CreateVehicleForm } from "../cadastra-veiculo-form";

export default function CreateVehicle() {
  return (
    <div className="flex items-center justify-center w-full h-full pt-3">
      <div className="border-2 p-4 rounded-xl border-gray-400">
        <CreateVehicleForm />
      </div>
    </div>
  );
}