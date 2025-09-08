import StorageManager from "./storageManager.js"
import TaskManager from "./taskManager.js"
import ToDoList from "./toDoList.js"

document.addEventListener('DOMContentLoaded', () => {
    const storageManager = new StorageManager()
    const taskManager = new TaskManager(storageManager)
    const toDoList = new ToDoList(taskManager)
    
    console.log(localStorage.getItem('todoTasks'))
    // Hacer accesibles para debugging o futuras expansiones
    window.todoApp = {
        storage: storageManager,
        manager: taskManager,
        ui: toDoList
    };
});