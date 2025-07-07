const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const password = process.env.TOKEN_SECRET; // Kunci rahasia yang digunakan untuk enkripsi dan dekripsi

export function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(password, iv, 100000, 32, 'sha512');
    // const key = crypto.scryptSync(password, iv, 32);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv: iv.toString('hex'), // Konversi IV ke string hex untuk penyimpanan
        encryptedText: encrypted
    };
}

export function decrypt(encryptedText) {
    const value = encryptedText.split('/');
    const iv = Buffer.from(value[1], 'hex');
    const key = crypto.pbkdf2Sync(password, iv, 100000, 32, 'sha512');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(value[0], 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
