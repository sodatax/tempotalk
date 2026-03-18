import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
import {validateNewAccount} from './validation.js';
import {validateAccount} from './validation.js';
import {validatePost} from './validation.js';

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
let currentUser= null;

/*========= Home Page Routes ============*/
app.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT posts.id, posts.title, users.username
            FROM posts
            JOIN users ON posts.user_id = users.id
            ORDER BY posts.created_at DESC`;

        const [posts] = await pool.query(sql);

        res.render('home-new', { posts });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading posts");
    }
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

app.get('/home-user/:username', async (req, res) => {
    try {
        const targetName = req.params.username;

        const sql = 'SELECT * FROM users WHERE username = ?';
        const [rows] = await pool.query(sql, [targetName]);
        const userInfo = rows[0];

        if (!userInfo) {
            return res.redirect('/login');
        }

        const sql_posts = `
        SELECT posts.id, posts.title, users.username
        FROM posts
        JOIN users ON posts.user_id = users.id
        ORDER BY posts.created_at DESC`;

        const [posts] = await pool.query(sql_posts);

        res.render('home-user', { userInfo, posts });
    } catch (err) {
        console.error('Error fetching user for dashboard:', err);
        res.status(500).send('Internal Server Error');
    }
});

/*========= Account Routes ============*/
app.get('/create-account', (req,res) => {
    res.render('create-account');
});

app.get('/login', (req, res) => {
    const errorMsg = req.query.error ? 'Invalid username or password.' : null;
    res.render('login', { error: errorMsg });
});

app.post('/login', async (req, res) => {
    try {

        const accountData = req.body;

        const valid = validateAccount(accountData);
        if (!valid.isValid) {
            res.render('login', {errors: valid.errors});
            return;
        }

        const username = accountData.username || null;
        const password = accountData.password || null;

        const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
        const [rows] = await pool.execute(sql, [username, password]);

        const sql_posts = `
            SELECT posts.id, posts.title, users.username
            FROM posts
            JOIN users ON posts.user_id = users.id
            ORDER BY posts.created_at DESC`;
        const [posts] = await pool.query(sql_posts);

        if (rows.length > 0) {
            const userInfo = rows[0];
            currentUser = userInfo;
            res.render('home-user', { userInfo, posts });
        } else {
            res.redirect('/login?error=true');
        }
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).send('Database error');
    }
});

app.get('/logout', (req, res) => {
    currentUser = null;
    res.redirect('/');
});

/*========= Settings Routes ============*/
// Add :id to the path
app.get('/settings/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        const userInfo = rows[0];

        if (!userInfo) {
            return res.redirect('/login');
        }

        res.render('settings', { userInfo });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading settings");
    }
});

app.post('/in-account', async (req, res) => {
    try {
        
        const accountData = req.body;

        const valid = validateNewAccount(accountData);
        if (!valid.isValid) {
            res.render('create-account', {errors: valid.errors});
            return;
        }

        const username = accountData.username || null;
        const password = accountData.password || null;
        const email = accountData.email || null;

        const checkSql = `SELECT * FROM users WHERE username = ?`;
        const [existingUsers] = await pool.execute(checkSql, [username]);

        if (existingUsers.length > 0) {
            return res.render('create-account', {
                errors: ["Username is already taken"]
            });
        }

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

app.post('/delete-account', async(req, res) => {
    try {
        if (!currentUser) {
            return res.redirect('/login');
        }

        const userId = currentUser.id;

        const sql = `DELETE FROM users WHERE id = ?`;
        await pool.execute(sql, [userId]);

        currentUser = null;

        res.redirect('/');

    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting account");
    }

    res.redirect('/'); 
});

/*========= Posts Route ============*/
app.get('/create-post', (req,res) => {
    if (!currentUser) {
        return res.redirect('/login');
    }

    res.render('create-post', { userInfo: currentUser });
});

app.post('/in-post', async (req, res) => {
    try {
        if (!currentUser) {
            return res.redirect('/login');
        }

        const { title, bodyText, link } = req.body;

        const validated = validatePost({
            title,
            bodyText
        });

        if (!validated.isValid) {
            return res.render('create-post', {
                errors: validated.errors,
                data: req.body,
                userInfo: currentUser
            });
        }

        const user_id = currentUser.id;
        const content = bodyText;

        const sql = `INSERT INTO posts (user_id, title, content, links) VALUES (?, ?, ?, ?)`;
        const [result] = await pool.execute(sql, [user_id, title, content, link]);

        const postId = result.insertId;

        res.redirect(`/home-user/${currentUser.username}`);

    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).send('Error creating post in database');
    }
});

app.get('/post/:id', async (req, res) => {
    try {

        const postId = req.params.id;
        const sql = `
            SELECT posts.*, users.username
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE posts.id = ?
        `;

        const [rows] = await pool.query(sql, [postId]);
        const post = rows[0];

        if (!post) {
            return res.send("Post not found");
        }

        res.render('view-post', { post, userInfo: currentUser });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading post");
    }
});

app.post("/delete-post/:id", async (req, res) => {
    try {
        if (!currentUser) {
            return res.redirect("/login");
        }

        const postId = req.params.id;

        const sql = `
        DELETE FROM posts
        WHERE id = ? AND user_id = ?
        `;

        await pool.execute(sql, [postId, currentUser.id]);

        res.redirect(`/home-user/${currentUser.username}`);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting post");
    }
});

/*========= Listener ============*/
app.listen(PORT, () =>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})