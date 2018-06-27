import mysql from 'mysql';

export default class DBClient {
  constructor(params) {
    this.client = mysql.createConnection(params);
    this.client.on('error', err => console.error(err));
  }

  startConnection() {
    return new Promise((resolve, reject) => {
      console.info('Start connection with database.');
      this.client.connect(error => {
        if (error) {
          console.error(error);
          return reject(error);
        }

        return resolve();
      });
    });
  }

  closeConnection() {
    return new Promise((resolve, reject) => {
      console.info('Close connection with database.');
      this.client.end(error => {
        if (error) {
          console.error(error);
          return reject(error);
        }

        return resolve();
      });
    });
  }

  getQueryStream(query) {
    return this.client.query(query).stream({ highWaterMark: 5 });
  }
}
