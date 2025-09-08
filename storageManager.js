export default class StorageManager {
    constructor() {
        this.storageKey = 'todoTasks'
    }
    
    // obtener tareas de localStorage
    getTasks() {
        const tasks = localStorage.getItem(this.storageKey)
        return tasks ? JSON.parse(tasks) : [] // retorna un array vacío si no existen tareas
    }
    
    // guardar en localStorage
    saveTasks(tasks) {
        localStorage.setItem(this.storageKey, JSON.stringify(tasks))
    }
}