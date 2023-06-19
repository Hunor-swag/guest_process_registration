import { createConnection, Connection } from "mysql2/promise";

export async function query(
  databaseName: string,
  query: string,
  values: any[]
) {
  try {
    const connection: Connection = await createConnection({
      host: process.env.NEXT_PUBLIC_MYSQL_DATABASE_HOST || "localhost",
      port: process.env.NEXT_PUBLIC_MYSQL_DATABASE_PORT
        ? parseInt(process.env.NEXT_PUBLIC_MYSQL_DATABASE_PORT)
        : 3306,
      user: process.env.NEXT_PUBLIC_MYSQL_DATABASE_USER,
      password: process.env.NEXT_PUBLIC_MYSQL_DATABASE_PASSWORD,
      database: databaseName,
    });

    const [results] = await connection.execute(query, values);
    connection.end();
    // console.log("Data successfully fetched:\n", results);
    return results;
  } catch (error) {
    console.error("Failed to fetch data from the database:\n\n\n", error);
    throw error;
  }
}
