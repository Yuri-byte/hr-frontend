/**
 * Find the path of IDs from `root` to the node whose id === `targetId`.
 * Returns an array of IDs, or null if not found.
 */
function findPath(root, targetId) {
  if (root.id === targetId) return [root.id];
  if (!root.children) return null;

  for (let child of root.children) {
    const childPath = findPath(child, targetId);
    if (childPath) {
      return [root.id, ...childPath];
    }
  }

  return null;
}

/**
 * Recursively count this node + all descendants.
 */
function countEmployees(node) {
  // assume node always exists and has .children
  return 1 + (node.children || []).reduce(
    (sum, child) => sum + countEmployees(child),
    0
  );
}

const convertToD3Format = (employee) => ({
  id: employee.id,
  name: employee.name,
  attributes: { role: employee.role },
  photo_url: employee.photo_url,
  children: employee.children?.map(convertToD3Format) || [],
  hasChildren: employee.children && employee.children.length > 0,
});

export {countEmployees, findPath, convertToD3Format}