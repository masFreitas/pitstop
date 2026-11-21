"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";

// Lista todos os veículos
export async function listVehicles() {
    return prisma.vehicles.findMany();
}

// Buscar veiculo por id
export async function listVehicleById(id: number) {
    const vehicle = await prisma.vehicles.findUnique({
        where: {
            id,
        },
    });

    return vehicle;
}

//criar veiculo
export async function createVehicle(plate: string, model: string, brand: string, year: number, current_km: number) {
    if (plate.length !== 7) {
        return {
            sucesso: false,
            mensagem: "A placa precisa ter 7 caracteres (ex: AAA1A11)."
        };
    } else if (year < 1885) {
        return {
            sucesso: false,
            mensagem: "A ano precisa ser maior que 1885."
        };
    };

    const userId = 1; // TODO: trocar pelo usuário logado

    // Verifica se o usuário já tem um veículo com essa placa
    const placaExistente = await prisma.vehicles.findFirst({
        where: { userId, plate },
    });

    if (placaExistente) {
        return {
            sucesso: false,
            mensagem: "Você já tem um veículo cadastrado com essa placa."
        };
    }

    await prisma.vehicles.create({
        data: {
            plate,
            model,
            brand,
            year,
            current_km,
            owner: { connect: { id: userId } },
        },
    });

    return {
        sucesso: true,
        mensagem: "Veículo cadastrado com sucesso!"
    }
}

// Excluir veiculo
export async function deleteVehicle(id: number) {
    const vehicle = await listVehicleById(id);

    if (!vehicle) {
        return {
            sucesso: false,
            mensagem: "Veículo não encontrado!",
        };
    }

    await prisma.vehicles.delete({
        where: {
            id: vehicle.id,
        },
    });

    revalidatePath("/");

    return {
        sucesso: true,
        mensagem: "Veículo excluído com sucesso!",
    };
}

// Listar todas as manutencoes
export async function listMaintenance() {
    return prisma.maintenance.findMany({
        include: { vehicle: true },
        orderBy: { date_maintenance: "desc" },
    });
}

// buscar manutencao por ID
export async function listMaintenanceById(id: number) {
    const maintenance = await prisma.maintenance.findUnique({
        where: {
            id,
        },
    });

    return maintenance;
}

// Criar manutencao
export async function createMaintenance(vehicleId: number, service_part: string, cost: number, km_maintenance: number, date_maintenance?: Date) {

    const vehicle = await listVehicleById(vehicleId);

    if (!vehicle) {
        return {
            sucesso: false,
            mensagem: "O veículo não foi encontrado!"
        };
    }

    if (Number.isNaN(km_maintenance) || km_maintenance < vehicle.current_km) {
        return {
            sucesso: false,
            mensagem: `O km da manutenção não pode ser menor que o km atual do veículo (${vehicle.current_km} km)`
        };
    }

    if (service_part.trim().length <= 0 || service_part.trim().length > 100) {
        return {
            sucesso: false,
            mensagem: "O campo Serviço ou Peça deve ter entre 1 e 100 caracteres."
        };
    } else if (Number.isNaN(cost) || cost < 1) {
        return {
            sucesso: false,
            mensagem: "O campo valor deve ser maior que R$ 1.00"
        };
    }

    await prisma.maintenance.create({
        data: {
            service_part: service_part.trim(),
            cost,
            km_maintenance,
            date_maintenance,
            vehicle: { connect: { id: vehicleId } }
        },
    });

    return {
        sucesso: true,
        mensagem: "Manutenção cadastrada com sucesso!"
    }

}

export async function deleteMaintenance(id: number) {
    const maintenance = await listMaintenanceById(id);

    if (!maintenance) {
        return {
            sucesso: false,
            mensagem: "Manutenção não encontrada!"
        }
    }

    await prisma.maintenance.delete({
        where: {
            id: maintenance.id
        }
    });

    revalidatePath("/");

    return {
        sucesso: true,
        mensagem: "Manutenção excluída com sucesso!"
    }
}
