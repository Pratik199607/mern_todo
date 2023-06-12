const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const dotenv = require('dotenv');
const cors = require('cors');
// const registerRoute = require('./routes/register');
// const loginRoute = require('./routes/login');
const authRoute = require('./routes/auth');
const todoRoute = require('./routes/todo');
const jwt = require('jsonwebtoken');

dotenv.config();
const secretKey = process.env.JWT_SECRET;

//Create a intance of express
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

//Assign routes for login and register
// app.use('/api/register', registerRoute);
// app.use('/api/login', loginRoute);
app.use('/api/todo', todoRoute);
app.use('/api', authRoute);

//Start the server and listen on specified port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

