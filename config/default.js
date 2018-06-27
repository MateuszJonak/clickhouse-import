module.exports = {
  clickhouse: {
    config: {
      host: 'localhost',
      port: 8123,
      queryOptions: {
        database: 'test',
      },
    },
    hardImport: false,
    tableName: 'profiles',
  },
  importFile: {
    path: 'samples/purchases_sample.csv',
    fileDelimiter: ';',
    fieldsMap: {
      purchase_id: 'String',
      customer_id: 'String',
      value: 'String',
      timestamp: 'DateTime',
      iso_8601: 'String',
    },
  },
  importDB: {
    config: {
      host: 'localhost',
      user: 'root',
      password: 'pass',
      database: 'test',
      typeCast: true,
    },
    fieldsMap: {
      purchase_id: 'String',
      customer_id: 'String',
      value: 'String',
      timestamp: 'DateTime',
      iso_8601: 'String',
    },
    query: '',
  },
};
