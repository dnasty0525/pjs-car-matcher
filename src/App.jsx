import React, { useState } from 'react';

const CustomerDatabase = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', year: '', make: '', model: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCustomer = () => {
    if (!form.name || !form.email || !form.phone || !form.year || !form.make || !form.model) return;
    setCustomers([...customers, form]);
    setForm({ name: '', email: '', phone: '', year: '', make: '', model: '' });
  };

  return (
    <div>
      <h1>Classic Car Customer Matcher</h1>
      <div style={{ marginBottom: '1rem' }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="year" placeholder="Year" value={form.year} onChange={handleChange} />
        <input name="make" placeholder="Make" value={form.make} onChange={handleChange} />
        <input name="model" placeholder="Model" value={form.model} onChange={handleChange} />
        <button onClick={handleAddCustomer}>Add Customer</button>
      </div>
      <ul>
        {customers.map((c, i) => (
          <li key={i}>
            {c.name} ({c.email}, {c.phone}) - {c.year} {c.make} {c.model}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerDatabase;
