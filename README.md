# virtual-dom       
```unix
yo hlj-page virtual-dom
```


 **任务：**  
> 你是否听过React的Virtual dom？是否看到很多介绍性的文章还是不明觉厉？其实学习代码最好的方式是手动试试，看看她到底如何工作，直接从代码中找寻答案，尝试编写简单示例。

**本次任务主要围绕以下几个问题：**  
1. 虚拟dom是用来做什么的？
2. 虚拟dom解决了什么问题以及是如何解决的？
3. 我们可以用这些库来做什么？
4. 结合react的机制进行拓展  
***
  
1.什么是虚拟dom：  
```
虚拟dom保存了真实的dom层次关系和一些基本属性，与真是的dom一一对应
``` 
2.虚拟dom是用来做什么的？解决了什么问题？
```javascript
dom节点包括标签，属性和子节点，dom是很慢的，其元素非常庞大，   
页面的性能大部分都是由dom操作引起的，对于复杂的文档dom结构，   
提供一种方便的工具，进行最小化的dom操作，dom很慢，而JavaScript很快，   
用JavaScript可以很容易的表示dom节点.   
```   

把一个简单的div元素的属性打印出来看下(这仅仅是第一层)
![dom ](https://github.com/ilvseyinfu/blog/raw/master/images/dom.jpeg)  
3.它是如何解决的？   
```javascript
既然我们可以用JavaScript对象来表示dom结构，那么当数据状态发生变化而需要改变dom结构时，   
我们先通过js对象表示的虚拟dom计算出实际dom需要做的最小变动，然后再操作实际dom，   
从而避免了粗放式的dom操作带来的性能问题   
          
eg:   
<ul id="list">
  <li class="item">Item 1</li>
  <li class="item">Item 2</li>
  <li class="item">Item 3</li>
</ul>   

var element = {
  tagName: 'ul', // 标签
  props: {
    id: 'list'  // 属性
  }, 
  children: [   // 子节点 
    {tagName: 'li', props: {class: 'item'}, children: ["Item 1"]},
    {tagName: 'li', props: {class: 'item'}, children: ["Item 2"]},
    {tagName: 'li', props: {class: 'item'}, children: ["Item 3"]},
  ]
}
```
4.我们可以用这些库来做什么？
```javascript
var h = require("virtual-dom/h") //先声明一个dom的样子 virtual-dom
var leftNode = h("div")
var rightNode = h("text")

var createElement = require('virtual-dom/create-element') //变成真实的html dom节点 
var rootNode = createElement(leftNode)
document.body.appendChild(rootNode)

var diff = require("virtual-dom/diff") // oldtree 和newtree 两个虚拟dom做比较，补丁放入patches
var patches = diff(leftNode, rightNode)

var patch = require("virtual-dom/patch") // 把打好的补丁放进去
rootNode = patch(rootNode, patches)

//1.diff递归找出不同，存入差异数组，包含自身位置，父组件位置，差异类型diff
//2.根据差异类型和差异信息，对旧的虚拟dom进行操作
//3.所有处理结束后，一次性操作真实dom完成处理patch
```   
5.React的机制图
```
当该节点state发生更改，连带着它所有的子节点都会发生更改，computer diff就会和真实的dom做一个   
比较，看看哪个节点发生更改，然后做一个重新的渲染，之所以做diff，就是为了在re-render时提高效率
```
![react ](https://github.com/ilvseyinfu/VirtualDom/raw/master/img/react.png)  
6.什么是diff算法？
```
计算一棵树形结构转换成另一棵树形结构的最少操作，标准的的Diff算法通过循环递归对节点进行依次   
对比，这是一个复杂度为O(n^3) 的问题，n是树中节点的总数，这种指数型的性能消耗对于前端渲染场   
景来说代价太高了，如果react仅仅只是单纯的引入diff 算法，而没有任何的优化，要实现virtual-dom   
的这种思想，那么效率是远远无法满足前端渲染所需要的性能，所以这势必要对diff算法进行优化
```   
7.react的diff算法
   -  web ui中dom节点跨层级的操作特别少，可以忽略不计   
```
基于第一点，对树进行分层比较，两棵树只会对同一层次的节点进行比较，当发现该节点不存在，   
该节点连同子节点一起被删掉，不会用作比较，这样只用对树进行一次遍历，便能完成整个dom树的比较
```   
   - 拥有相同类的两个组件会产生相同的树形结构，拥有不同类的两个组件会产生不同的树形结构   
```javascript
基于第二点，在react中比较两个虚拟DOM节点，当两个节点不同时(节点类型不同，节点属性不同)，react 
直接删除旧的节点，创建并插入新的节点。
RenderA:<Header/> 
RenderB:<Content/>
RemoveNode <Header>, insertNode <Content/>    
RenderA:<div style={{color: 'red'}} />
RenderB:<div style={{color: 'green'}} />
RemoveStyle {color: 'red'},addStyle {color: 'green'} 
```   

   - 对于同一层级的一组子节点，他们可以通过唯一id进行区分   
   
```
发现B!=A，RemoveNode(A),CreatNode(B),inserNode(B)以此类推...创建ADC，删除BCD，    
针对这一现象提出优化：允许开发者对同一层级的同组子节点，添加唯一的key进行区分   
基于第三点通过diff差异化对比时，通过key发现新老集合中的节点都是相同的节点，   
因此无需进行节点的删除和创建，只要将位置进行移动即可，   
react给出的diff结果为：B D不做任何操作，移动A C即可
```   
![dom ](https://github.com/ilvseyinfu/blog/raw/master/images/dom2.jpeg)     
8.总结   
```
Virtual DOM算法包括以下几个步骤：
1. 用JavaScript对象表示DOM树的结构，然后用这个树构建一个真正的DOM树，插到文档中去
2. 当状态改变后，重新构造一颗新的对象树，然后旧的树和新的树进行比较，记录两个数的差异
3. 将2中所记录的差异应用到1中所构建的真正的DOM树种，视图就更新了   

我认为，Virtual DOM 就是在JavaScript和DOM之间做了一个缓存
```
