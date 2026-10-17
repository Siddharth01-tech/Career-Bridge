const app = require('./src/app');
const pool = require('./src/config/db');
const initDatabase = require('./src/config/init_db');
const PORT = process.env.PORT || 5000;

initDatabase();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

