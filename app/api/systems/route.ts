import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const queryString = `
      SELECT * FROM hotel_systems;
    `;

    const results = await query("control_panel", queryString, []);

    return new NextResponse(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    let error_response = {
      status: "error",
      message: error.message,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      hotel_name,
      subdomain,
      contact_name,
      contact_email,
      contact_phone,
      password,
    } = await req.json();

    console.log(subdomain);

    const hashedPassword = await bcrypt.hash(password, 10);

    // console.log(
    //   hotel_name,
    //   subdomain,
    //   contact_name,
    //   contact_email,
    //   contact_phone,
    //   hashedPassword
    // );

    // Check if the database already exists

    const checkIfDatabaseExistsQueryString = `
      SELECT SCHEMA_NAME
        FROM INFORMATION_SCHEMA.SCHEMATA
        WHERE SCHEMA_NAME = '${subdomain}'
    `;

    const checkIfDatabaseExistsResults = (await query(
      "control_panel",
      checkIfDatabaseExistsQueryString,
      []
    )) as [];

    if (checkIfDatabaseExistsResults.length > 0) {
      return new NextResponse(
        JSON.stringify({
          status: "fail",
          message: "Database already exists, please give a different name",
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create new database for the hotel system

    const createDatabaseQueryString = `
      CREATE DATABASE IF NOT EXISTS ${subdomain};
    `;

    await query("control_panel", createDatabaseQueryString, []);

    // Insert new hotel system data into control panel database

    const insertNewHotelIntoControlPanelString = `
      INSERT INTO hotel_systems (name, subdomain, contact_name, contact_email, contact_phone) VALUES (?, ?, ?, ?, ?);
    `;

    await query("control_panel", insertNewHotelIntoControlPanelString, [
      hotel_name,
      subdomain,
      contact_name,
      contact_email,
      contact_phone,
    ]);

    // create user table in the new hotels database

    const createTableQueryString = `
      CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone_number VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `;

    await query(subdomain, createTableQueryString, []);

    // Insert new user into the new hotels database

    const insertQueryString = `
      INSERT INTO users (name, email, phone_number, password)
      VALUES (?, ?, ?, ?);
    `;

    const results = await query(subdomain, insertQueryString, [
      contact_name,
      contact_email,
      contact_phone,
      hashedPassword,
    ]);

    // create guests table in the new hotels database

    const createGuestsTableQueryString = `
      CREATE TABLE IF NOT EXISTS guests (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        id_number VARCHAR(255) NOT NULL,
    `;

    await query(hotel_name, createGuestsTableQueryString, []);

    return new NextResponse(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      let error_response = {
        status: "fail",
        message: "Database already exists, please give a different name",
      };
      return new NextResponse(JSON.stringify(error_response), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    let error_response = {
      status: "error",
      message: error.message,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
