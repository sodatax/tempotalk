import express from 'express';
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//set the view engine
app.set('view engine', 'ejs');

const PORT = 3004;

/*========= Variables =========*/
const users = [];
let currentUser= null;

/*========= Home Page Routes ============*/
app.get('/', (req,res) => {
    res.render('home-new');
});

app.post('/home-user', (req, res) => {
    const {username, password, email} = req.body;

    const userInfo = {
        username,
        password,
        email,
        timestamp: new Date()
    };

    users.push(userInfo);
    currentUser=userInfo;

    res.render('home-user', { userInfo });
});

//assumes one user, will change when we use database
app.get('/home-user', (req, res) => { 
    if (users.length === 0) {
        return res.redirect('/');
    }

    const userInfo = users[users.length - 1];
    res.render('home-user', { userInfo });
});

/*========= Account Routes ============*/
app.get('/create-account', (req,res) => {
    res.render('create-account');
});

app.get('/login', (req,res) => {
    res.render('login');
});

/*========= Settings Routes ============*/
app.get('/settings', (req, res) => {
    const userInfo = users[users.length -1];

    res.render('settings', { userInfo });
});

app.post('/in-account', (req, res) => {
    const account = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email ? req.body.email : "check email in settings"
    };

    users.push(account);

    res.render('account-summary', { account })
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