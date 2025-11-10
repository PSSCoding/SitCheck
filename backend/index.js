import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

// Lade Umgebungsvariablen und beende früh, falls die DB-Konfiguration fehlt.
dotenv.config();
if (typeof process.env.DATABASE_URL !== "string" || process.env.DATABASE_URL.trim() === "") {
  console.error(
    "Umgebungsvariable DATABASE_URL fehlt oder ist ungültig. Stelle sicher, dass sie in .env gesetzt ist.",
  );
  process.exit(1);
}
console.log("DB URL gefunden, erster Teil:", process.env.DATABASE_URL.slice(0, 20), "..."); // Truncated for safety

const { Pool } = pkg;
const app = express();

const HISTORY_LIMIT = 20;

app.use(cors());
app.use(express.json());

// Normalisiert die Datenbankwerte und berechnet daraus einen stabilen Durchschnitt.
function validateAndComputeAverage(rows) {
  if (!Array.isArray(rows)) {
    throw new Error("Unerwartetes Datenformat: rows ist nicht vom Typ Array.");
  }

  const normalizedEntries = rows
    .map((row, index) => {
      const rawValue = row?.estimated_actual_persons;
      const rawTimestamp = row?.timestamp;

      const value = Number(rawValue);
      const timestamp = rawTimestamp ? new Date(rawTimestamp) : null;

      const isValidTimestamp = timestamp instanceof Date && !Number.isNaN(timestamp.valueOf());

      if (!Number.isFinite(value) || !isValidTimestamp) {
        console.warn(
          `Eintrag ${index} aus correlated_persons wird ignoriert (value: ${rawValue}, timestamp: ${rawTimestamp}).`,
        );
        return null;
      }

      return { value, timestamp };
    })
    .filter(Boolean);

  if (normalizedEntries.length === 0) {
    throw new Error("Es wurden keine gültigen Einträge in correlated_persons gefunden.");
  }

  // Die SQL-Query liefert bereits DESC, wir halten die Reihenfolge für zusätzliche Sicherheit ein.
  normalizedEntries.sort((a, b) => b.timestamp - a.timestamp);

  const sum = normalizedEntries.reduce((acc, entry) => acc + entry.value, 0);
  const average = Number((sum / normalizedEntries.length).toFixed(2));

  return {
    averagePersons: average,
    latestTimestamp: normalizedEntries[0].timestamp.toISOString(),
    normalizedEntries,
  };
}

// PostgreSQL-Verbindung
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log(
  "Endpoints bereit: GET /api/users, POST /api/users, GET /api/test, GET /api/occupancy",
);

// Lädt die letzten Messpunkte und aktualisiert den zwischengespeicherten Auslastungswert.
async function fetchOccupancySnapshot(limit = HISTORY_LIMIT) {
  try {
    const { rows } = await pool.query(
      `SELECT total_persons AS estimated_actual_persons, timestamp
       FROM room_state
       ORDER BY timestamp DESC
       LIMIT $1`,
      [limit],
    );

    const { averagePersons, latestTimestamp, normalizedEntries } =
      validateAndComputeAverage(rows);

    return {
      averagePersons,
      latestTimestamp,
      normalizedEntries,
      currentPersons: normalizedEntries[0]?.value ?? null,
    };
  } catch (error) {
    console.error("Fehler beim Laden der Raumhistorie:", error);
    throw error;
  }
}

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

app.get("/api/occupancy", async (req, res) => {
  console.log("[occupancy] request received at", new Date().toISOString());
  try {
    const snapshot = await fetchOccupancySnapshot(HISTORY_LIMIT);
    const history = snapshot.normalizedEntries
      .map(({ value, timestamp }) => ({
        persons: value,
        timestamp: timestamp.toISOString(),
      }))
      .reverse();

    res.json({
      averagePersons: snapshot.averagePersons,
      currentPersons: snapshot.currentPersons,
      lastUpdated: snapshot.latestTimestamp,
      history,
    });
  } catch (error) {
    res
      .status(503)
      .json({ error: "Noch keine Auslastungsdaten verfügbar." });
  }
});


// ===== SERVER START =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
