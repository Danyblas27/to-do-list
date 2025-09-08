export default class TaskManager {
    constructor(storageManager) {
        this.storage = storageManager
        this.tasks = this.storage.getTasks()
    }
    
    // Agregar una nueva tarea
    addTask(text) {
        if (!text.trim()) return false; // no puede estar vacio
        
        const newTask = {
            id: Date.now(), // les agregué id para poder trabajar mejor cada tarea individualmente
            text: text.trim(),
            completed: false
        };
        
        this.tasks.push(newTask)
        this.storage.saveTasks(this.tasks)
        return newTask
    }
    
    // Eliminar una tarea
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id)
        this.storage.saveTasks(this.tasks)
    }
    
    // Obtener todas las tareas
    getAllTasks() {
        return this.tasks
    }
}