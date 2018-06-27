import ClickHouse from '@apla/clickhouse';
import fieldsMapToValues from '../lib/fieldsMapToValues';
import { getDropQuery, getCreateTable } from '../lib/query';

export default class ClickHouseClient {
  constructor(params) {
    this.client = new ClickHouse(params);
  }

  dropTable(tableName) {
    console.info(`Drop table "${tableName}" if exist`);
    const query = getDropQuery({ tableName });
    return this.client.querying(query);
  }

  createTable(tableName, fieldsMap) {
    console.info(`Create table "${tableName}" if not exist`);
    const valuesQuery = fieldsMapToValues(fieldsMap);
    const query = getCreateTable({ tableName, valuesQuery });

    return this.client.querying(query);
  }

  getOutputStream(tableName) {
    return this.client.query(`INSERT INTO ${tableName} `, {
      inputFormat: 'TSV',
    });
  }
}
