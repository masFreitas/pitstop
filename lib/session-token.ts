import crypto from "node:crypto";

export const SESSION_COOKIE_NAME = "pitstop_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 dias

export type SessionPayload = {
    userId: number;
    username: string;
    exp: number;
};

function getAuthSecret(): string {
    return process.env.AUTH_SECRET || "pitstop-dev-secret-change-in-production";
}

function sign(data: string): string {
    return crypto
        .createHmac("sha256", getAuthSecret())
        .update(data)
        .digest("base64url");
}

export function createSessionToken(user: { id: number; username: string }): string {
    const payload: SessionPayload = {
        userId: user.id,
        username: user.username,
        exp: Date.now() + SESSION_DURATION_SECONDS * 1000,
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
    const signature = sign(encodedPayload);
    return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
    if (!token) {
        return null;
    }

    const parts = token.split(".");
    if (parts.length !== 2) {
        return null;
    }

    const [encodedPayload, providedSignature] = parts;
    const expectedSignature = sign(encodedPayload);

    const providedBuffer = Buffer.from(providedSignature, "utf8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");

    if (
        providedBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
    ) {
        return null;
    }

    try {
        const parsed = JSON.parse(
            Buffer.from(encodedPayload, "base64url").toString("utf8")
        ) as Partial<SessionPayload>;

        if (
            typeof parsed.userId !== "number" ||
            typeof parsed.username !== "string" ||
            typeof parsed.exp !== "number"
        ) {
            return null;
        }

        if (parsed.exp <= Date.now()) {
            return null;
        }

        return {
            userId: parsed.userId,
            username: parsed.username,
            exp: parsed.exp,
        };
    } catch {
        return null;
    }
}
