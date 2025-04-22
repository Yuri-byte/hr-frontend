import React, { useState, useMemo } from 'react';
import './styles/DirectoryPanel.css';

const DirectoryPanel = ({ data, onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const flattenTree = (node, list = []) => {
    list.push(node);
    if (node.children) {
      node.children.forEach(child => flattenTree(child, list));
    }
    return list;
  };

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const all = data ? flattenTree(data[0]) : [];
    return all.filter(emp =>
      emp.name.toLowerCase().includes(term)
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, data]);

  return (
    <div className="directory-panel">
      <div className="directory-header">
        <h3>Employee Directory</h3>
        <button className="directory-close-btn" onClick={onClose}>✕</button>
      </div>

      <input
        className="search-box"
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul>
        {filteredEmployees.map(emp => (
          <li key={emp.id} onClick={() => onSelect(emp)}>
            <strong>{emp.name}</strong>
            <div>{emp.attributes?.role}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DirectoryPanel;
