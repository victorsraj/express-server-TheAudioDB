// to start with nodemon from the package.json
// on OsX or Linux use: npm run start
// on Windows use: npm run windows
const cors = require('cors');
const express = require('express');

const MongoClient = require('mongodb').MongoClient;

const config = require('./config.json');

// requiring in the router handler file for search
const search = require('./search');

// requiring in the router handler file for history
const history = require('./history');

// require in the router handle file for users
// const users = require('./users');

// calling express fn which creates the express application
// this allows use to use the ful functionality for our express server
const app = express();
const port = 8888;

// apply middleware to the application level
// middleware parse various POST JSON bodies in express
app.use(cors());
app.use(express.json());
// add app level here

// GET route to handle localhost:8888
app.get('/', (req, res) => {
    res.send('Welcome to the TheAudioDB Application');
});

// add the search route to the express application
// our express app will no be able to handle requests to /search
app.use('/search', search);

// add the history route to the express application
// our express app will no be able to handle requests to /history
app.use('/history', history);


// add the users route to the express application
// our express app will no be able to handle requests to /users
// app.use('/users', users);

// mongodb+srv://dbAdmin:<password>@cluster0.b6xqq.mongodb.net/?retryWrites=true&w=majority
const url = `mongodb+srv://${config.username}:${config.password}@${config.cluster}/${config.database}?retryWrites=true&w=majority`;

// create a new mongo client instance
const client = new MongoClient(url);

// connect ot the url provided
client.connect((err) => {
    // if there is an error then throw because our server depends on our database
    if (err) {
        throw new Error('Failed to connect to MongoDB');
    }

    console.log('Connected to MongoDB');

    // storing the database instance in the app.locals object to reference in search.js and history.js
    app.locals.db = client.db();

    // start the server after connecting to mongo
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
});
