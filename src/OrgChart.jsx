import React, { useEffect, useState, useMemo, useCallback, useRef, useLayoutEffect } from 'react';
import Tree from 'react-d3-tree';
import CustomNode from './CustomNode';
import { countEmployees, findPath, convertToD3Format } from './utils/OrgTree'
import styles from './styles/OrgChart.module.css';
import EmployeeSidebar from './EmployeeSidebar';
import DirectoryPanel from './DirectoryPanel';
import { AnimatePresence } from 'framer-motion';


const OrgChart = () => {
  const [data, setData] = useState(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [collapsedNodeIds, setCollapsedNodeIds] = useState(new Set());
  const [showDirectory, setShowDirectory] = useState(false);
  const treeRef = useRef(null);
  const layoutNodeMap = useRef(new Map());
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    fetch('https://hr-portfolio-luil.onrender.com/api/employees/tree/')
      .then(res => res.json())
      .then(tree => {
        const formatted = convertToD3Format(tree);
        setData([formatted]); // wrap in array for react-d3-tree
      });
  }, []);

  useEffect(() => {
    if (!selectedEmployeeId) return;
  
    fetch(`https://hr-portfolio-luil.onrender.com/api/employees/${selectedEmployeeId}/`)
      .then(res => res.json())
      .then(setSelectedEmployeeDetails)
      .catch(err => {
        console.error("Failed to load employee details:", err);
        setSelectedEmployeeDetails(null);
      });
  }, [selectedEmployeeId]);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  // only recompute when `data` changes:
  const employeeCount = useMemo(() => {
    if (!data) return 0;
    return countEmployees(data[0]);
  }, [data]);

  const visibleData = useMemo(() => {
    if (!data) return null;
  
    const prune = (node) => {
      const isCollapsed = collapsedNodeIds.has(node.id);
      return {
        ...node,
        children: isCollapsed ? [] : node.children?.map(prune) || [],
      };
    };
  
    return [prune(data[0])];
  }, [data, collapsedNodeIds]);

  const selectNodeById = useCallback((id) => {
    const path = findPath(data[0], id);
    if (!path) return;
  
    // Expand all ancestors
    setCollapsedNodeIds(prev => {
      const next = new Set(prev);
      path.forEach(pid => next.delete(pid));
      return next;
    });

    setTimeout(() => {
      const layoutNode = layoutNodeMap.current.get(id);
      if (!layoutNode) {
        console.warn('Layout node not found in map');
        return;
      }
      const { x, y } = layoutNode.hierarchyPointNode;
      const nodeOffsetX = 300;
      const nodeOffsetY = 150;
      const correctedNode = { ...layoutNode.hierarchyPointNode }
      correctedNode.x = x + nodeOffsetX;
      correctedNode.y = y + nodeOffsetY;
      treeRef.current.centerNode(correctedNode);
    }, 0);
  
    // Highlight + show sidebar
    setSelectedEmployeeId(id);
    setHighlightedNodeId(id);
}, [data]);

  // Stable callback to handle clicks
  const handleNodeClick = useCallback((nodeDatum) => {
    selectNodeById(nodeDatum.id);
  }, [selectNodeById]);
  

  const toggleCollapse = useCallback((id) => {
    setCollapsedNodeIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.title}>People</div>
        <div className={styles.actions}>
          <span className={styles.total}>Total: {employeeCount}</span>
          <button 
            className={styles.directoryButton}
            onClick={() => setShowDirectory(prev => !prev)}
          >
            Directory
          </button>
        </div>
      </header>
      {showDirectory && (
        <DirectoryPanel
          data={data}
          onClose={() => setShowDirectory(false)}
          onSelect={(emp) => {
            selectNodeById(emp.id);
            setShowDirectory(false);
          }}
        />
      )}
      <div className={styles.chartWrapper}>
        <AnimatePresence>
          {selectedEmployeeDetails && (
            <EmployeeSidebar
              employee={selectedEmployeeDetails}
              onClose={() => {
                setSelectedEmployeeDetails(null);
                setSelectedEmployeeId(null);
              }}
            />
          )}
        </AnimatePresence>
        
        <div className={styles.chartContainer} ref={containerRef}>
          {data && (
            <Tree
              ref={treeRef}
              data={visibleData}
              dimensions={dimensions}
              orientation="vertical"
              pathFunc="elbow"
              translate={{ x: window.innerWidth / 2, y: 200 }}
              separation={{ siblings: 1, nonSiblings: 2 }}
              nodeSize={{ x: 200, y: 200 }}
              renderCustomNodeElement={(rd3tProps) => {
                const id = rd3tProps.nodeDatum?.id;
                if (id) {
                  layoutNodeMap.current.set(id, rd3tProps); // cache the layout node
                }
              
                return (
                  <CustomNode
                    {...rd3tProps}
                    onNodeClick={handleNodeClick}
                    isSelected={highlightedNodeId === id}
                    isCollapsed={collapsedNodeIds.has(id)}
                    onToggleCollapse={toggleCollapse}
                  />
                );
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default OrgChart;