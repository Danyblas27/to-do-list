const mysql = require('mysql2')


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sql123', 
    database: 'todolist'
})

// Conectar
connection.connect(err => {
    if (err) {
        console.error('Error al conectar a MySQL:', err)
        return;
    }
})

module.exports = connection
