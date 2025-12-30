import { useEffect, useState } from "react";
import api from "./api";

export default function EmployeeModal({ onClose }) {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const auth = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // ======================
  // LOAD EMPLOYEES
  // ======================
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await api.get("/employees", auth);

      // 🔑 HARD GUARANTEE ARRAY
      if (Array.isArray(res.data)) {
        setEmployees(res.data);
      } else {
        console.warn("Employees response was not array:", res.data);
        setEmployees([]);
      }
    } catch (err) {
      console.error("Failed to load employees", err);
      setEmployees([]);
    }
  };

  // ======================
  // ADD EMPLOYEE
  // ======================
  const addEmployee = async () => {
    if (!name.trim()) return;

    try {
      await api.post("/employees", { name }, auth);
      setName("");
      loadEmployees();
    } catch (err) {
      setError("You must be an admin to add employees.");
    }
  };

  // ======================
  // DELETE EMPLOYEE
  // ======================
  const deleteEmployee = async (id) => {
    try {
      await api.delete(`/employees/${id}`, auth);
      loadEmployees();
    } catch (err) {
      setError("You must be an admin to delete employees.");
    }
  };

  // ======================
  // RENDER
  // ======================
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Manage Employees</h3>

        {error && <div className="error">{error}</div>}

        <div className="form-row">
          <input
            id="employee-name"
            name="employeeName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Employee name"
          />
          <button onClick={addEmployee}>Add</button>
        </div>

        <ul>
          {Array.isArray(employees) &&
            employees.map((emp) => (
              <li key={emp.id}>
                {emp.name}
                <button onClick={() => deleteEmployee(emp.id)}>✕</button>
              </li>
            ))}
        </ul>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
