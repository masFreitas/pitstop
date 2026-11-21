"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export async function login(username: string, password: string) {
    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password) {
        return {
            sucesso: false,
            mensagem: "Informe o usuário e a senha.",
        };
    }

    const user = await prisma.users.findUnique({
        where: { username: trimmedUsername },
    });

    if (!user) {
        return {
            sucesso: false,
            mensagem: "Usuário ou senha inválidos.",
        };
    }

    const { valid, needsUpgrade } = verifyPassword(password, user.password);

    if (!valid) {
        return {
            sucesso: false,
            mensagem: "Usuário ou senha inválidos.",
        };
    }

    if (needsUpgrade) {
        await prisma.users.update({
            where: { id: user.id },
            data: { password: hashPassword(password) },
        });
    }

    await createSession({ id: user.id, username: user.username });
    revalidatePath("/", "layout");

    return {
        sucesso: true,
        mensagem: "Login realizado com sucesso!",
    };
}

export async function register(
    username: string,
    password: string,
    confirmPassword: string
) {
    const trimmedUsername = username.trim();

    if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
        return {
            sucesso: false,
            mensagem: "O nome de usuário deve ter entre 3 e 30 caracteres.",
        };
    }

    if (/\s/.test(trimmedUsername)) {
        return {
            sucesso: false,
            mensagem: "O nome de usuário não pode conter espaços.",
        };
    }

    if (password.length < 6) {
        return {
            sucesso: false,
            mensagem: "A senha deve ter pelo menos 6 caracteres.",
        };
    }

    if (password !== confirmPassword) {
        return {
            sucesso: false,
            mensagem: "As senhas não coincidem.",
        };
    }

    const existingUser = await prisma.users.findUnique({
        where: { username: trimmedUsername },
    });

    if (existingUser) {
        return {
            sucesso: false,
            mensagem: "Esse nome de usuário já está em uso.",
        };
    }

    const createdUser = await prisma.users.create({
        data: {
            username: trimmedUsername,
            password: hashPassword(password),
        },
        select: {
            id: true,
            username: true,
        },
    });

    await createSession(createdUser);
    revalidatePath("/", "layout");

    return {
        sucesso: true,
        mensagem: "Conta criada com sucesso!",
    };
}

export async function logout() {
    await destroySession();
    revalidatePath("/", "layout");
    redirect("/login");
}
