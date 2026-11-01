import { Tree } from './tree.js';

let passed = 0;
let failed = 0;

function assertEqual(actual, expected, label) {
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    if (a === e) passed++;
    else {
        failed++;
        console.error(`[Error] ${label}\n   expected: ${e}\n   actual:   ${a}`);
    }
}

function assertThrows(fn, label) {
    try {
        fn();
        failed++;
        console.error(`[Error] ${label} — did not throw`);
    } catch {
        passed++;
    }
}

{
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    const inOrder = [];
    tree.inOrderForEach((v) => inOrder.push(v));
    assertEqual(inOrder, [1, 3, 4, 5, 7, 8, 9, 23, 67, 324, 6345], 'in-order after build');

    const level = [];
    tree.levelOrderForEach((v) => level.push(v));
    assertEqual(level[0], 8, 'levelOrder root is median');
}

{
    const tree = new Tree([10, 5, 15, 3, 7, 12, 20]);
    assertEqual(tree.includes(7), true, 'includes existing');
    assertEqual(tree.includes(99), false, 'includes missing');
}

{
    const tree = new Tree([10, 5, 15]);
    tree.insert(7);
    tree.insert(12);
    tree.insert(99);
    assertEqual(tree.includes(7), true, 'insert adds');
    assertEqual(tree.includes(12), true, 'insert adds');
    assertEqual(tree.includes(99), true, 'insert adds');

    const before = [];
    tree.inOrderForEach((v) => before.push(v));
    tree.insert(10);
    const after = [];
    tree.inOrderForEach((v) => after.push(v));
    assertEqual(after, before, 'insert duplicate is a no-op');
}

{
    const t1 = new Tree([10, 5, 15]);
    t1.deleteItem(5);
    assertEqual(t1.includes(5), false, 'delete leaf');

    const t2 = new Tree([10, 5, 15, 3]);
    t2.deleteItem(5);
    const order = [];
    t2.inOrderForEach((v) => order.push(v));
    assertEqual(order, [3, 10, 15], 'delete node with one child');

    const t3 = new Tree([10, 5, 15, 3, 7, 12, 20]);
    t3.deleteItem(10);
    const order2 = [];
    t3.inOrderForEach((v) => order2.push(v));
    assertEqual(order2, [3, 5, 7, 12, 15, 20], 'delete node with two children');

    t3.deleteItem(999);
    const order3 = [];
    t3.inOrderForEach((v) => order3.push(v));
    assertEqual(order3, order2, 'delete missing is a no-op');
}

{
    const tree = new Tree([10, 5, 15]);

    const level = [];
    tree.levelOrderForEach((v) => level.push(v));
    assertEqual(level, [10, 5, 15], 'levelOrder');

    const pre = [];
    tree.preOrderForEach((v) => pre.push(v));
    assertEqual(pre, [10, 5, 15], 'preOrder');

    const inO = [];
    tree.inOrderForEach((v) => inO.push(v));
    assertEqual(inO, [5, 10, 15], 'inOrder');

    const post = [];
    tree.postOrderForEach((v) => post.push(v));
    assertEqual(post, [5, 15, 10], 'postOrder');

    assertThrows(() => tree.levelOrderForEach(), 'levelOrder throws without callback');
    assertThrows(() => tree.inOrderForEach(), 'inOrder throws without callback');
    assertThrows(() => tree.preOrderForEach(), 'preOrder throws without callback');
    assertThrows(() => tree.postOrderForEach(), 'postOrder throws without callback');
}

{
    const tree = new Tree([10, 5, 15, 3, 7]);

    assertEqual(tree.root.data, 7, 'root is the midpoint');

    assertEqual(tree.height(7), 2, 'height of root');
    assertEqual(tree.height(3), 1, 'height of internal node (left)');
    assertEqual(tree.height(10), 1, 'height of internal node (right)');
    assertEqual(tree.height(5), 0, 'height of leaf (left)');
    assertEqual(tree.height(15), 0, 'height of leaf (right)');
    assertEqual(tree.height(99), undefined, 'height of missing');

    assertEqual(tree.depth(7), 0, 'depth of root');
    assertEqual(tree.depth(3), 1, 'depth of left child');
    assertEqual(tree.depth(10), 1, 'depth of right child');
    assertEqual(tree.depth(5), 2, 'depth of left grandchild');
    assertEqual(tree.depth(15), 2, 'depth of right grandchild');
    assertEqual(tree.depth(99), undefined, 'depth of missing');
}

{
    assertEqual(new Tree([1, 2, 3]).isBalanced(), true, 'balanced 3-node');
    assertEqual(new Tree([]).isBalanced(), true, 'empty tree balanced');
    assertEqual(new Tree([1]).isBalanced(), true, 'single node balanced');

    const un = new Tree([1, 2, 3, 4]);
    assertEqual(un.isBalanced(), true, 'balanced when built from sorted');

    un.insert(5);
    un.insert(6);
    un.insert(7);
    assertEqual(un.isBalanced(), false, 'unbalanced after skewed inserts');
}

{
    const tree = new Tree([1, 2, 3, 4, 5]);
    tree.insert(6);
    tree.insert(7);
    tree.insert(8);
    assertEqual(tree.isBalanced(), false, 'unbalanced pre-rebalance');
    tree.rebalance();
    assertEqual(tree.isBalanced(), true, 'balanced post-rebalance');

    for (let v = 1; v <= 8; v++) {
        assertEqual(tree.includes(v), true, `post-rebalance includes ${v}`);
    }
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;