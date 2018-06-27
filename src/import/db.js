import stringer from 'csv-stringify';

const OUTPUT_DELIMITER = '\t';

export default (outputStream, queryStream) => {
  return new Promise((resolve, reject) => {
    console.info('Start import to clickhouse.');

    queryStream
      .pipe(
        stringer({
          delimiter: OUTPUT_DELIMITER,
        }),
      )
      .pipe(outputStream);

    outputStream.on('error', err => {
      reject(err);
    });
    outputStream.on('finish', result => {
      console.info('Finish import to clickhouse.');
      resolve(result);
    });
  });
};
