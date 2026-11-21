"use server";

import { prisma } from "../lib/prisma";

// Lista todos os veículos
export async function listVehicles() {
    return prisma.vehicles.findMany();
}