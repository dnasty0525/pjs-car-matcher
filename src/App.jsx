import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import axios from 'axios';
import * as cheerio from 'cheerio';

const CustomerDatabase = () => {
  const [customers, setCustomers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', year: '', make: '', model: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching customers:', error.message);
    } else {
      setCustomers(data);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCustomer = async () => {
    if (!form.name || !form.email || !form.phone || !form.year || !form.make || !form.model) return;

    const { data, error } = await supabase
      .from('customers')
      .insert([form]);

    if (error) {
      console.error('Error adding customer:', error.message);
    } else {
      setCustomers([data[0], ...customers]);
      setForm({ name: '', email: '', phone: '', year: '', make: '', model: '' });
    }
  };

  const checkMatches = async () => {
    try {
      const { data: customerList, error } = await supabase.from('customers').select('*');
      if (error) throw error;

      const response = await axios.get('https://www.pjsautoworld.com/vehicles');
      const $ = cheerio.load(response.data);
      const vehicles = [];

      $('.inventory-item').each((i, el) => {
        const title = $(el).find('.inventory-title').text().trim();
        const match = title.match(/(\d{4})\s+(\w+)\s+(.*)/);
        if (match) {
          const [, year, make, model] = match;
          vehicles.push({ year, make, model });
        }
      });

      const matched = [];

      customerList.forEach(customer => {
        vehicles.forEach(vehicle => {
          if (
            customer.year === vehicle.year &&
            customer.make.toLowerCase() === vehicle.make.toLowerCase() &&
            customer.model.toLowerCase() === vehicle.model.toLowerCase()
          ) {
            matched.push({ customer, vehicle });
          }
        });
      });

      setMatches(matched);
    } catch (err) {
      console.error('Error checking matches:', err);
    }
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
        <button onClick={checkMatches} style={{ marginLeft: '1rem' }}>Check for Matches</button>
      </div>
      <ul>
        {customers.map((c) => (
          <li key={c.id}>
            {c.name} ({c.email}, {c.phone}) - {c.year} {c.make} {c.model}
          </li>
        ))}
      </ul>
      {matches.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Match Results</h2>
          <ul>
            {matches.map((match, idx) => (
              <li key={idx}>
                Match found: {match.customer.name} is looking for a {match.vehicle.year} {match.vehicle.make} {match.vehicle.model}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomerDatabase;
