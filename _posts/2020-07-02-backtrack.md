---
title: 回溯算法
date: "2020-07-02"
author: Yoha
tags:
    - 算法
    - Leetcode
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017111554.jpg
meta:
  - name: title
    content: 回溯算法
  - name: description
    content: 回溯算法
  - name: keywords
    content: 回溯算法
  - name: author
    content: Yoha
featured: true
---
# 回溯算法及题目

|题号|题目|Tag|
|:--:|:--:|:--:|
|39|组合总和|数组、回溯算法|
|40|组合总和II|数组、回溯算法|
|46|全排列|数组、回溯算法|
|51|N皇后|数组、回溯算法|

墙裂推荐这篇文章:[回溯算法解题套路框架](https://labuladong.gitbook.io/algo/di-ling-zhang-bi-du-xi-lie/hui-su-suan-fa-xiang-jie-xiu-ding-ban)

下面内容大多参考上面这篇文章，对其作者**labuladong**表示感谢。

## 回溯算法的框架

**解决一个回溯问题，实际上就是一个决策树的遍历过程。** 只需要思考3个问题：

- 路径：也就是已经做出的选择
- 选择列表：也就是当前可以做的选择
- 结束条件：也就是到达决策树底层，无法再做选择的条件。

在后面的题目中会对这个三个词语再进行解释。

代码方面，回溯算法的框架：

```javascript
let res = [];
function backtrack(路径, 选择列表) {
	if(满足结束条件) {
		res.add(路径);
		return;
	}
	//for循环
	for (let 选择 in 选择列表) {
		做选择
		backtrack(路径, 选择列表)
		撤销选择
	}
}
```

**其核心就是for循环里面的递归，在递归之前「做选择」,在递归之后「撤销选择」**. 关于做选择和撤销选择，先通过**全排列**这个问题来了解一下。

### 全排列

我们知道n个不重复的数，全排列共有n!个。

>为了简单清晰起见，这次只考虑全排列问题不包含重复的数字。

那么我们当时是怎么穷举全排列的呢？比方说给三个数 [1,2,3]，你肯定不会无规律地乱穷举，一般是这样：

先固定第一位为 1，然后第二位可以是 2，那么第三位只能是 3；然后可以把第二位变成 3，第三位就只能是 2 了；然后就只能变化第一位，变成 2，然后再穷举后两位……

其实这就是回溯算法，我们高中无师自通就会用，或者有的同学直接画出如下这棵回溯树：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017111452.jpg)

只要从根遍历这棵树，记录路径上的数字，其实就是所有的全排列。**我们不妨把这棵树称为回溯算法的「决策树」。**

**为啥说这是决策树呢，因为你在每个节点上其实都在做决策。** 比如你站在下图的红色节点上：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017111540.jpg)

你现在就在做决策，可以选择 1 那条树枝，也可以选择 3 那条树枝。为啥只能在 1 和 3 之中选择呢？因为 2 这个树枝在你身后，这个选择你之前做过了，而全排列是不允许重复使用数字的。

**现在就可以解答开头的几个名词：[2]就是「路径」，[1,3]就是「选择列表」，表示你当前可以做出的选择；「结束条件」就是遍历到树的底层，在这里就是选择列表为空的时候。**

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017111554.jpg)

**我们定义的backtrack函数其实就像一个指针，在这棵树上游走，同时要正确维护每个节点的属性，每当走到树的底层，其「路径」就是一个全排列。**

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017111612.jpg)

所以说for循环里面的递归就是回溯算法的关键：

```javascript
for 选择 in 选择列表
	//做选择
	路径.push(选择)
	backtrack(路径,选择列表)
	//撤销选择
	路径.pop(选择)
```

我们只要在递归之前做出选择，在递归之后撤销刚才的选择，就可以正确地得到每个节点的选择列表和路径。

### 46、全排列代码：

```javascript
//给定一个 没有重复 数字的序列，返回其所有可能的全排列。
//
// 示例:
//
// 输入: [1,2,3]
//输出:
//[
//  [1,2,3],
//  [1,3,2],
//  [2,1,3],
//  [2,3,1],
//  [3,1,2],
//  [3,2,1]
//]

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
	//res记录结果 track记录路径
  let res = [], track = [];
  if (nums.length == 0) return [];
  backtrack(track);

  function backtrack(track) {
		//触发递归结束条件
    if (track.length == nums.length) {
      res.push(track.slice());
      return;
    }
    for (let i = 0; i < nums.length; i++) {
			//每个数字只能用一次，排除不合法选择，剪枝
      if (track.includes(nums[i])) continue;
			//做选择
      track.push(nums[i]);
			//进入下一层决策树
      backtrack(track);
			//撤销选择
      track.pop();
    }
  }

  return res;
};
```

我们这里稍微做了些变通，没有显式记录「选择列表」，而是通过 nums 和 track 推导出当前的选择列表：判断track.includes(nums[i])。

### 39、组合总和

