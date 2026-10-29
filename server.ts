import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Persistent store setup
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'rsvps.json');
const EVENT_FILE = path.join(DATA_DIR, 'event.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface RSVP {
  id: string;
  name: string;
  phone?: string;
  foodChoice: 'veg' | 'non-veg';
  submittedAt: string;
}

export interface EventInfo {
  title: string;
  honorees: string;
  date: string;
  time: string;
  locationName: string;
  fullAddress: string;
}

const DEFAULT_EVENT_INFO: EventInfo = {
  title: "Farewell Party",
  honorees: "Yashvir Singh Sir & Suresh Kumar Sir",
  date: "30.10.2026 (Friday)",
  time: "12:00 PM Noon",
  locationName: "CHQ",
  fullAddress: "CHQ, Faridabad, Haryana"
};

const SEED_RSVPS: RSVP[] = [
  {
    id: "seed-1",
    name: "Aman Sharma",
    phone: "9812345678",
    foodChoice: "non-veg",
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "seed-2",
    name: "Priya Patel",
    phone: "9876512345",
    foodChoice: "veg",
    submittedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "seed-3",
    name: "Rahul Verma",
    phone: "9988776655",
    foodChoice: "non-veg",
    submittedAt: new Date().toISOString()
  }
];

function getRSVPs(): RSVP[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to read rsvps.json:", err);
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_RSVPS, null, 2));
  return SEED_RSVPS;
}

function saveRSVPs(rsvps: RSVP[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(rsvps, null, 2));
}

function getEventInfo(): EventInfo {
  try {
    if (fs.existsSync(EVENT_FILE)) {
      const data = fs.readFileSync(EVENT_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to read event.json:", err);
  }
  fs.writeFileSync(EVENT_FILE, JSON.stringify(DEFAULT_EVENT_INFO, null, 2));
  return DEFAULT_EVENT_INFO;
}

// API Routes
app.get('/api/event', (req, res) => {
  res.json(getEventInfo());
});

app.get('/api/rsvps', (req, res) => {
  const rsvps = getRSVPs();
  
  let vegCount = 0;
  let nonVegCount = 0;

  rsvps.forEach(r => {
    if (r.foodChoice === 'veg') vegCount++;
    else nonVegCount++;
  });

  res.json({
    rsvps,
    summary: {
      totalRSVPs: rsvps.length,
      vegPortions: vegCount,
      nonVegPortions: nonVegCount,
    }
  });
});

app.post('/api/rsvps', (req, res) => {
  const { name, phone, foodChoice } = req.body;
  if (!name || !foodChoice) {
    return res.status(400).json({ error: "Name and food choice (veg or non-veg) are required." });
  }

  const rsvps = getRSVPs();
  const existingIndex = rsvps.findIndex(
    r => r.name.trim().toLowerCase() === name.trim().toLowerCase()
  );

  const newRsvp: RSVP = {
    id: existingIndex >= 0 ? rsvps[existingIndex].id : 'rsvp-' + Date.now(),
    name: name.trim(),
    phone: phone ? phone.trim() : '',
    foodChoice: foodChoice === 'veg' ? 'veg' : 'non-veg',
    submittedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    rsvps[existingIndex] = newRsvp;
  } else {
    rsvps.unshift(newRsvp);
  }

  saveRSVPs(rsvps);
  res.status(200).json({ message: "Choice saved successfully!", rsvp: newRsvp });
});

app.delete('/api/rsvps/:id', (req, res) => {
  const { id } = req.params;
  let rsvps = getRSVPs();
  rsvps = rsvps.filter(r => r.id !== id);
  saveRSVPs(rsvps);
  res.json({ message: "RSVP removed" });
});

// Vite Middleware for Frontend Serving in Dev Mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await import('vite');
    const viteServer = await vite.createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(viteServer.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
