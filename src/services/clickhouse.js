import ClickHouse from '@apla/clickhouse';
import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import parser from 'csv-parse';
import stringer from 'csv-stringify';
import pumpify from 'pumpify';
import config from 'config';
import { get } from 'lodash/fp';
import fieldsMapToValues from './fieldsMapToValues';
import { getDropQuery, getCreateTable } from './query';

const INPUT_DELIMITER = get('importFile.fileFormatter.inputDelimiter', config);
const OUTPUT_DELIMITER = get(
  'importFile.fileFormatter.outputDelimiter',
  config,
);
const CLICKHOUSE_IMPORT_FORMAT = get('importFile.format', config);

const FILE_FORMATTER_STREAMS = [
  parser({ delimiter: INPUT_DELIMITER, from: 2 }),
  stringer({
    delimiter: OUTPUT_DELIMITER,
  }),
];

export default class ClickHouseClient {
  constructor(params) {
    this.client = new ClickHouse(params);
  }

  dropTable(tableName) {
    const query = getDropQuery({ tableName });
    return this.client.querying(query);
  }

  createTable(tableName, fieldsMap) {
    const valuesQuery = fieldsMapToValues(fieldsMap);
    const query = getCreateTable({ tableName, valuesQuery });

    return this.client.querying(query);
  }

  importFile(tableName, filePath) {
    const streams = [];
    const isZip = path.extname(filePath) === '.gz';

    if (isZip) {
      streams.push(zlib.createUnzip());
    }
    return new Promise((resolve, reject) => {
      const inputStream = fs.createReadStream(filePath);
      const outputStream = this.client.query(`INSERT INTO ${tableName} `, {
        inputFormat: CLICKHOUSE_IMPORT_FORMAT,
      });

      inputStream.pipe(
        pumpify(...streams, ...FILE_FORMATTER_STREAMS, outputStream),
      );

      outputStream.on('error', err => {
        reject(err);
      });
      outputStream.on('end', result => {
        console.log('finish');
        resolve(result);
      });
    });
  }
}
