import React, { useState } from "react";
import { Container, TextField, Button, Paper, Typography } from "@mui/material";
import TodoList from "./TodoList";  // ✅ Import TodoList correctly

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() === "") return;
    const task = { id: Date.now(), text: newTask, completed: false };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          To-Do List
        </Typography>
        <TextField
          label="New Task"
          variant="outlined"
          fullWidth
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" fullWidth onClick={addTask}>
          Add Task
        </Button>

        <TodoList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} />
      </Paper>
    </Container>
  );
}

export default App;
