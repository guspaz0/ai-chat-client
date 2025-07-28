import * as crypto from 'crypto';
import EnvService from '../config/env.service';

const ALGORITHM = EnvService.getVariable("ALGORITHM") as string
const SECRET_KEY = EnvService.getVariable("SECRET_KEY") as string
const IV = crypto.randomBytes(16);

export function encrypt(text: string): string {
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY,'hex'), IV);
    let encrypted = cipher.update(String(text), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return IV.toString('hex') + ':' + encrypted;
}

export function decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY,'hex'), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}