```javascript
//给定一个无重复元素的数组 candidates 和一个目标数 target ，找出 candidates 中所有可以使数字和为 target 的组合。
//
// candidates 中的数字可以无限制重复被选取。
//
// 说明：
//
//
// 所有数字（包括 target）都是正整数。
// 解集不能包含重复的组合。
//
//
// 示例 1:
//
// 输入: candidates = [2,3,6,7], target = 7,
//所求解集为:
//[
//  [7],
//  [2,2,3]
//]
//
//
// 示例 2:
//
// 输入: candidates = [2,3,5], target = 8,
//所求解集为:
//[
//  [2,2,2,2],
//  [2,3,3],
//  [3,5]
//]
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */

 var combinationSum = function (candidates, target) {
	 let res = [], track = [];
	 candidates.sort((a, b) => a - b);

	 function backtrack(target, track, start) {
		 //递归终止条件
		 if(target == 0) {
			 res.push(track.slice());
			 return;
		 }
		 for(let i = start; i < candidates.length; i++) {
			 //对数组排序后，剪枝优化
			 if(target < candidates[i]) break;
			 //做选择
			 track.push(candidates[i]);
			 //进入下一层决策树，candidates为选择列表，track为路径
			 backtrack(target - candidates[i], track, i);
			 //取消选择，返回上一层决策树
			 track.pop();
		 }
	 }

	 //解集不能包含重复的组合,通过改变遍历选择列表的起始位置实现,已经遍历过的元素不再考虑。
	 backtrack(target, track, 0);

	 return res;
 }
```

### 40、组合总和II

这个和第39题的不同之处在于，数组中的元素可以重复, 并且每个数字在每个组合中只能使用一次。

```javascript
//给定一个数组 candidates 和一个目标数 target ，找出 candidates 中所有可以使数字和为 target 的组合。
//
// candidates 中的每个数字在每个组合中只能使用一次。
//
// 说明：
//
//
// 所有数字（包括目标数）都是正整数。
// 解集不能包含重复的组合。
//
//
// 示例 1:
//
// 输入: candidates = [10,1,2,7,6,1,5], target = 8,
//所求解集为:
//[
//  [1, 7],
//  [1, 2, 5],
//  [2, 6],
//  [1, 1, 6]
//]
//
//
// 示例 2:
//
// 输入: candidates = [2,5,2,1,2], target = 5,
//所求解集为:
//[
//  [1,2,2],
//  [5]
//]
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function (candidates, target) {
	let res = [], track = [];
	candidates.sort((a, b) => a - b);

	function backtrack(target, track, start) {
		if(target == 0) {
			res.push(track.slice());
			return;
		}
		for(let i = start; i < candidates.length; i++) {
			//对于重复的元素，只让第一个进入循环
			if(i - start > 0 && candidates[i - 1] == candidates[i]) continue;
			if(target < candidates[i]) break;
			track.push(candidates[i]);
			// 因为元素不可以重复使用，这里递归传递下去的是 i + 1 而不是 i
			backtrack(target - candidates[i], track, i + 1);
			track.pop();
		}
	}

	backtrack(target, track, 0);
	return res;
}
```

### 51、N皇后

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017111637.jpg)

>ps:皇后，是国际象棋中的棋子，意味着国王的妻子。皇后只做一件事，那就是“吃子”。当她遇见可以吃的棋子时，就迅速冲上去吃掉棋子。当然，她横、竖、斜都可走一到七步,可进可退。

```javascript
/**
 * @param {number} n
 * @return {string[][]}
 */
var solveNQueens = function (n) {
	let res = [], board = [];
	//初始化棋盘
	for(let i = 0; i < n; i++) {
		board[i] = new Array(n).fill('.');
	}

	function backtrack(board, row) {
		//递归终止条件
		if(row == board.length) {
			//对符合条件的棋盘进行深拷贝
			res.push(JSON.parse(JSON.stringify(board)));
			return;
		}
		for(let column = 0; column < board.length; column++) {
			if(!isValid(board, row, column)) continue;
			// 做选择
			board[row][column] = 'Q';
			// 进入下一行
			backtrack(board, row + 1);
			// 撤销选择
			board[row][column] = '.';
		}
	}

	function isValid(board, row, column) {
		//检查列
		for(let m = 0; m < board.length; m++) {
			if(board[m][column] == 'Q') return false;
		}
		//检查/ 右上角
		for(let m = row - 1, n = column + 1; m >= 0 && n < board.length; m--, n++) {
			if(board[m][n] == 'Q') return false;
		}
		//检查\ 左上角
		for(let m = row - 1, n = column - 1; m >= 0 && n >= 0; m--, n--) {
			if(board[m][n] == 'Q') return false;
		}
		return true;
	}

	backtrack(board, 0);
	return res.map(item => {
        return item.map(subitem => subitem.join(''));
  });;
}
```

## 最后

回溯算法就是个多叉树的遍历问题，关键就是在前序遍历和后序遍历的位置做一些操作，算法框架如下：

```javascript
	//for循环
	for (let 选择 in 选择列表) {
		做选择
		backtrack(路径, 选择列表)
		撤销选择
	}
```

**写backtrack函数时，需要维护走过的「路径」和当前可以做的「选择列表」，当触发「结束条件」时，将「路径」记入结果集。**
