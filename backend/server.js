const app = require('./src/app');
const pool=require('./src/config/db')
const PORT = process.env.PORT || 5000;

pool.query('SELECT NOW()')

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
