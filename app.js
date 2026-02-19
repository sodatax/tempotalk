import express from 'express';
const app = express();

//set the view engine
app.set('view engine', 'ejs');

const PORT = 3004;

app.get('/', (req,res) => {
    res.render('home');
});

app.get('/temp', (req,res) => {
    res.render('temp');
});

app.listen(PORT, () =>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})