import { Tree } from './tree.js';

function randomArray(n = 20, max = 100) {
    return Array.from({ length: n }, () => Math.floor(Math.random() * max));
}

const pretty = (label, values) => console.log(`${label}: [${values.join(', ')}]`);

const arr = randomArray(20, 100);
console.log('Input array:', arr);
const tree = new Tree(arr);

console.log('\nisBalanced() before unbalancing:', tree.isBalanced());

{
    const out = [];
    tree.levelOrderForEach((v) => out.push(v));
    pretty('\nLevel order', out);
}
{
    const out = [];
    tree.preOrderForEach((v) => out.push(v));
    pretty('Pre order', out);
}
{
    const out = [];
    tree.postOrderForEach((v) => out.push(v));
    pretty('Post order', out);
}
{
    const out = [];
    tree.inOrderForEach((v) => out.push(v));
    pretty('In order', out);
}

[150, 200, 250, 300, 350].forEach((v) => tree.insert(v));
console.log('\nInserted 150, 200, 250, 300, 350');

console.log('isBalanced() after inserts:', tree.isBalanced());

tree.rebalance();
console.log('\nCalled rebalance()');

console.log('isBalanced() after rebalance:', tree.isBalanced());

{
    const out = [];
    tree.levelOrderForEach((v) => out.push(v));
    pretty('\nLevel order (post-rebalance)', out);
}
{
    const out = [];
    tree.preOrderForEach((v) => out.push(v));
    pretty('Pre order (post-rebalance)', out);
}
{
    const out = [];
    tree.postOrderForEach((v) => out.push(v));
    pretty('Post order (post-rebalance)', out);
}
{
    const out = [];
    tree.inOrderForEach((v) => out.push(v));
    pretty('In order (post-rebalance)', out);
}

console.log('\n--- final tree ---');
tree.prettyPrint();