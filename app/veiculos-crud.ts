"use server";

import { prisma } from "../lib/prisma";

// Lista todos os veículos
export async function listVehicles() {
    return prisma.vehicles.findMany();
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

export async function listMaintenance() {
    return prisma.maintenance.findMany({
        include: { vehicle: true },
        orderBy: { date_maintenance: "desc" },
    });
}