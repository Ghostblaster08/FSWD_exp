import React from "react";
import { List } from "@mui/material";
import TodoItem from "./TodoItems";

function TodoList({ tasks, toggleTask, deleteTask }) {
  return (
    <List sx={{ mt: 2 }}>
      {tasks.map((task) => (
        <TodoItem key={task.id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />
      ))}
    </List>
  );
}

export default TodoList;
