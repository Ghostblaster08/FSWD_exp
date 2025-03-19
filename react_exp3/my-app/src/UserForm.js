import { useState } from "react";

function UserForm() {
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [submittedName, setSubmittedName] = useState(null);

  const handleFNChange = (event) => {
    setfirst_name(event.target.value);
  };

  const handleLNChange = (event) => {
    setlast_name(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedName(first_name + " " + last_name);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Enter your First name:
          <input type="text" value={first_name} onChange={handleFNChange} />
        </label>
        <label>
          Enter your Last name:
          <input type="text" value={last_name} onChange={handleLNChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {submittedName && <p>Hello, {submittedName}!</p>}
    </div>
  );
}

export default UserForm;
