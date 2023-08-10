
const express = require('express')
const cors = require('cors')
const userRoutes = require('./src/routes/user.routes')
require('./db')

const PORT = 4000;

const app = express()


app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cors({
    origin: "*",
}));

app.use(userRoutes);


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})


// module.exports = app