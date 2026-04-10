const app = require('./app.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const port = 3000;

mongoose.connect(process.env.MONGO_URI).then(() => {console.log("DB Connected");}).catch((err) => {console.log(err);});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});