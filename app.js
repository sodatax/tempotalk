import express from 'express';
const app = express();

app.use(express.static('public'));

//set the view engine
app.set('view engine', 'ejs');

const PORT = 3004;

app.get('/create-account', (req,res) => {
    res.render('create');
});

app.get('/', (req,res) => {
    res.render('home');
});

app.listen(PORT, () =>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})