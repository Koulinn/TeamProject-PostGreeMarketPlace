import fs from "fs-extra";
import { join } from "path";
import db from "../conn.js";

const sqlFilePath = join(process.cwd(), "src/SQL/scripts.sql");

const createTables = async () => {
  try {
    const sqlCommandBuffer = await fs.readFile(sqlFilePath);
    const sqlCommandStringified = sqlCommandBuffer.toString();

    // await db.query(sqlCommandStringified);
    console.log("table created");
  } catch (error) {
    console.log(error);
    console.log("from create tables");
  }
};

export default createTables;
