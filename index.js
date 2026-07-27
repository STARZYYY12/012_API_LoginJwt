const express = require('express');
const app = express();
const db = require('./models');

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
        res.status(500).send({ error: err.message });
    }
});

app.put('/komik/:id', async (req, res) => {
    const komik = await db.Komik.findByPk(req.params.id);

    if (!komik) {
        return res.status(404).send({ error: "Komik not found" });
    }

    await komik.update(req.body);

    res.send(komik);
});

app.delete('/komik/:id', async (req, res) => {
    const komik = await db.Komik.findByPk(req.params.id);

    if (!komik) {
        return res.status(404).send({ error: "Komik not found" });
    }

    await komik.destroy();

    res.send({ message: "Komik deleted successfully" });
});

db.sequelize.sync()
.then(() => {
    app.listen(port, () => {
        console.log(`Server berjalan di http://localhost:${port}`);
    });
})
.catch(err => {
    console.error(err);
});