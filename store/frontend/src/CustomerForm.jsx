import axios from "axios";
import { useState, useEffect } from "react";

const API = "/api";

function CustomerForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get(`${API}/customers`);
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load customers");
      setCustomers([]);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const submit = async (e) => {
    e?.preventDefault();
    setError(null);
    setSuccess(false);
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/customers`, {
        name: name.trim(),
        email: email.trim(),
      });
      setSuccess(true);
      setName("");
      setEmail("");
      fetchCustomers();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (err.response?.status === 409 && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to add customer");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <h2>Customers</h2>
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Name</label>
          <input
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving…" : "Add Customer"}
        </button>
      </form>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">Customer added successfully</div>}
      <div className="list">
        {!Array.isArray(customers) || customers.length === 0 ? (
          <div className="list-empty">No customers yet</div>
        ) : (
          customers.map((c) => (
            <div key={c.id} className="list-item">
              <span>{c.name}</span>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.8125rem" }}>
                {c.email}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CustomerForm;
