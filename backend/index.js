require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactRoutes = require('./src/routes/contactRoutes');

const app = express();
const port = process.env.PORT || 5000;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.error('❌ Error: SUPABASE_URL or SUPABASE_KEY is missing from .env file');
} else {
    console.log('✅ Supabase credentials loaded');
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contact', contactRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
