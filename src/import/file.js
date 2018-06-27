import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import pumpify from 'pumpify';
import parser from 'csv-parse';
import config from 'config';
import { get } from 'lodash/fp';
import stringer from 'csv-stringify';

const INPUT_DELIMITER = get('importFile.fileDelimiter', config);
const OUTPUT_DELIMITER = '\t';
const FILE_FORMATTER_STREAMS = [
  parser({ delimiter: INPUT_DELIMITER, from: 2 }),
  stringer({
    delimiter: OUTPUT_DELIMITER,
  }),
];

export default (outputStream, filePath) => {
  const streams = [];
  const isZip = path.extname(filePath) === '.gz';

  if (isZip) {
    streams.push(zlib.createUnzip());
  }
  return new Promise((resolve, reject) => {
    console.info('Start import to clickhouse.');
    const inputStream = fs.createReadStream(filePath);

    inputStream.pipe(
      pumpify(...streams, ...FILE_FORMATTER_STREAMS, outputStream),
    );

    outputStream.on('error', err => {
      reject(err);
    });
    outputStream.on('finish', result => {
      console.info('Finish import to clickhouse.');
      resolve(result);
    });
  });
};
