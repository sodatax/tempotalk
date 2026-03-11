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

app.get('/db-test', async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.send(users[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Database error: ' + err.message);
    }
});

/*========= Variables =========*/
const users = [];
let currentUser= null;

/*========= Home Page Routes ============*/
app.get('/', (req,res) => {
    res.render('home-new');
});

app.get('/admin', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT * FROM users ORDER BY timestamp DESC');
        res.render('admin', { users });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading users: ' + err.message);
    }
});

app.get('/home-user', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users ORDER BY id DESC LIMIT 1');
        const userInfo = rows[0];

        if (!userInfo) {
            return res.redirect('/create-account');
        }

        res.render('home-user', { userInfo });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error loading dashboard');
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
        const [rows] = await pool.query('SELECT * FROM users ORDER BY id DESC LIMIT 1');
        const userInfo = rows[0];

        if (!userInfo) {
            return res.redirect('/create-account');
        }

        res.render('settings', { userInfo });
    } catch (err) {
        res.status(500).send("Error loading settings");
    }
});

app.post('/in-account', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const sql = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
        const [result] = await pool.execute(sql, [username, password, email]);

        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
        const userInfo = rows[0];

        res.render('account-summary', { userInfo });
    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).send('Error creating account in database');
    }
});

app.post('/update-settings', (req, res) => {
    if (!currentUser) {
        return res.redirect('/login');
    }

    const { username, email, password } = req.body;

    // update only if field was filled in
    if (username && username.trim() !== "") {
        currentUser.username = username;
    }

    if (email && email.trim() !== "") {
        currentUser.email = email;
    }

    if (password && password.trim() !== "") {
        currentUser.password = password;
    }

    // update timestamp
    currentUser.timestamp = new Date();

    console.log("Updated user:", currentUser);

    res.redirect('/settings');
});

app.post('/delete-account', (req, res) => {
    console.log("Account deletion request received.");

    res.redirect('/'); 
});

/*========= Listener ============*/
app.listen(PORT, () =>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})