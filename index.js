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
