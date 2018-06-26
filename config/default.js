module.exports = {
  clickhouse: {
    config: {
      host: 'localhost',
      port: 8123,
      queryOptions: {
        database: 'test',
      },
    },
  },
  importFile: {
    hardImport: false,
    tableName: 'profiles',
    path: 'samples/purchases_sample.csv',
    fileFormatter: {
      inputDelimiter: ';',
      outputDelimiter: '\t',
    },
    format: 'TSV',
    fieldsMap: {
      purchase_id: 'String',
      customer_id: 'String',
      value: 'String',
      timestamp: 'DateTime',
      iso_8601: 'String',
    },
  },
};
