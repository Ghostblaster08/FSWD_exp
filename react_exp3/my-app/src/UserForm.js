import { useState } from "react";

function UserForm() {
  const [name, setName] = useState("");
  const [submittedName, setSubmittedName] = useState(null);

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedName(name);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Enter your name:
          <input type="text" value={name} onChange={handleChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {submittedName && <p>Hello, {submittedName}!</p>}
    </div>
  );
}

export default UserForm;
