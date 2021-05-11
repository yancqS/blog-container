---
title: python学习手册
description: 本文主要记录在学习python时的笔记，阅读书籍为《Python编程从入门到实践》，持续更新。
languages:
  - python
---

# 变量和简单数据类型

## 变量

变量命名规则：
- 变量名只能包含字母、数字和下划线。变量名能以字母或下划线打头，但不能以数字打头。
- 变量名**不**能包含空格，但可以使用下划线分割其中的单词。如`greeting_message`。
- 不要将python关键字和函数名用作变量，如`print`。

>就目前而言，应该使用小写的python变量名。虽然大写字母不会导致错误，但是大写字母在变量名中有特殊含义，后面会提及。

```py
message = 'hello world'
print(message)
```

## 字符串

字符串就是一系列字符。在python中，用引号引起来的都是字符串，其中引号可以是单引号，也可以是双引号。

### 使用方法修改字符串的大小写

- String.title(): 以首字母大写的方式先是每个单词
- String.upper(): 将字符串改为全部大写
- String.lower(): 将字符串改为全部小写

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210509223536.png)

### 在字符串中使用变量

要在字符串中插入变量的值，可在首引号前加上字母f，再将要插入的变量放在花括号内。这种字符串为**f字符串**。f是format的简写，因为python通过把花括号内的变量替换为其值来设置字符串的格式。

```py
first_name = 'ada'
last_name = 'lovelace'
full_name = f'{ first_name } { last_name }'
print(f'Hello, { full_name.title() }')
```

>注意, f字符串是python3.6引入的。在之前的版本中，需要使用`format()`方法。比如：`full_name = '{} {}'.format(first_name, last_name)`

### 增加空白

在编程中，空白泛指任何任何非打印字符，比如空格，制表符和换行符。(`\t`, `\n`)

```py
print('Language: \n\tPython\n\tC\n\tJavaScript')
```

### 删除空白

- String.rstrip(): 删除字符串末尾空白
- String.lstrip(): 删除字符串开头的空白
- String.srtip(): 删除字符串两边的空白

## 数

在Python中，可对整数执行加(`+`)减(`-`)乘(`*`)除(`/`)运算。使用两个乘号表示乘方运算。

将任意两个数相除时，结果总是浮点数，即便这两个数都是整数且能整除。

在其他运算中，如果一个操作数是整数，另一个操作数时浮点数，结果也总是浮点数。

```py
print(4 / 2) # 2.0
print(1 + 2.0) # 3.0
print(2 * 3,0) # 6.0
print(3.0 ** 2) # 9.0
```

书写很大的数时，可使用下划线将其中的数字分组，使其更加清晰易读：

```py
big_number = 14_000_00000_0
print(big_number) # 14000000000
```

这是因为在存储这种数时，python会忽略其中的下划线。

同时给多个变量赋值:

```py
x, y, z = 0, 0, 0
```

Python没有内置的常量类型，但python程序员会使用全大写来指出应将某个变量视为常量，其值应始终不变：

```py
MAX_CONNECTION = 5000
```

## 列表简介

### 列表是什么

**列表**由一系列特定顺序排列的元素组成，元素之间可以没有任何关系。在Python中，用方括号(`[]`)表示列表，并用逗号分割其中的元素。

```py
letters = ['a', 'b', 'c']
print(letters) # ['a', 'b', 'c']
```

#### 访问/使用列表中的元素

列表是有序集合，因此要访问列表中的任何元素，只要将该元素的位置（索引）告诉python即可。

```py
letters = ['a', 'b', 'c']
print(letters[0]) # a
print(letters[0].upper()) # A
print(letters[-1]) # c
print(letters[-2]) # b
message = f'The first letter is { letters[0] }'
print(message) # The first letter is a
```

#### 修改、添加和删除元素

```py
students = ['Tom', 'jack', 'kevin', 'Eric']
print(students) # ['Tom', 'jack', 'kevin', 'Eric']

# 修改
students[1] = 'Eva'
print(students) # ['Tom', 'Eva', 'kevin', 'Eric']

# 末尾添加元素
students.append('Cat')
print(students) # ['Tom', 'Eva', 'kevin', 'Eric', 'Cat']

# 插入元素
students.insert(1, 'snake')
print(students) # ['Tom', 'snake', 'Eva', 'kevin', 'Eric', 'Cat']

# 删除元素：del语句删除
del students[0]
print(students) # ['snake', 'Eva', 'kevin', 'Eric', 'Cat']

# 删除元素：pop()方法删除末尾元素
popped_student = students.pop()
print(popped_student) # Cat
print(students) # ['snake', 'Eva', 'kevin', 'Eric']

# pop弹出列表中任何位置的元素
second_student = students.pop(1)
print(f'The second student is { second_student }')
print(students) # ['snake', 'kevin', 'Eric']

# 根据值删除元素
students.remove('kevin')
print(students) # ['snake', Eric']

fake_student = 'snake'
students.remove(fake_student)
print(f"{ fake_student } isn't a student") # snake isn't a student
print(students) # ['Eric']
```

>方法remove()只删除第一个指定的值。如果要删除的值可能在列表中出现多次，就需要循环来确保每个值都删除。

### 组织列表

```py
# 使用sort()方法对列表永久排序
cars = ['bmw', 'audi', 'toyota', 'subaru']
```

