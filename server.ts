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

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'rsvps.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Reset file to empty []
fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));

export interface RSVP {
  id: string;
  name: string;
  phone?: string;
  attending: boolean;
  foodChoice?: 'veg' | 'non-veg';
  submittedAt: string;
}

function getRSVPs(): RSVP[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to read rsvps.json:", err);
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  return [];
}

function saveRSVPs(rsvps: RSVP[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(rsvps, null, 2));
}

// API Routes
app.get('/api/event', (req, res) => {
  res.json({
    title: "Farewell Party",
    honorees: "Yashvir Singh Sir & Suresh Kumar Sir",
    date: "30.10.2026 (Friday)",
    time: "12:00 PM Noon",
    locationName: "CHQ, Faridabad",
  });
});

app.get('/api/rsvps', (req, res) => {
  const rsvps = getRSVPs();
  
  let attendingCount = 0;
  let vegCount = 0;
  let nonVegCount = 0;

  rsvps.forEach(r => {
    if (r.attending) {
      attendingCount++;
      if (r.foodChoice === 'veg') vegCount++;
      else if (r.foodChoice === 'non-veg') nonVegCount++;
    }
  });

  res.json({
    rsvps,
    summary: {
      totalRSVPs: rsvps.length,
      attendingCount,
      vegPortions: vegCount,
      nonVegPortions: nonVegCount,
    }
  });
});

app.post('/api/rsvps', (req, res) => {
  const { name, phone, attending, foodChoice } = req.body;
  if (!name || attending === undefined) {
    return res.status(400).json({ error: "Name and attendance status are required." });
  }

  const rsvps = getRSVPs();
  const existingIndex = rsvps.findIndex(
    r => r.name.trim().toLowerCase() === name.trim().toLowerCase()
  );

  const isAttending = Boolean(attending);

  const newRsvp: RSVP = {
    id: existingIndex >= 0 ? rsvps[existingIndex].id : 'rsvp-' + Date.now(),
    name: name.trim(),
    phone: phone ? phone.trim() : '',
    attending: isAttending,
    foodChoice: isAttending ? (foodChoice === 'veg' ? 'veg' : 'non-veg') : undefined,
    submittedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    rsvps[existingIndex] = newRsvp;
  } else {
    rsvps.unshift(newRsvp);
  }

  saveRSVPs(rsvps);
  res.status(200).json({ message: "Saved successfully!", rsvp: newRsvp });
});

app.delete('/api/rsvps/:id', (req, res) => {
  const { id } = req.params;
  let rsvps = getRSVPs();
  rsvps = rsvps.filter(r => r.id !== id);
  saveRSVPs(rsvps);
  res.json({ message: "RSVP removed" });
});

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
