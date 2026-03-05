import express from 'express';
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//set the view engine
app.set('view engine', 'ejs');

const PORT = 3004;

/*========= Variables =========*/

/*========= Home Page Routes ============*/
app.get('/', (req,res) => {
    res.render('home-new');
});

app.post('/user-home', (req, res) => {
    const user = req.body;

    const userInfo = {
        username: user.username
    };

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
    // const user = req.body;

    const userInfo = {
        // This is the best I can do since trying to display the actual user information
        // gives an error for some reason.
        // If you ever figure it out then delete these comments.
        username: 'placeholder',
        password: 'placeholder',
        email: 'placeholder',
        timestamp: new Date()
    };

    res.render('settings', { userInfo });
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