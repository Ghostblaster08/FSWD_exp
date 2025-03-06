import { useState } from "react";
import UserForm from "./UserForm";
import "./styles.css";

function App() {
  return (
    <div className="app-container">
      <h1>Simple React App</h1>
      <UserForm />
    </div>
  );
}

export default App;
