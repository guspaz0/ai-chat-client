import { app } from 'electron';
import fs from 'fs';
import fspromise from 'fs/promises'
import path from 'path';
import { encrypt, decrypt } from '../utils/encryption.service';

const packageJsonPath = path.join(app.getAppPath(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

let configRootPath;
let configJson;
try {
    configRootPath = path.join(app.getPath('userData'), 'config.json');
    configJson = JSON.parse(fs.readFileSync(configRootPath, 'utf-8'))
} catch (e) {
    fspromise.writeFile(app.getPath('userData')+'/config.json', 
        JSON.stringify({
            app: packageJson.name, 
            version: packageJson.version
        },null,4)
    ).then(()=> {
        configRootPath = path.join(app.getPath('userData'), 'config.json');
        configJson = JSON.parse(fs.readFileSync(configRootPath, 'utf-8'))
    })
}

export class ConfigService {
    private static instance: ConfigService;

    private constructor() {}

    public static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    public getConfig(key: string): any {
        return configJson[key];
    }

    public setConfig(key: string, value: any): void {
        configJson[key] = value;
        fs.writeFileSync(configRootPath, JSON.stringify(configJson, null, 4));
    }

    public encryptConfig(key: string): string {
        const value = this.getConfig(key);
        return encrypt(JSON.stringify(value));
    }

    public decryptConfig(encryptedValue: string): any {
        const decrypted = decrypt(encryptedValue);
        return JSON.parse(decrypted);
    }
}