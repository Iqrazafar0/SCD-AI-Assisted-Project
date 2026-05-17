const express = require('express');
const app = express();
app.use(express.json());

let tasks = [
    { id: 1, title: "Complete SCD Assignment", description: "Finish lab tasks and take screenshots", completed: false }
];

// 1. Get all tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// 2. Get single task by ID
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
});

// 3. Create a new task
app.post('/tasks', (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        description: req.body.description,
        completed: false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// 4. Update a task (Refactored with Input Validation and Error Handling)
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }
    
    // Input Validation (Refactoring addition)
    if (!req.body.title || req.body.title.trim() === "") {
        return res.status(400).json({ message: "Validation Error: Title is required and cannot be empty" });
    }
    
    task.title = req.body.title;
    task.description = req.body.description || task.description;
    task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
    
    res.status(200).json({ message: "Task updated successfully", task });
});

// 5. Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex === -1) return res.status(404).json({ message: "Task not found" });
    
    tasks.splice(taskIndex, 1);
    res.status(200).json({ message: "Task deleted successfully" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // For testing later