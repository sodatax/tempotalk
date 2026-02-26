import express from 'express';
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//set the view engine
app.set('view engine', 'ejs');

const PORT = 3004;

app.get('/create-account', (req,res) => {
    res.render('create');
});

app.get('/', (req,res) => {
    res.render('home');
});

app.post('/create-account', (req,res) => {
    const { username, password, confirm, email } = req.body;
    res.render('created', { name: username });
});

app.listen(PORT, () =>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})