import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import styles from './styles/CustomNode.module.css';

const CustomNode = ({ 
  nodeDatum,
  onNodeClick,
  isSelected,
  isCollapsed,
  onToggleCollapse
}) => {
  const { id, name, attributes: { role } = {} } = nodeDatum;
  const isHighlighted = isSelected;

  const hasTrueChildren = nodeDatum.hasChildren;

  // wrap click so we always pass back the full nodeDatum
  const handleClick = useCallback((e) => {
    e.stopPropagation();
    onNodeClick?.(nodeDatum);
  }, [onNodeClick, nodeDatum]);

  return (
    <g onClick={handleClick}>
      <foreignObject width="140" height="120" x="-70" y="-60">
        <motion.div
          className={clsx(styles.nodeCard, {
            [styles.nodeCardHighlighted]: isHighlighted,
          })}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className={styles.avatar}>
            {getInitials(name)}
          </div>
          <div className={styles.name}>{name}</div>
          <div className={styles.role}>{role}</div>
        </motion.div>
      </foreignObject>

      {hasTrueChildren && (
        <foreignObject width="60" height="30" x="-30" y="60">
          <div className={styles.toggleCollapseWrapper}>
            <button
              className={styles.toggleCollapseBtn}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering node click
                onToggleCollapse(id);
              }}
            >
              {isCollapsed ? '➕' : '➖'}
            </button>
          </div>
        </foreignObject>
      )}
    </g>
  );
};

// Simple helper to get initials from a name:
function getInitials(fullName = '') {
  const [first = '', second = ''] = fullName.split(' ');
  return (first[0] || '').toUpperCase() + (second[0] || '').toUpperCase();
}

export default CustomNode;
