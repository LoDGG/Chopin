const express = require('express');
const request = require('request');
import cors from 'cors';

const app = express();
app.use(cors());
app.get("/getData", (req, res) => {
        res.send("Hell");
    });

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});