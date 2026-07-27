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

app.get('/komik', async (req, res) => {
    try {
        const komik = await db.Komik.findAll();
        res.send(komik);
    } catch (err) {
        res.send({ error: err.message });
    }
});

app.put('/komik/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).send({ error: 'Komik not found' });
        }
        await komik.update(data);
        res.send(komik);
    } catch (err) {
        res.send({ error: err.message });
    }
});

app.delete('/komik/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).send({ error: 'Komik not found' });
        }
        await komik.destroy();
        res.send({ message: 'Komik deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});