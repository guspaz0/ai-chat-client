import { app } from 'electron'
import path from 'path'
import fs from 'fs'

class envService {
    readonly isDev = !app.isPackaged && process.env.NODE_ENV === 'development'
    private readonly path: string = app.isPackaged
        ? path.join(process.resourcesPath, '.env')
        : path.resolve(process.cwd(), '.env');
    private envs: Map<string, string> = new Map();

    constructor(){
        process.loadEnvFile(this.path);
        Object.keys(process.env as Record<string,string>).forEach(e => {
            this.envs.set(e, process.env[e] as string)
        })
    }

    getVariable(name: string) {
        return this.envs.get(name)
    }

    setVariable(name: string, value: string) {
        this.envs.set(name, value)
    }

    persist(){
        let string = ""
        this.envs.entries()
            .toArray()
            .forEach(([key, value])=> string += `${key}=${value}\n`)
        fs.writeFileSync(this.path, string)
    }

    private getRandomCharFromRanges(...ranges: number[][]) {
        const [start, end] = ranges[Math.floor(Math.random() * ranges.length)];
        const code = Math.floor(Math.random() * (end - start + 1)) + start;
        return String.fromCharCode(code);
    }

    // Example: A mix of uppercase, lowercase, digits, and symbols
    generateRandomString(name: string, length: number) {
        const ranges = [
            [48, 57],   // 0-9
            [97, 102]  // a-z
        ];

        let result = '';
        for (let i = 0; i < length; i++) {
            result += this.getRandomCharFromRanges(...ranges);
        }
        this.envs.set(name, result)
        this.persist()
        return result;
    }
}

export default new envService()
