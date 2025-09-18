export default class ToDoList {
    constructor(taskManager) {
        this.taskManager = taskManager
        this.tasksContainer = document.getElementById('tasksContainer')
        this.taskInput = document.getElementById('taskInput')
        this.addTaskBtn = document.getElementById('addTaskBtn')
        
        this.bindEvents()
        this.renderTasks()
    }
    
    // Vincular eventos
    bindEvents() {
        this.addTaskBtn.addEventListener('click', () => this.addTask())
        // para que funcione igual con un enter
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask()
        })

        // Eventos para botones de eliminar
        this.tasksContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.delete-btn')
            if (btn) {
                const taskId = parseInt(btn.dataset.id)
                this.deleteTask(taskId)
            }
        });
    }
    
    // Agregar una nueva tarea a la todolist
    async addTask() {
        const taskText = this.taskInput.value
        const newTask = this.taskManager.addTask(taskText)
        
        if (newTask) {
            this.taskInput.value = '' // resetear el input
            await this.taskManager.syncToServer() // sync al server despues de agregar
            await this.taskManager.syncFromServer() // obtener actualizaciones del servidor
            this.renderTasks()
        }
    }
    
    // Eliminar una tarea y volver a renderizar
    async deleteTask(id) {
        await this.taskManager.deleteTask(id)
        this.renderTasks() // mostrar cambios
        await this.taskManager.syncToServer() // sync al server despues de eliminar
        await this.taskManager.syncFromServer()
    }
    
    // Renderizar todas las tareas
    renderTasks() {
        const tasks = this.taskManager.getAllTasks()
        
        if (tasks.length === 0) {
            this.tasksContainer.innerHTML = `
                <div>
                    <p>No hay tareas</p>
                </div>`
            return
        }
        
        this.tasksContainer.innerHTML = ''
        
        tasks.forEach(task => {
            const taskElement = document.createElement('div')
            taskElement.className = 'task-item d-flex flex-wrap justify-content-between mt-4 border p-3 rounded'
            taskElement.innerHTML = `
                <div class="d-flex me-2 md-col-8 sm-col-6" style="overflow-wrap: anywhere">
                    <span>${task.task}</span>
                </div>
                <div class="d-flex justify-content-center align-items-center">
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${task.id}">
                        Eliminar
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                `
            this.tasksContainer.appendChild(taskElement)
        })
    }
}