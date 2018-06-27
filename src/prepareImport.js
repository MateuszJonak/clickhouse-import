import { get } from 'lodash/fp';
import config from 'config';
import ClickHouseClient from './services/clickhouseClient';

const CLICKHOUSE_CONFIG = get('clickhouse.config', config);
const IS_HARD_IMPORT = get('clickhouse.hardImport', config);
const TABLE_NAME = get('clickhouse.tableName', config);

export default async fieldsMap => {
  const clickHouseClient = new ClickHouseClient(CLICKHOUSE_CONFIG);

  try {
    if (IS_HARD_IMPORT) {
      await clickHouseClient.dropTable(TABLE_NAME);
    }
    await clickHouseClient.createTable(TABLE_NAME, fieldsMap);
  } catch (error) {
    return Promise.reject(error);
  }

  return clickHouseClient.getOutputStream(TABLE_NAME);
};
