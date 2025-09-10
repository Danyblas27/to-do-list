import StorageManager from "./classes/storageManager.js"
import TaskManager from "./classes/taskManager.js"
import ToDoList from "./classes/toDoList.js"

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
    }
})

// Levantar el servidor

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(reg => console.log("Service Worker registrado:", reg))
        .catch(err => console.error("Error registrando SW:", err))
    })
}

// Offline
function updateOnlineStatus() {
    const offlineAlert = document.getElementById('offlineAlert')
    
    if (!navigator.onLine) {
        // Mostrar alerta cuando no hay conexión
        offlineAlert.classList.remove('d-none')
    } else {
        // Ocultar alerta cuando hay conexión
        offlineAlert.classList.add('d-none')
    }
}

// Event listeners para cambios de conexión
window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)

// Verificar estado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    updateOnlineStatus()
})