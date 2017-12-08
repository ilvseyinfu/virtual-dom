var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

function render(count)  {
    return h('div', {
        style: {
            textAlign: 'center',
            border: '1px solid black',
            width: '100px',
            height: '100px',
            margin: '100px auto',
            transform:'rotate('+count*10+'deg)'
        }
    }, []);
}

//初始化文档
var count = 0;

//先声明一个dom的样子 virtual-dom
var tree = render(count);

//变成真实的html dom节点
var rootNode = createElement(tree);
document.body.appendChild(rootNode);

// 3: Wire up the update logic
setInterval(function () {
      count++;

      var newTree = render(count);
      //oldtree 和newtree 两个虚拟dom做比较，补丁放入patches
      var patches = diff(tree, newTree); //diff递归找出不同，存入差异数组，包含自身位置，父组件位置，差异类型diff
      rootNode = patch(rootNode, patches); // 把打好的补丁放进去
      tree = newTree; // 更新旧的虚拟dom
}, 1000);




