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
    console.log("1");

    const {
      hotel_name,
      subdomain,
      contact_name,
      contact_email,
      contact_phone,
      password,
    } = await req.json();

    console.log("2");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("2.5");
    console.log(
      hotel_name,
      subdomain,
      contact_name,
      contact_email,
      contact_phone,
      hashedPassword
    );
    console.log("3");

    // Create new database for the hotel system

    const createDatabaseQueryString = `
      CREATE DATABASE IF NOT EXISTS ${subdomain};
    `;
    console.log("4");

    await query("control_panel", createDatabaseQueryString, []);

    console.log("5");
    // Insert new hotel system data into control panel database

    console.log("6");
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
    console.log(error_response);
    return new NextResponse(JSON.stringify(error_response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
