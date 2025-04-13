import logging
import time

class BPlusTreeNode:
    def __init__(self, leaf=True):  # Default to leaf=True for simplicity
        self.leaf = leaf
        self.keys = []
        self.children = []
        self.next_leaf = None  # For leaf node traversal

class BPlusTree:
    def __init__(self):
        # Initialize with an empty root node (leaf node)
        self.root = BPlusTreeNode(leaf=True)
        self.created_at = time.time()
        self._hit_count = 0
        self._miss_count = 0

    def insert(self, key, value):
        if not self.root:
            self.root = BPlusTreeNode(leaf=True)
            
        key = tuple(round(float(k), 4) for k in key)
        node = self.root

        # Check if key already exists
        for i, k in enumerate(node.keys):
            if k == key:
                node.children[i] = value
                return

        node.keys.append(key)
        node.children.append(value)
        
        # Sort keys to maintain order (important for B+ trees)
        # This is a simple implementation; a production B+ tree would split nodes
        indices = sorted(range(len(node.keys)), key=lambda i: node.keys[i])
        node.keys = [node.keys[i] for i in indices]
        node.children = [node.children[i] for i in indices]

    def search(self, key):
        if not self.root:
            self._miss_count += 1
            return None
            
        key = tuple(round(float(k), 4) for k in key)
        node = self.root
        
        # Track cache hits/misses
        for i, k in enumerate(node.keys):
            if k == key:
                self._hit_count += 1
                return node.children[i]
        
        self._miss_count += 1
        return None

    def get_all(self):
        """Return all key-value pairs in the B+ tree"""
        result = {}
        
        if not self.root:
            return result
            
        # Simple implementation for single-node tree
        for i in range(len(self.root.keys)):
            key = self.root.keys[i]
            value = self.root.children[i]
            result[key] = value
            
        return result
    
    def size(self):
        """Return the number of keys in the tree"""
        if not self.root:
            return 0
        return len(self.root.keys)
    
    def get_hit_ratio(self):
        """Calculate cache hit ratio"""
        total = self._hit_count + self._miss_count
        if total == 0:
            return 0
        return self._hit_count / total
    
    def print_structure(self):
        """Print a summary of the B+ tree structure"""
        if not self.root:
            logging.info("Empty tree")
            return
            
        logging.info(f"Tree Statistics:")
        logging.info(f"Total Keys: {len(self.root.keys)}")
        logging.info(f"Hit Count: {self._hit_count}")
        logging.info(f"Miss Count: {self._miss_count}")
        if self._hit_count + self._miss_count > 0:
            hit_ratio = self._hit_count / (self._hit_count + self._miss_count)
            logging.info(f"Hit Ratio: {hit_ratio:.2f}")

# Create a shared instance
bptree = BPlusTree()
