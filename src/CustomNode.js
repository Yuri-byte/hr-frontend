import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import styles from './styles/CustomNode.module.css';

const CustomNode = ({ nodeDatum, onNodeClick, selectedPath }) => {
  const { id, name, attributes: { role } = {} } = nodeDatum;
  const isHighlighted = Array.isArray(selectedPath) && selectedPath.includes(id);

  // wrap click so we always pass back the full nodeDatum
  const handleClick = useCallback((e) => {
    e.stopPropagation();
    onNodeClick?.(nodeDatum);
  }, [onNodeClick, nodeDatum]);

  return (
    <g onClick={handleClick}>
      <foreignObject width="120" height="100" x="-50" y="-60">
        <motion.div
          className={clsx(styles.nodeCard, {
            [styles.nodeCardHighlighted]: isHighlighted,
          })}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.03 }}
        >
          <div className={styles.avatar}>
            {getInitials(name)}
          </div>
          <div className={styles.name}>{name}</div>
          <div className={styles.role}>{role}</div>
        </motion.div>
      </foreignObject>
    </g>
  );
};

// Simple helper to get initials from a name:
function getInitials(fullName = '') {
  const [first = '', second = ''] = fullName.split(' ');
  return (first[0] || '').toUpperCase() + (second[0] || '').toUpperCase();
}

export default CustomNode;
