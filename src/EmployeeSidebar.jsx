import { motion } from 'framer-motion';
import './styles/Sidebar.css';

const sidebarVariants = {
  hidden: { x: -300 },
  visible: { x: 0 },
  exit: { x: -300 }
};

const EmployeeSidebar = ({ employee, onClose }) => {
  if (!employee) return null;

  const fullName = `${employee.first_name} ${employee.last_name}`;
  const role = employee.role?.title;
  const description = employee.role?.description;
  const dateJoined = new Date(employee.date_joined).toLocaleDateString();
  const salary = `$${parseFloat(employee.salary).toLocaleString()}`;

  return (
    <motion.div
      className="sidebar-wrapper"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={sidebarVariants}
      transition={{ type: 'tween', duration: 0.3 }}
    >
      <div className="sidebar">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>{fullName}</h2>
        <p><strong>Role:</strong> {role}</p>
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Date Joined:</strong> {dateJoined}</p>
        <p><strong>Status:</strong> {employee.status}</p>
        <p><strong>Salary:</strong> {salary}</p>
      </div>
    </motion.div>
  );
};

export default EmployeeSidebar;
