require("dotenv").config({ path: ".env.local" });
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migratePasswords() {
  try {

    // ambil semua user
    const result = await pool.query(`
      SELECT email, password
      FROM pengguna
    `);

    for (const user of result.rows) {

      const plainPassword = user.password;

      // skip kalau sudah hash bcrypt
      if (plainPassword.startsWith("$2b$")) {
        console.log(`${user.email} already hashed`);
        continue;
      }

      // hash password
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // update database
      await pool.query(
        `
        UPDATE pengguna
        SET password = $1
        WHERE email = $2
        `,
        [hashedPassword, user.email]
      );

      console.log(`${user.email} migrated`);
    }

    console.log("Migration selesai");
    process.exit(0);

  } catch (err) {

    console.error(err);
    process.exit(1);

  }
}

migratePasswords();