import express from 'express';
import parse from 'body-parser';
import Connection from './connection.js';

async function runServer() {
    const app = express();
    const port = 3001;
    const connection = new Connection();
    await connection.initDatabase();
    
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
    
    app.listen(port, () => {
        console.log(`Listening at http://localhost:${port}`)
    })
    
    /**
     * Checks the credentials of user trying to login and returns status 200 if they are valid, return 400 otherwise
     */
    app.post('/login', parse.json(), async (req, res) => {
        console.log(req.body);
        const { username, password, userType } = req.body;

        // const results = await connection.executeQuery('SELECT * FROM users...');

        res.status(200).send(`testLogin with ${username} and ${password}`);
    })
    
    /**
     * Saves new user
     */
    app.post('/signup', parse.json(), async (req, res) => {
        console.log(req.body);
        const { name, username, email, password, userType } = req.body;
        // TODO: Check database whether this credentials are valid
        res.status(200).send(`testSignup with ${name} and ${password}`);
    })

    /**
     * Get all books
     */
    app.get('/getAllBooks', parse.json(), async (req, res) => {
        // const results = await connection.executeQuery('SELECT ...');
        // res.status(200).send(results);
        res.status(200).send([
        {
            book_id: 1,
            genre: 'Fiction',
            year: 2000,
            name: 'Republic',
            author_id: 1,
            author_name: 'Plato',
        },
        {
            book_id: 2,
            genre: 'Fiction',
            year: 2005,
            name: 'Tutunamayanlar',
            author_id: 2,
            author_name: 'Oğuz Atay',
        }
        ]);
    })

    app.post('/getTrackedBooks', parse.json(), async (req, res) => {
        console.log(req.body);
        const { username } = req.body;
        /*
        response should be in this format:
        {
            bookID: [
                {
                    page_number: firstProgress' pageNumber,
                    date: firstProgress' date,
                },
                {
                    page_number: secondProgress' pageNumber,
                    date: secondProgress' date,
                }
            ],
            otherBookID...
        }

        */
        res.status(200).send({
            1: [
                {
                    page_number: 10,
                    date: '2020-01-01'
                },
                {
                    page_number: 50,
                    date: '2020-02-01'
                },
            ],
            2: [
                {
                    page_number: 10,
                    date: '2020-01-01'
                },
                {
                    page_number: 50,
                    date: '2020-02-01'
                },
            ],
        });
    })
}

runServer();