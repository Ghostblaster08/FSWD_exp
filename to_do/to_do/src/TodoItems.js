import React from "react";
import { ListItem, Checkbox, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function TodoItem({ task, toggleTask, deleteTask }) {
  return (
    <ListItem
      sx={{
        display: "flex",
        justifyContent: "space-between",
        bgcolor: task.completed ? "lightgray" : "white",
        mb: 1,
        borderRadius: 1,
      }}
    >
      <Checkbox checked={task.completed} onChange={() => toggleTask(task.id)} />
      <Typography
        variant="body1"
        sx={{ textDecoration: task.completed ? "line-through" : "none", flexGrow: 1 }}
      >
        {task.text}
      </Typography>
      <IconButton edge="end" onClick={() => deleteTask(task.id)}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
}

export default TodoItem;
