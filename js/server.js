const express = require('express')
const app = express()
const path = require('path')
const db = require('./db') // importamos la conexión

app.use(express.json()) // para leer JSON en peticiones
app.use(express.static(path.join(__dirname, '..')))


app.listen(3000, () => {
    console.log('Servidor en http://localhost:3000')
})


// sincronizar tareas con el servidor
app.post('/tasks/sync', (req, res) => {
    const tasks = req.body.tasks
    if (!Array.isArray(tasks)) return res.status(400).send('Formato incorrecto')

    const ids = tasks.map(t => t.id)

    // Borra todo lo que no está en la lista enviada
    const deleteQuery = ids.length > 0
        ? `DELETE FROM tasks WHERE id NOT IN (${ids.map(() => '?').join(',')})`
        : 'DELETE FROM tasks'

    db.query(deleteQuery, ids, err => {
        if (err) {
            console.error('Error al eliminar tareas:', err)
            return res.status(500).send('Error al eliminar tareas')
        } 
        // Upsert (insert/update) the remaining/updated tasks
        if (tasks.length === 0) return res.json({ ok: true })
        const values = tasks.map(t => [t.id, t.task, !!t.completed])
        db.query(
            'INSERT INTO tasks (id, task, completed) VALUES ? ON DUPLICATE KEY UPDATE task=VALUES(task), completed=VALUES(completed)',
            [values],
            err2 => {
                if (err2) {
                    console.error('Error al insertar tareas:', err2)
                    return res.status(500).send('Error al insertar tareas')
                }
                res.json({ ok: true })
            }
        )
    })
})

app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar tarea:', err)
            return res.status(500).send('Error al eliminar tarea')
        }
        res.json({ ok: true })
    })
})

// Obtener tareas desde la base de datos
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) return res.status(500).send('Error al obtener tareas')
        res.json(results)
    })
})
