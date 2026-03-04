import express from 'express';
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//set the view engine
app.set('view engine', 'ejs');

const PORT = 3004;

/*========= Home Page Routes ============*/
app.get('/', (req,res) => {
    res.render('home-new');
});

/*========= Account Routes ============*/
app.get('/create-account', (req,res) => {
    res.render('create-account');
});

app.post('/create-account', (req, res) => {
    const { username, password, confirm, email, timestamp = new Date() } = req.body;
    res.render('home-user', { name: username });
});

app.post('/login-account', (req, res) => {
    const { username, password, timestamp = new Date() } = req.body; 
    res.render('home-user', { name: username });
});

/*========= Settings Routes ============*/
app.get('/settings', (req, res) => {
    const currentUser = {
        username: "TempoTalkUser",
        email: "user@example.com"
    };
    res.render('settings', { user: currentUser });
});

app.post('/update-settings', (req, res) => {
    const { username, email, password } = req.body;

    if (password) {
        console.log(`Updating Name to: ${username}, Email to: ${email}, and setting a NEW password.`);
    } else {
        console.log(`Updating Name to: ${username}, Email to: ${email}, keeping OLD password.`);
    }

    res.redirect('/'); 
});

app.post('/delete-account', (req, res) => {
    console.log("Account deletion request received.");

    res.redirect('/'); 
});

/*========= Listener ============*/
app.listen(PORT, () =>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})