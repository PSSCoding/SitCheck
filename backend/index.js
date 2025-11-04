import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config(); // Lädt die Variablen aus .env
if (typeof process.env.DATABASE_URL !== "string" || process.env.DATABASE_URL.trim() === "") {
  console.error(
    "Umgebungsvariable DATABASE_URL fehlt oder ist ungültig. Stelle sicher, dass sie in .env gesetzt ist.",
  );
  process.exit(1);
}
console.log("DB URL gefunden, erster Teil:", process.env.DATABASE_URL.slice(0, 20), "..."); // Truncated for safety

const { Pool } = pkg;
const app = express();

let latestAveragePersons = null;
let latestAverageUpdatedAt = null;

app.use(cors());
app.use(express.json());

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
          `Eintrag ${index} aus ai_detection wird ignoriert (value: ${rawValue}, timestamp: ${rawTimestamp}).`,
        );
        return null;
      }

      return { value, timestamp };
    })
    .filter(Boolean);

  if (normalizedEntries.length === 0) {
    throw new Error("Es wurden keine gültigen Einträge in ai_detection gefunden.");
  }

  // Die SQL-Query liefert bereits DESC, wir halten die Reihenfolge für zusätzliche Sicherheit ein.
  normalizedEntries.sort((a, b) => b.timestamp - a.timestamp);

  const sum = normalizedEntries.reduce((acc, entry) => acc + entry.value, 0);
  const average = Number((sum / normalizedEntries.length).toFixed(2));

  return {
    averagePersons: average,
    latestTimestamp: normalizedEntries[0].timestamp.toISOString(),
  };
}

// PostgreSQL-Verbindung
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log(
  "Endpoints bereit: GET /api/users, POST /api/users, GET /api/test, GET /api/occupancy",
);

async function refreshAveragePersons() {
  try {
    console.log("[occupancy] refreshAveragePersons triggered at", new Date().toISOString());
    const { rows } = await pool.query(
      `SELECT estimated_actual_persons, timestamp
       FROM ai_detection
       ORDER BY timestamp DESC
       LIMIT 10`,
    );
    console.log("[occupancy] rows:", rows);

    const { averagePersons, latestTimestamp } = validateAndComputeAverage(rows);

    latestAveragePersons = averagePersons;
    latestAverageUpdatedAt = latestTimestamp;
    console.log("[occupancy] latestAveragePersons:", latestAveragePersons, "latestAverageUpdatedAt:", latestAverageUpdatedAt);
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


// ===== SERVER START =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
