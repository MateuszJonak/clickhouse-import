import { get } from 'lodash/fp';
import config from 'config';

import prepareImport from './prepareImport';
import importFile from './import/file';

const PATH = get('importFile.path', config);
const FIELDS_MAP = get('importFile.fieldsMap', config);

(async () => {
  try {
    const outputStream = await prepareImport(FIELDS_MAP);
    await importFile(outputStream, PATH);
  } catch (error) {
    console.log(error);
  }
})();
