const express = require('express');
const app = express();
const port = 3000;
const db = require('./models');
app.use(express.json());
app.use(express.urlencoded({ 
    extended: false
}));

app.
listen(port, () => {
    console.log(`Server is start on http://localhost:${3000}`);
});

db.sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log('Server started');
        });
    })
    .catch((err) => {
        console.log('Err');
    });

app.post('/komik', async (req, res) => {
    const { title, author, description } = req.body;
    try {
        const komik = await db.Komik.create({ title, author, description });
        res.send(komik);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});
