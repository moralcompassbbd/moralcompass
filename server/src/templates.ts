import Handlebars from 'handlebars';
import fs from 'node:fs';
import pino from 'pino';

const logger = pino();

const TEMPLATE_DIR = '../client/templates';
const PARTIAL_DIR = `${TEMPLATE_DIR}/partials`;

fs.readdirSync(PARTIAL_DIR).forEach(path => {
    const TEMPLATE_EXT = '.handlebars';

    if (!path.endsWith(TEMPLATE_EXT)) return;
    const partialName = path.substring(0, path.length - TEMPLATE_EXT.length);
    
    try {
        const file = fs.readFileSync(`${PARTIAL_DIR}/${path}`).toString();
        Handlebars.registerPartial(partialName, file);
        logger.info(`Registered partial '${partialName}'`);
    } catch (err) {
        logger.error(`Failed to register partial '${partialName}': ${err}`);
    }
});

export const renderIndex = Handlebars.compile<{}>(fs.readFileSync(`${TEMPLATE_DIR}/index.handlebars`).toString());
