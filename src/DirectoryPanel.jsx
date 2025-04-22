import './styles/DirectoryPanel.css';

const DirectoryPanel = ({ data, onSelect, onClose }) => {
  const flattenTree = (node, list = []) => {
    list.push(node);
    if (node.children) {
      node.children.forEach(child => flattenTree(child, list));
    }
    return list;
  };

  const employees = data ? flattenTree(data[0]) : [];

  return (
    <div className="directory-panel">
      <div className="directory-header">
        <h3>Employee Directory</h3>
        <button className="directory-close-btn" onClick={onClose}>✕</button>
      </div>
      <ul>
        {employees.map(emp => (
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
