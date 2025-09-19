export default class TaskManager {
    constructor(storageManager) {
        this.storage = storageManager
        this.tasks = this.storage.getTasks()
    }
    
    // Agregar una nueva tarea
    addTask(text) {
        if (!text.trim()) {
            alert('Escribe algo antes de agregar una tarea')
            return false; // no puede estar vacio
        }
        
        const newTask = {
            id: Date.now(), // les agregué id para poder trabajar mejor cada tarea individualmente
            task: text.trim(),
            completed: false
        }
        
        this.tasks.push(newTask)
        this.storage.saveTasks(this.tasks)
        return newTask
    }
    
    // Eliminar una tarea
    async deleteTask(id) {
        console.log('Deleting task with id:', id)
        this.tasks = this.tasks.filter(task => task.id !== id)
        this.storage.saveTasks(this.tasks)

        // Delete from server if online
        if (navigator.onLine) {
            try {
                await fetch(`/tasks/${id}`, { method: 'DELETE' })
            } catch (err) {
                console.error('Error deleting task from server:', err)
            }
        }
    }
    
    // Obtener todas las tareas
    getAllTasks() {
        return this.tasks
    }

    // Sincronizar tareas locales con el servidor
    async syncToServer() {
            if (!navigator.onLine) return // No intentar si estamos offline
        try {
            await fetch('/tasks/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks: this.tasks })
            })
        } catch (err) {
            if (navigator.onLine) {
                console.error('Error sincronizando con el servidor', err)
            }
        }
    }

    // Descargar tareas del servidor y sobrescribir localStorage
    async syncFromServer() {
        if (!navigator.onLine) return // no intentar si estamos offline
        try {
            const res = await fetch('/tasks')
            if (!res.ok) throw new Error('No se pudo obtener tareas')
            const serverTasks = await res.json()
            this.tasks = serverTasks
            this.storage.saveTasks(this.tasks)
        } catch (err) {
            if (navigator.onLine) {
                console.error('Error descargando tareas del servidor', err)
            }
            // Si estamos offline, no mostrar error
        }
    }

    // Sincronizar servidor y cliente al reconectar
    async syncOnReconnect() {
        await this.syncToServer()
        await this.syncFromServer()
    }
}