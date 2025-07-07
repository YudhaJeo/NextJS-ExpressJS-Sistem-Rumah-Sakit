import { randomBytes, pbkdf2Sync, createCipheriv, createDecipheriv } from 'crypto';

const algorithm = 'aes-256-cbc';
const password = process.env.TOKEN_SECRET as string;

if (!password) {
    throw new Error('TOKEN_SECRET environment variable is not defined');
}

interface EncryptedResult {
    iv: string;
    encryptedText: string;
}

export const encrypt = (text: string): EncryptedResult => {
    const iv = randomBytes(16);
    const salt = randomBytes(16);
    const key = pbkdf2Sync(password, salt, 100000, 32, 'sha512');
    const cipher = createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv: iv.toString('hex'),
        encryptedText: encrypted
    };
};

export const decrypt = (encryptedText: string, ivSalt: string): string => {
    const [ivHex, saltHex] = ivSalt.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const salt = Buffer.from(saltHex, 'hex');

    const key = pbkdf2Sync(password, salt, 100000, 32, 'sha512');
    const dechiper = createDecipheriv(algorithm, key, iv);

    let decrypted = dechiper.update(encryptedText, 'hex', 'utf8');
    decrypted += dechiper.final('utf8');

    return decrypted;
};
