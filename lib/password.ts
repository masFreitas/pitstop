import crypto from "node:crypto";

const HASH_PREFIX = "scrypt";
const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");
    return `${HASH_PREFIX}$${salt}$${derivedKey}`;
}

export function verifyPassword(
    password: string,
    storedPassword: string
): { valid: boolean; needsUpgrade: boolean } {
    if (storedPassword.startsWith(`${HASH_PREFIX}$`)) {
        const [, salt, storedHash] = storedPassword.split("$");
        if (!salt || !storedHash) {
            return { valid: false, needsUpgrade: false };
        }

        const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH);
        const storedKey = Buffer.from(storedHash, "hex");

        if (derivedKey.length !== storedKey.length) {
            return { valid: false, needsUpgrade: false };
        }

        return {
            valid: crypto.timingSafeEqual(derivedKey, storedKey),
            needsUpgrade: false,
        };
    }

    // Compatibilidade com senhas legadas em texto puro já existentes no banco local
    const providedBuffer = Buffer.from(password, "utf8");
    const storedBuffer = Buffer.from(storedPassword, "utf8");

    if (providedBuffer.length !== storedBuffer.length) {
        return { valid: false, needsUpgrade: false };
    }

    const valid = crypto.timingSafeEqual(providedBuffer, storedBuffer);
    return { valid, needsUpgrade: valid };
}
