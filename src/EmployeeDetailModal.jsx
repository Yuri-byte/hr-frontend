import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/EmployeeDetailModal.css';

const EmployeeDetailModal = ({ employee, onClose }) => {
  if (!employee) return null;

  const { first_name, last_name, role, contact_info, date_joined, status, salary } = employee;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="modal-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <button className="close-btn" onClick={onClose}>✕</button>
          <h2>{first_name} {last_name}</h2>
          <p><strong>Role:</strong> {role?.title}</p>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Date Joined:</strong> {new Date(date_joined).toLocaleDateString()}</p>
          <p><strong>Salary:</strong> ${parseFloat(salary).toLocaleString()}</p>

          {contact_info && (
            <>
              <hr />
              <p><strong>Email:</strong> {contact_info.email}</p>
              <p><strong>Phone:</strong> {contact_info.phone_number}</p>
              <p><strong>Address:</strong> {contact_info.address}</p>
              <p><strong>City:</strong> {contact_info.city}</p>
              <p><strong>Postal code:</strong> {contact_info.postal_code}</p>
              <p><strong>Country:</strong> {contact_info.country}</p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmployeeDetailModal;
