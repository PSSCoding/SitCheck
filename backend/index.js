import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config(); // Lädt die Variablen aus .env
console.log("DB URL:", process.env.DATABASE_URL);

const { Pool } = pkg;
const app = express();

let latestAveragePersons = null;
let latestAverageUpdatedAt = null;

app.use(cors());
app.use(express.json());

// PostgreSQL-Verbindung
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log(
  "Endpoints bereit: GET /api/users, POST /api/users, GET /api/test, GET /api/occupancy",
);

async function refreshAveragePersons() {
  try {
    const { rows } = await pool.query(
      `SELECT estimated_actual_persons
       FROM correlated_persons
       ORDER BY timestamp DESC
       LIMIT 10`,
    );

    const values = rows
      .map((row) => Number(row.estimated_actual_persons))
      .filter((value) => Number.isFinite(value));

    if (values.length === 0) {
      console.warn("Keine gültigen Daten für die Personenanzahl gefunden.");
      return;
    }

    const sum = values.reduce((acc, value) => acc + value, 0);
    latestAveragePersons = Number((sum / values.length).toFixed(2));
    latestAverageUpdatedAt = new Date().toISOString();
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Personenanzahl:", error);
  }
}

refreshAveragePersons().catch((error) => {
  console.error("Initiale Aktualisierung der Personenanzahl fehlgeschlagen:", error);
});

setInterval(() => {
  refreshAveragePersons().catch((error) => {
    console.error("Intervall-Aktualisierung der Personenanzahl fehlgeschlagen:", error);
  });
}, 60 * 1000);


// ===== TEST ENDPOINT =====
app.get("/api/test", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.json({ time: rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB-Verbindung fehlgeschlagen" });
  }
});

app.get("/api/occupancy", (req, res) => {
  if (latestAveragePersons === null) {
    return res
      .status(503)
      .json({ error: "Noch keine Auslastungsdaten verfügbar." });
  }

  res.json({
    averagePersons: latestAveragePersons,
    lastUpdated: latestAverageUpdatedAt,
  });
});

// ===== USER ROUTES =====

// Neuen User anlegen
app.post("/api/users", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Alle Felder müssen ausgefüllt sein" });
  }

  try {
    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // Unique violation (z.B. Email bereits vorhanden)
      res.status(409).json({ error: "Email existiert bereits" });
    } else {
      res.status(500).json({ error: "Fehler beim Anlegen des Users" });
    }
  }
});

// Alle User abrufen (ohne Passwort)
app.get("/api/users", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT id, name, email FROM users");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Abrufen der Users" });
  }
});

// LOGIN ENDPOINT
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // Pflichtfelder prüfen
  if (!email || !password) {
    return res.status(400).json({ error: "Email und Passwort müssen angegeben werden" });
  }

  try {
    // User anhand Email suchen
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "User nicht gefunden" });
    }

    const user = rows[0];

    // Passwort prüfen
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Falsches Passwort" });
    }

    // Login erfolgreich → User-Daten zurückgeben (ohne Passwort)
    res.json({ id: user.id, name: user.name, email: user.email });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Login" });
  }
});


// ===== SERVER START =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
