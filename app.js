import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//set the view engine
app.set('view engine', 'ejs');

const PORT = 3004;

/*========= DB connection pool =========*/
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

/*========= Variables =========*/
const users = [];
let currentUser= null;

/*========= Home Page Routes ============*/
app.get('/', (req,res) => {
    res.render('home-new');
});

app.post('/home-user', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const sql = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
        const [result] = await pool.execute(sql, [username, password, email]);

        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
        const userInfo = rows[0];

        res.render('home-user', { userInfo });
    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).send('Error creating account');
    }
});

/*========= Account Routes ============*/
app.get('/create-account', (req,res) => {
    res.render('create-account');
});

app.get('/login', (req,res) => {
    res.render('login');
});

/*========= Settings Routes ============*/
app.get('/settings', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users ORDER BY timestamp DESC LIMIT 1');
        
        if (rows.length === 0) {
            return res.redirect('/create-account');
        }

        res.render('settings', { userInfo: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading settings');
    }
});

// UPDATE USER (POST)
app.post('/update-settings', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const [lastUser] = await pool.query('SELECT id FROM users ORDER BY timestamp DESC LIMIT 1');
        const userId = lastUser[0].id;

        const sql = `UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?`;
        await pool.execute(sql, [username, email, password, userId]);

        res.redirect('/settings');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating account');
    }
});

// DELETE USER (POST)
app.post('/delete-account', async (req, res) => {
    try {
        const [lastUser] = await pool.query('SELECT id FROM users ORDER BY timestamp DESC LIMIT 1');
        if (lastUser.length > 0) {
            await pool.execute('DELETE FROM users WHERE id = ?', [lastUser[0].id]);
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting account');
    }
});

/*========= Listener ============*/
app.listen(PORT, () =>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})