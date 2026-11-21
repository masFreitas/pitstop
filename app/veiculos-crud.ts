"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "../lib/prisma";

// Lista somente os veículos do usuário logado
export async function listVehicles() {
    const user = await getSessionUser();

    if (!user) {
        return [];
    }

    return prisma.vehicles.findMany({
        where: { userId: user.id },
    });
}

// Buscar veículo por id somente se pertencer ao usuário logado
export async function listVehicleById(id: number) {
    const user = await getSessionUser();

    if (!user) {
        return null;
    }

    const vehicle = await prisma.vehicles.findFirst({
        where: {
            id,
            userId: user.id,
        },
    });

    return vehicle;
}

// Criar veículo vinculado ao usuário logado
export async function createVehicle(plate: string, model: string, brand: string, year: number, current_km: number) {
    const user = await getSessionUser();

    if (!user) {
        return {
            sucesso: false,
            mensagem: "Você precisa estar logado para cadastrar um veículo.",
        };
    }

    const trimmedPlate = plate.trim();
    const trimmedModel = model.trim();
    const trimmedBrand = brand.trim();

    if (trimmedPlate.length !== 7) {
        return {
            sucesso: false,
            mensagem: "A placa precisa ter 7 caracteres (ex: AAA1A11)."
        };
    } else if (trimmedBrand.length === 0 || trimmedModel.length === 0) {
        return {
            sucesso: false,
            mensagem: "Marca e modelo são obrigatórios."
        };
    } else if (Number.isNaN(year) || year < 1885) {
        return {
            sucesso: false,
            mensagem: "O ano precisa ser maior que 1885."
        };
    } else if (Number.isNaN(current_km) || current_km < 0) {
        return {
            sucesso: false,
            mensagem: "O km atual não pode ser negativo."
        };
    }

    // Verifica se o usuário já tem um veículo com essa placa
    const placaExistente = await prisma.vehicles.findFirst({
        where: { userId: user.id, plate: trimmedPlate },
    });

    if (placaExistente) {
        return {
            sucesso: false,
            mensagem: "Você já tem um veículo cadastrado com essa placa."
        };
    }

    await prisma.vehicles.create({
        data: {
            plate: trimmedPlate,
            model: trimmedModel,
            brand: trimmedBrand,
            year,
            current_km,
            owner: { connect: { id: user.id } },
        },
    });

    revalidatePath("/");

    return {
        sucesso: true,
        mensagem: "Veículo cadastrado com sucesso!"
    };
}

// Excluir veículo somente se pertencer ao usuário logado
export async function deleteVehicle(id: number) {
    const user = await getSessionUser();

    if (!user) {
        return {
            sucesso: false,
            mensagem: "Você precisa estar logado para excluir um veículo.",
        };
    }

    const vehicle = await prisma.vehicles.findFirst({
        where: {
            id,
            userId: user.id,
        },
    });

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

// Editar veículo somente se pertencer ao usuário logado
export async function updateVehicle(
    id: number,
    plate: string,
    model: string,
    brand: string,
    year: number,
    current_km: number
) {
    const user = await getSessionUser();

    if (!user) {
        return {
            sucesso: false,
            mensagem: "Você precisa estar logado para editar um veículo.",
        };
    }

    const vehicle = await prisma.vehicles.findFirst({
        where: {
            id,
            userId: user.id,
        },
    });

    if (!vehicle) {
        return {
            sucesso: false,
            mensagem: "Veículo não encontrado!",
        };
    }

    const trimmedPlate = plate.trim();
    const trimmedModel = model.trim();
    const trimmedBrand = brand.trim();

    if (trimmedPlate.length !== 7) {
        return {
            sucesso: false,
            mensagem: "A placa precisa ter 7 caracteres (ex: AAA1A11).",
        };
    } else if (trimmedBrand.length === 0 || trimmedModel.length === 0) {
        return {
            sucesso: false,
            mensagem: "Marca e modelo são obrigatórios.",
        };
    } else if (Number.isNaN(year) || year < 1885) {
        return {
            sucesso: false,
            mensagem: "O ano precisa ser maior que 1885.",
        };
    } else if (Number.isNaN(current_km) || current_km < 0) {
        return {
            sucesso: false,
            mensagem: "O km atual não pode ser negativo.",
        };
    }

    const placaExistente = await prisma.vehicles.findFirst({
        where: {
            userId: user.id,
            plate: trimmedPlate,
            id: { not: vehicle.id },
        },
    });

    if (placaExistente) {
        return {
            sucesso: false,
            mensagem: "Você já tem outro veículo cadastrado com essa placa.",
        };
    }

    await prisma.vehicles.update({
        where: { id: vehicle.id },
        data: {
            plate: trimmedPlate,
            model: trimmedModel,
            brand: trimmedBrand,
            year,
            current_km,
        },
    });

    revalidatePath("/");
    revalidatePath(`/editar-veiculo/${vehicle.id}`);

    return {
        sucesso: true,
        mensagem: "Veículo atualizado com sucesso!",
    };
}

// Listar somente as manutenções dos veículos do usuário logado
export async function listMaintenance() {
    const user = await getSessionUser();

    if (!user) {
        return [];
    }

    return prisma.maintenance.findMany({
        where: {
            vehicle: {
                userId: user.id,
            },
        },
        include: { vehicle: true },
        orderBy: { date_maintenance: "desc" },
    });
}

// Buscar manutenção por ID somente se o veículo pertencer ao usuário logado
export async function listMaintenanceById(id: number) {
    const user = await getSessionUser();

    if (!user) {
        return null;
    }

    const maintenance = await prisma.maintenance.findFirst({
        where: {
            id,
            vehicle: {
                userId: user.id,
            },
        },
    });

    return maintenance;
}

// Criar manutenção somente em veículo do usuário logado
export async function createMaintenance(vehicleId: number, service_part: string, cost: number, km_maintenance: number, date_maintenance?: Date) {
    const user = await getSessionUser();

    if (!user) {
        return {
            sucesso: false,
            mensagem: "Você precisa estar logado para cadastrar uma manutenção.",
        };
    }

    const vehicle = await prisma.vehicles.findFirst({
        where: {
            id: vehicleId,
            userId: user.id,
        },
    });

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
            vehicle: { connect: { id: vehicle.id } }
        },
    });

    revalidatePath("/");

    return {
        sucesso: true,
        mensagem: "Manutenção cadastrada com sucesso!"
    };
}

// Excluir manutenção somente se o veículo pertencer ao usuário logado
export async function deleteMaintenance(id: number) {
    const user = await getSessionUser();

    if (!user) {
        return {
            sucesso: false,
            mensagem: "Você precisa estar logado para excluir uma manutenção.",
        };
    }

    const maintenance = await prisma.maintenance.findFirst({
        where: {
            id,
            vehicle: {
                userId: user.id,
            },
        },
    });

    if (!maintenance) {
        return {
            sucesso: false,
            mensagem: "Manutenção não encontrada!"
        };
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
    };
}
