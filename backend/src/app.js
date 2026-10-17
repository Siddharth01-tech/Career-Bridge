const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authroutes');
const candidateRoutes = require('./routes/candidateroutes');
const companyRoutes = require('./routes/companyroutes');
const jobRoutes = require('./routes/jobroutes');
const applicationRoutes = require('./routes/applicationroutes');
const adminRoutes = require('./routes/adminroutes');

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl) and any localhost/127.0.0.1 origin
        if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Career Bridge API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;
