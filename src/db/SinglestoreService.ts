import mysql from "mysql2/promise";
require("dotenv").config();

const HOST = "<DB_HOST>";
const PORT = "3306";
const USERNAME = "<DB_USERNAME>";
const PASSWORD = "<DB_PASSWORD>";
const DATABASE = "<DB_NAME>";

export class SinglestoreService {
  private connection: any;

  async setConnection() {
    try {
      console.log("connecting to host ", HOST, USERNAME);
      this.connection = await mysql.createConnection({
        host: HOST,
        user: USERNAME,
        port: Number(PORT),
        password: PASSWORD,
        database: DATABASE,
      });
    } catch (err) {
      console.error(`Failed to connect to SS. Error: ${err} `);
      throw err;
    }
  }

  async readSmallMessagesById(id: number) {
    return new Promise<string | void>(async (resolve, reject) => {
      console.log("small_messages get by id: ", id);
      this.connection
        .execute("SELECT * FROM small_messages WHERE id = ?", [id])
        .then(([rows, fields]) => {
          console.log("small_messages output ->", rows);
          resolve(rows);
        })
        .catch((err) => {
          console.log(`error while reading from SS db small_messages: ${err}`);
          reject(err);
        });
    });
  }
  async readJsonMessages() {
    return new Promise<string | void>(async (resolve, reject) => {
      console.log("Json_messages");
      this.connection
        .execute("SELECT * FROM json_messages limit 1")
        .then(([rows, fields]) => {
          console.log("Json_messages output ->", JSON.stringify(rows));
          resolve(rows);
        })
        .catch((err) => {
          console.log(`error while reading from SS db Json_messages: ${err}`);
          reject(err);
        });
    });
  }
  async readLargeJsonMessages() {
    return new Promise<string | void>(async (resolve, reject) => {
      console.log("Large_json_messages");
      this.connection
        .execute("SELECT * FROM large_json_messages limit 1")
        .then(([rows, fields]) => {
          console.log("Large_json_messages output ->", JSON.stringify(rows));
          resolve(rows);
        })
        .catch((err) => {
          console.log(
            `error while reading from SS db Large_json_messages: ${err}`,
          );
          reject(err);
        });
    });
  }
  async readPassageMessages() {
    return new Promise<string | void>(async (resolve, reject) => {
      console.log("Passage_messages");
      this.connection
        .execute("SELECT * FROM passage_messages limit 1")
        .then(([rows, fields]) => {
          console.log("Passage_messages output ->", rows);
          resolve(rows);
        })
        .catch((err) => {
          console.log(
            `error while reading from SS db Passage_messages: ${err}`,
          );
          reject(err);
        });
    });
  }
  async readLargePassageMessages() {
    return new Promise<string | void>(async (resolve, reject) => {
      console.log("Large_passage_messages get");
      this.connection
        .execute("SELECT * FROM large_passage_messages limit 1")
        .then(([rows, fields]) => {
          console.log("Large_passage_messages output ->", rows);
          resolve(rows);
        })
        .catch((err) => {
          console.log(
            `error while reading from SS db Large_passage_messages: ${err}`,
          );
          reject(err);
        });
    });
  }

  async writeTosmall_messages(data: any) {
    return new Promise<string | void>(async (resolve, reject) => {
      console.log("write to small_messages table");
      this.connection
        .execute("insert into small_messages values(?,?,?) ", [
          data.id,
          data.phone,
          data.name,
        ])
        .then(([rows, fields]) => {
          console.log("successfully written to table ->small_messages", rows);
          resolve(rows);
        })
        .catch((err) => {
          console.log(`error while ready from SS db: ${err}`);
          reject(err);
        });
    });
  }
  async writeTojson_messages(data: any) {
    return new Promise<string | void>(async (resolve, reject) => {
      console.log("write to json_messages table");
      this.connection
        .execute("insert into json_messages values(uuid(), ?) ", [data])
        .then(([rows, fields]) => {
          console.log("successfully written to table json_messages ->", rows);
          resolve(rows);
        })
        .catch((err) => {
          console.log(`error while ready from SS db: ${err}`);
          reject(err);
        });
    });
  }
  async writeTolarge_json_messages(data: any) {
    return new Promise<string | void>(async (resolve, reject) => {
      console.log("write to large_json_messages table");
      this.connection
        .execute("insert into large_json_messages values(uuid(), ?) ", [data])
        .then(([rows, fields]) => {
          console.log(
            "successfully written to table ->large_json_messages",
            rows,
          );
          resolve(rows);
        })
        .catch((err) => {
          console.log(`error while ready from SS db: ${err}`);
          reject(err);
        });
    });
  }
  async writeTopassage_messages(data: string) {
    return new Promise<string | void>(async (resolve, reject) => {
      console.log("write to passage_messages table");
      this.connection
        .execute("insert into passage_messages values(?) ", [data])
        .then(([rows, fields]) => {
          console.log("successfully written to table ->passage_messages", rows);
          resolve(rows);
        })
        .catch((err) => {
          console.log(`error while ready from SS db: ${err}`);
          reject(err);
        });
    });
  }
  async writeTolarge_passage_messages(data: string) {
    return new Promise<string | void>(async (resolve, reject) => {
      console.log("write to large_passage_messages table");
      this.connection
        .execute("insert into large_passage_messages values(?) ", [data])
        .then(([rows, fields]) => {
          console.log(
            "successfully written to table ->large_passage_messages ",
            rows,
          );
          resolve(rows);
        })
        .catch((err) => {
          console.log(`error while ready from SS db: ${err}`);
          reject(err);
        });
    });
  }

  async closeConnection() {
    try {
      await this.connection.end();
    } catch (err) {
      console.error(`Failed to fetch objects list from SS. Error: ${err} `);
      throw err;
    }
  }
}
