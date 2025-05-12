import fs from 'node:fs';

const TEMPLATE_DIR = '../client/templates';
const PARTIAL_DIR = `${TEMPLATE_DIR}/partials`;

const registeredTemplates: {[key: string]: string} = {};

for (const path of fs.readdirSync(PARTIAL_DIR)) {
    const TEMPLATE_EXT = '.html';

    if (!path.endsWith(TEMPLATE_EXT))
        continue;
    
    const partialName = path.substring(0, path.length - TEMPLATE_EXT.length);
    
    try {
        const file = fs.readFileSync(`${PARTIAL_DIR}/${path}`).toString();
        registeredTemplates[partialName] = file;
    } catch {}
}

const indexFile = fs.readFileSync(`${TEMPLATE_DIR}/index.html`).toString();

function applyIncludes(file: string, templates: {[key: string]: string}): string {
    let out = file;

    const ssrIncludeRegex = /<!--\s*SSR_INCLUDE\s+(\w+)\s*-->/g;

    // cut off includes if more than 32 layers deep, prevents infinite recursion
    for (let i = 0; i < 32; i++) {
        const matches = [...out.matchAll(ssrIncludeRegex)];

        for (const match of matches) {
            const includeString = match[0];
            const templateName = match[1];
            out = out.replaceAll(includeString, templates[templateName]);
        }

        if (matches.length == 0)
            break;
    }

    return out;
}

export const indexPage = applyIncludes(indexFile, registeredTemplates);
