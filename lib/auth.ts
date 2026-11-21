import { io } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import {
    createSessionToken,
    SESSION_COOKIE_NAME,
    SESSION_DURATION_SECONDS,
    verifySessionToken,
} from "./session-token";

export type AuthenticatedUser = {
    id: number;
    username: string;
};

export async function createSession(user: AuthenticatedUser): Promise<void> {
    const token = createSessionToken(user);
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_DURATION_SECONDS,
    });
}

export async function destroySession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionUser(): Promise<AuthenticatedUser | null> {
    await io();
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const payload = verifySessionToken(token);

    if (!payload) {
        return null;
    }

    const user = await prisma.users.findUnique({
        where: { id: payload.userId },
        select: { id: true, username: true },
    });

    return user;
}

export async function requireUser(): Promise<AuthenticatedUser> {
    const user = await getSessionUser();

    if (!user) {
        redirect("/login");
    }

    return user;
}
