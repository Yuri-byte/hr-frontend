import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Tree from 'react-d3-tree';
import CustomNode from './CustomNode';
import { countEmployees, findPath, convertToD3Format } from './utils/OrgTree'
import styles from './styles/OrgChart.module.css';


const OrgChart = () => {
  const [data, setData] = useState(null);
  const [highlightedPath, setHighlightedPath] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/employees/tree/')
      .then(res => res.json())
      .then(tree => {
        const formatted = convertToD3Format(tree);
        setData([formatted]); // wrap in array for react-d3-tree
      });
  }, []);

  // only recompute when `data` changes:
  const employeeCount = useMemo(() => {
    if (!data) return 0;
    return countEmployees(data[0]);
  }, [data]);

  // Stable callback to handle clicks
  const handleNodeClick = useCallback((nodeDatum) => {
    const path = findPath(data[0], nodeDatum.id);
    setHighlightedPath(path || []);
  }, [data]);

  // Stable callback for custom links
  const customLink = useCallback((rd3tProps) => {
    const { source, target, path } = rd3tProps;
    const isHighlighted =
      highlightedPath.includes(source.id) &&
      highlightedPath.includes(target.id);
    return (
      <path
        d={path}
        stroke={isHighlighted ? '#e91e63' : '#ccc'}
        strokeWidth={isHighlighted ? 4 : 2}
        fill="none"
      />
    );
  }, [highlightedPath]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.title}>People</div>
        <div className={styles.actions}>
          <span className={styles.total}>Total: {employeeCount}</span>
          <button className={styles.filterButton}>Filters</button>
          <button className={styles.directoryButton}>Directory</button>
        </div>
      </header>

      <div className={styles.chartContainer}>
        {data && (
          <Tree
            data={data}
            orientation="vertical"
            pathFunc="diagonal"
            translate={{ x: window.innerWidth / 2, y: 100 }}
            separation={{ siblings: 1.5, nonSiblings: 2 }}
            nodeSize={{ x: 120, y: 100 }}
            renderCustomNodeElement={(props) => (
              <CustomNode
                {...props}
                onNodeClick={handleNodeClick}
                selectedPath={highlightedPath}
              />
            )}
            renderCustomLinkElement={customLink}
          />
        )}
      </div>
    </>
  );
};

export default OrgChart;