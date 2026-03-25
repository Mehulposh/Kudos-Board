import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import hpp from 'hpp'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

//env configuration
dotenv.config()

//server creation
const app = express()

//connection port number
const PORT = process.env.PORT || 8080

//DATA BASE URL
const MONGODB_URI = process.env.MONGODB_URI  

//FRONTEND URL
const CLIENT_URL = process.env.CLIENT_URL 

//middleware
app.use(hpp())
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});
 
const postLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  message: { error: 'Too many kudos posted. Please wait a bit!' },
});

app.use(globalLimiter);
app.use(express.json({ limit: '10kb' }));


// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});


// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});


// Error handler
app.use((err, req, res, _next) => {
  console.error("[ERROR]", err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

//health check
app.get('/api/health' , (req,res)=> {
    res.json({
        status: 'OK',
        message: 'Server connection healthy',
        timestamp: new Date().toISOString()
    })
})

// ── MongoDB connection + server start ─────────────────────────────────────────
async function start() {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    console.error("❌  JWT_SECRET and JWT_REFRESH_SECRET must be set in .env");
    process.exit(1);
  }

  try {
    console.log("⏳  Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log(`${new Date().toISOString()} ✅  MongoDB connected → ${mongoose.connection.name}`);

    app.listen(PORT, () => {
      console.log(`${new Date().toISOString()} 🚀  Server running on http://localhost:${PORT}`);
      console.log(`${new Date().toISOString()} 📡  Accepting requests from ${CLIENT_URL}`);
    });
  } catch (err) {
    console.error(`${new Date().toISOString()} ❌  Failed to connect to MongoDB:`, err.message);
    process.exit(1);
  }
}

//MONGOOSE CONNECTION
mongoose.connection.on("disconnected", () => console.warn(`${new Date().toISOString()} ⚠️  MongoDB disconnected`));
mongoose.connection.on("reconnected",  () => console.log(`${new Date().toISOString()} 🔄  MongoDB reconnected`));

start();