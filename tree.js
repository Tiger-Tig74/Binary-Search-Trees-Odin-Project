class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

export class Tree {
    constructor(array) {
        this.root = this.#buildTree(array);
    }

    #buildTree(array) {
        const sorted = [...new Set(array)].sort((a, b) => a - b);
        return this.#buildFromSorted(sorted, 0, sorted.length - 1);
    }

    #buildFromSorted(sorted, lo, hi) {
        if (lo > hi) return null;
        const mid = Math.floor((lo + hi) / 2);
        const node = new Node(sorted[mid]);
        node.left = this.#buildFromSorted(sorted, lo, mid - 1);
        node.right = this.#buildFromSorted(sorted, mid + 1, hi);
        return node;
    }

    includes(value) {
        let current = this.root;
        while (current) {
            if (value === current.data) return true;
            current = value < current.data ? current.left : current.right;
        }
        return false;
    }

    insert(value) {
        this.root = this.#insert(this.root, value);
    }

    #insert(node, value) {
        if (node === null) return new Node(value);
        if (value < node.data) node.left = this.#insert(node.left, value);
        else if (value > node.data) node.right = this.#insert(node.right, value);
        return node;
    }

    deleteItem(value) {
        this.root = this.#delete(this.root, value);
    }

    #delete(node, value) {
        if (node === null) return null;

        if (value < node.data) {
            node.left = this.#delete(node.left, value);
            return node;
        }
        if (value > node.data) {
            node.right = this.#delete(node.right, value);
            return node;
        }

        if (!node.left && !node.right) return null;
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        let successor = node.right;
        while (successor.left) successor = successor.left;
        node.data = successor.data;
        node.right = this.#delete(node.right, successor.data);
        return node;
    }

    levelOrderForEach(callback) {
        if (typeof callback !== 'function') {
            throw new Error('A callback function is required');
        }
        if (!this.root) return;

        const queue = [this.root];
        while (queue.length > 0) {
            const node = queue.shift();
            callback(node.data);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }

    inOrderForEach(callback) {
        if (typeof callback !== 'function') {
            throw new Error('A callback function is required');
        }
        this.#inOrder(this.root, callback);
    }

    #inOrder(node, callback) {
        if (!node) return;
        this.#inOrder(node.left, callback);
        callback(node.data);
        this.#inOrder(node.right, callback);
    }

    preOrderForEach(callback) {
        if (typeof callback !== 'function') {
            throw new Error('A callback function is required');
        }
        this.#preOrder(this.root, callback);
    }

    #preOrder(node, callback) {
        if (!node) return;
        callback(node.data);
        this.#preOrder(node.left, callback);
        this.#preOrder(node.right, callback);
    }

    postOrderForEach(callback) {
        if (typeof callback !== 'function') {
            throw new Error('A callback function is required');
        }
        this.#postOrder(this.root, callback);
    }

    #postOrder(node, callback) {
        if (!node) return;
        this.#postOrder(node.left, callback);
        this.#postOrder(node.right, callback);
        callback(node.data);
    }

    height(value) {
        const node = this.#findNode(value);
        if (!node) return undefined;
        return this.#heightOf(node);
    }

    #heightOf(node) {
        if (!node) return -1;
        return 1 + Math.max(this.#heightOf(node.left), this.#heightOf(node.right));
    }

    depth(value) {
        let current = this.root;
        let depth = 0;
        while (current) {
            if (value === current.data) return depth;
            current = value < current.data ? current.left : current.right;
            depth++;
        }
        return undefined;
    }

    #findNode(value) {
        let current = this.root;
        while (current) {
            if (value === current.data) return current;
            current = value < current.data ? current.left : current.right;
        }
        return null;
    }

    isBalanced() {
        return this.#isBalanced(this.root) !== null;
    }

    #isBalanced(node) {
        if (!node) return -1;

        const leftH = this.#isBalanced(node.left);
        if (leftH === null) return null;

        const rightH = this.#isBalanced(node.right);
        if (rightH === null) return null;

        if (Math.abs(leftH - rightH) > 1) return null;

        return 1 + Math.max(leftH, rightH);
    }

    rebalance() {
        const values = [];
        this.inOrderForEach((v) => values.push(v));
        this.root = this.#buildFromSorted(values, 0, values.length - 1);
    }

    prettyPrint() {
        printTree(this.root);
    }
}

export const prettyPrint = (node, prefix = '', isLeft = true) => {
    if (node === null || node === undefined) return;
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
};

const printTree = (node) => prettyPrint(node);