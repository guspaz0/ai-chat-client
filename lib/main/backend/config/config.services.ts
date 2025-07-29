import { app } from 'electron';
import fs from 'fs';
import fspromise from 'fs/promises'
import path from 'path';
import { encrypt, decrypt } from '../utils/encryption.service';

const packageJsonPath = path.join(app.getAppPath(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

let configRootPath;
let configJson: ConfigJson;
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
        configJson = JSON.parse(fs.readFileSync(configRootPath, 'utf-8')) as ConfigJson
    })
}
interface ConfigJson {
  ollamaHost?: string
  defaultModel?: string
}

export class ConfigService {
    private static #instance: ConfigService;
    private ollamaHost?: string;
    private defaultModel?: string;

    private constructor() {
      this.ollamaHost = configJson.ollamaHost || encrypt('http://localhost:11434');
      this.defaultModel = configJson.defaultModel || '';
    }

    public static getInstance(): ConfigService {
        if (!ConfigService.#instance) {
            ConfigService.#instance = new ConfigService();
        }
        return ConfigService.#instance;
    }

    public getConfig(key: string): any {
      if (!this[key]) return;
      return decrypt(this[key]);
    }

    public setConfig(key: string, value: any): void {
        if(!this[key]) return;
        this[key] = encrypt(value);
        fs.writeFileSync(configRootPath, JSON.stringify(this, null, 4));
    }
}
