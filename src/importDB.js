import { get } from 'lodash/fp';
import config from 'config';
import DBClient from './services/dbClient';
import importDB from './import/db';
import prepareImport from './prepareImport';

const MYSQL_CONFIG = get('importDB.config', config);
const FIELDS_MAP = get('importDB.fieldsMap', config);
const QUERY = get('importDB.query', config);

const importFlow = async (dbClient, outputStream, query) => {
  await dbClient.startConnection();
  const queryStream = dbClient.getQueryStream(query);
  await importDB(outputStream, queryStream);
  await dbClient.closeConnection();
};

(async () => {
  const dbClient = new DBClient(MYSQL_CONFIG);

  try {
    const outputStream = await prepareImport(FIELDS_MAP);
    await importFlow(dbClient, outputStream, QUERY);
  } catch (error) {
    console.log(error);
  }
})();
