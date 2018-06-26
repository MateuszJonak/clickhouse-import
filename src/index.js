import ClickHouseService from './services/clickhouse';
import { get } from 'lodash/fp';
import config from 'config';

const CLICKHOUSE_CONFIG = get('clickhouse.config', config);
const TABLE_NAME = get('importFile.tableName', config);
const PATH = get('importFile.path', config);
const FIELDS_MAP = get('importFile.fieldsMap', config);
const IS_HARD_IMPORT = get('importFile.hardImport', config);

(async () => {
  const clickHouseService = new ClickHouseService(CLICKHOUSE_CONFIG);

  try {
    if (IS_HARD_IMPORT) {
      await clickHouseService.dropTable(TABLE_NAME);
    }
    await clickHouseService.createTable(TABLE_NAME, FIELDS_MAP);
    await clickHouseService.importFile(TABLE_NAME, PATH);
  } catch (error) {
    console.log(error);
  }
})();
