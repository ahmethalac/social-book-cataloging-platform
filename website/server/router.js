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
        const { name, password, userType } = req.body;

        // const results = await connection.executeQuery('SELECT * FROM users...');

        res.status(200).send(results);
    })
    
    /**
     * Saves new user
     */
    app.post('/signup', parse.json(), async (req, res) => {
        console.log(req.body);
        const { name, email, password, userType } = req.body;
        // TODO: Check database whether this credentials are valid
        res.status(200).send(`testSignup with ${name} and ${password}`);
    })
}

runServer();