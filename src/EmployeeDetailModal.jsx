import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/EmployeeDetailModal.css';

const API_BASE = process.env.REACT_APP_API_BASE;

const EmployeeDetailModal = ({ employee, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...employee });
  const [roles, setRoles] = useState([]);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    if (!employee) return;
  
    const managerObj = managers.find(m => m.id === employee.manager);
  
    setFormData({
      ...employee,
      manager: managerObj || null
    });
  }, [employee, managers]);

  useEffect(() => {
    fetch(`${API_BASE}/api/roles/`).then(res => res.json()).then(setRoles);
    fetch(`${API_BASE}/api/employees/`).then(res => res.json()).then(setManagers);
  }, []);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateContactInfo = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    const response = await fetch(`${API_BASE}/api/employees/${employee.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role?.id,
        manager: formData.manager?.id || null,
        contact_info: {
          email: formData.contact_info?.email,
          phone_number: formData.contact_info?.phone_number,
          address: formData.contact_info?.address,
          city: formData.contact_info?.city,
          postal_code: formData.contact_info?.postal_code,
          country: formData.contact_info?.country
        }
      })
    });

    if (response.ok) {
      const updated = await response.json();
    
      const managerObj = managers.find(m => m.id === updated.manager);
    
      setFormData({
        ...updated,
        manager: managerObj || updated.manager // fallback to ID just in case
      });
    
      setIsEditing(false);
    } else {
      console.error('Failed to save employee update');
    }
  };

  return (
    <AnimatePresence>
      <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className={`modal-card ${isEditing ? 'editing' : ''}`} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
          <button className="close-btn" onClick={onClose}>✕</button>
          <h2>{formData.first_name} {formData.last_name}</h2>

          {isEditing ? (
            <>
              <label>
                First Name:
                <input value={formData.first_name} onChange={e => updateForm('first_name', e.target.value)} />
              </label>

              <label>
                Last Name:
                <input value={formData.last_name} onChange={e => updateForm('last_name', e.target.value)} />
              </label>

              <label>
                Role:
                <select value={formData.role?.id || ''} onChange={e =>
                  updateForm('role', roles.find(r => r.id === parseInt(e.target.value)))
                }>
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.title}</option>
                  ))}
                </select>
              </label>

              <label>
                Manager:
                <select value={formData.manager?.id || ''} onChange={e =>
                  updateForm('manager', managers.find(m => m.id === parseInt(e.target.value)))
                }>
                  <option value="">None</option>
                  {managers.map(manager => (
                    <option key={manager.id} value={manager.id}>{manager.first_name} {manager.last_name}</option>
                  ))}
                </select>
              </label>

              <hr />
              <label>
                Email:
                <input value={formData.contact_info?.email || ''} onChange={e => updateContactInfo('email', e.target.value)} />
              </label>
              <label>
                Phone Number:
                <input value={formData.contact_info?.phone_number || ''} onChange={e => updateContactInfo('phone_number', e.target.value)} />
              </label>
              <label>
                Address:
                <input value={formData.contact_info?.address || ''} onChange={e => updateContactInfo('address', e.target.value)} />
              </label>
              <label>
                City:
                <input value={formData.contact_info?.city || ''} onChange={e => updateContactInfo('city', e.target.value)} />
              </label>
              <label>
                Postal Code:
                <input value={formData.contact_info?.postal_code || ''} onChange={e => updateContactInfo('postal_code', e.target.value)} />
              </label>
              <label>
                Country:
                <input value={formData.contact_info?.country || ''} onChange={e => updateContactInfo('country', e.target.value)} />
              </label>

              <button onClick={handleSave}>💾 Save</button>
            </>
          ) : (
            <>
              <p><strong>Role:</strong> {formData.role?.title}</p>
              {formData.manager && (
                <p>
                  <strong>Manager:</strong>{' '}
                  {typeof formData.manager === 'object'
                    ? `${formData.manager.first_name} ${formData.manager.last_name}`
                    : `ID ${formData.manager}`}
                </p>
              )}
              <p><strong>Status:</strong> {formData.status}</p>
              <p><strong>Date Joined:</strong> {new Date(formData.date_joined).toLocaleDateString()}</p>
              <p><strong>Salary:</strong> ${parseFloat(formData.salary).toLocaleString()}</p>

              {formData.contact_info && (
                <>
                  <hr />
                  <p><strong>Email:</strong> {formData.contact_info.email}</p>
                  <p><strong>Phone:</strong> {formData.contact_info.phone_number}</p>
                  <p><strong>Address:</strong> {formData.contact_info.address}</p>
                  <p><strong>City:</strong> {formData.contact_info.city}</p>
                  <p><strong>Postal code:</strong> {formData.contact_info.postal_code}</p>
                  <p><strong>Country:</strong> {formData.contact_info.country}</p>
                </>
              )}

              <button onClick={() => setIsEditing(true)}>✏️ Edit</button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmployeeDetailModal;
