import yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);

function parseYaml(file) {
    return yaml.load(readFileSync(resolve(__dirname, `${file}.yml`), 'utf8'));
}

export const swaggerDoc = {
    openapi: "3.0.0",
    info: {
        title: "BarberDates",
        version: "1.0.0"
    },
    paths: parseYaml('paths'),
    components: {
        schemas: parseYaml('schemas'),
        securitySchemes: parseYaml('security'),
        examples: parseYaml('examples'),
        responses: parseYaml('responses'),
    },
};
