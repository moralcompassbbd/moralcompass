import Handlebars from 'handlebars';
import fs from 'node:fs';
import pino from 'pino';

const logger = pino();

const TEMPLATE_EXT = '.handlebars';
const TEMPLATE_DIR = '../client/templates';
const PARTIAL_DIR = `${TEMPLATE_DIR}/partials`;

fs.readdirSync(PARTIAL_DIR).forEach(path => {
    if (!path.endsWith(TEMPLATE_EXT)) return;
    
    try {
        const file = fs.readFileSync(`${PARTIAL_DIR}/${path}`).toString();
        const partialName = path.substring(0, path.length - TEMPLATE_EXT.length);
        Handlebars.registerPartial(partialName, file);
        logger.info(`Registered partial '${path}'`);
    } catch (err) {
        logger.error(`Failed to register partial '${path}': ${err}`);
    }
});

export const renderIndex = Handlebars.compile<{}>(fs.readFileSync(`${TEMPLATE_DIR}/index.handlebars`).toString());
