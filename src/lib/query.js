export const getDropQuery = ({ tableName }) =>
  `DROP TABLE IF EXISTS ${tableName}`;
export const getCreateTable = ({ tableName, valuesQuery }) =>
  `CREATE TABLE IF NOT EXISTS ${tableName} (${valuesQuery}) ENGINE = Log;`;
