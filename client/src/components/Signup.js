import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { sendWelcomeEmail } from '../EmailService';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      newErrors.required = 'All fields are required.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.passwordMatch = 'Passwords do not match.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:5000/api/signup', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        if (response.data.error) {
          setErrors({ ...errors, registration: response.data.error });
        } else {
          setErrors({});
          console.log('Signup successful:', response.data.message);
          const token = response.data.token;
          localStorage.setItem('token', token);
          sendWelcomeEmail(formData.email);
          navigate('/posts');
        }
      } catch (error) {
        console.error('Signup failed:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 border-solid">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          {errors.required && <div className="text-red-500">{errors.required}</div>}
          {errors.passwordMatch && <div className="text-red-500">{errors.passwordMatch}</div>}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input type="checkbox" name="termsAndConditions" className="mr-2" />
              I agree to the terms and conditions
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
