const express = require('express');
const redis = require('redis');

const app = express();
const client = redis.createClient();

app.get('/get/:key', (req, res) => {
    const key = req.params.key;
    client.get(key, (err, value) => {
        if (err) {
            res.status(500).send('Error retrieving value');
        } else {
            res.send(value);
        }
    });
});

app.post('/set/:key/:value', (req, res) => {
    const key = req.params.key;
    const value = req.params.value;
    client.set(key, value, (err, reply) => {
        if (err) {
            res.status(500).send('Error setting value');
        } else {
            res.send('Value set successfully');
        }
    });
});

app.delete('/delete/:key', (req, res) => {
    const key = req.params.key;
    client.del(key, (err, reply) => {
        if (err) {
            res.status(500).send('Error deleting key');
        } else {
            res.send('Key deleted successfully');
        }
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});