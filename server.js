const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');

const client_id = 'e4be6750a5b34fbc9d3d4cebefcdfe23';
const grant_type = 'authorization_code';
const client_secret = process.env.TINK_SECRET;

const port = 8080;
const app = express();
const router = express.Router();

app.use(cors());

router.use((req, res, next) => {
  console.log(req.originalUrl);
  next();
})

// Process listeners
process.on('exit', function () {
  console.log('Server process is finished.');
})

process.on('SIGINT', () => {
  console.log('Server process is being finished...');
  process.exit(0);
})

app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/', router);

app.use('/get-data/:token', (req, res) => {
  const token = req.params.token;
  fetch('https://api.tink.com/api/v1/search', {
    headers: { 'Authorization': `Bearer ${token}` },
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    res.json(data);
  });
});

app.use('/get-token/:code', (req, res) => {
  const code = req.params.code;
  fetch('https://api.tink.com/api/v1/oauth/token', {
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `code=${code}&client_id=${client_id}&client_secret=${client_secret}&grant_type=${grant_type}`
  }).then(function(response) {
    return response.ok ? response.json() : {};
  }).then(function(data) {
    res.json(data);
  });
});

app.listen(port, () => {
  console.log(`API is running on port: ${port}!`);
});
