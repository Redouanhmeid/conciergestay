require('dotenv').config()
const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()

app.use(cors())

const db = mysql.createConnection({
    host: process.env.DB_URI,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

app.get('/', (re, res) => {
    return res.json("From Backend Side")
})

app.get('/administrator', (req, res) => {
    const sql = "SELECT * FROM administrator";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.listen(process.env.PORT, () => {
    console.log("listening")
})