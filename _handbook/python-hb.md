---
title: python学习手册
description: 本文主要记录在学习python时的笔记，阅读书籍为《Python编程从入门到实践》，持续更新。
languages:
  - python
---

## 变量和简单数据类型

### 变量

变量命名规则：
- 变量名只能包含字母、数字和下划线。变量名能以字母或下划线打头，但不能以数字打头。
- 变量名**不**能包含空格，但可以使用下划线分割其中的单词。如`greeting_message`。
- 不要将python关键字和函数名用作变量，如`print`。

>就目前而言，应该使用小写的python变量名。虽然大写字母不会导致错误，但是大写字母在变量名中有特殊含义，后面会提及。

```py
message = 'hello world'
print(message)
```

### 字符串

字符串就是一系列字符。在python中，用引号引起来的都是字符串，其中引号可以是单引号，也可以是双引号。

### 使用方法修改字符串的大小写

- String.title(): 以首字母大写的方式先是每个单词
- String.upper(): 将字符串改为全部大写
- String.lower(): 将字符串改为全部小写

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210509223536.png)

#### 在字符串中使用变量

要在字符串中插入变量的值，可在首引号前加上字母f，再将要插入的变量放在花括号内。这种字符串为**f字符串**。f是format的简写，因为python通过把花括号内的变量替换为其值来设置字符串的格式。

```py
first_name = 'ada'
last_name = 'lovelace'
full_name = f'{ first_name } { last_name }'
print(f'Hello, { full_name.title() }')
```

>注意, f字符串是python3.6引入的。在之前的版本中，需要使用`format()`方法。比如：`full_name = '{} {}'.format(first_name, last_name)`

#### 增加空白

在编程中，空白泛指任何任何非打印字符，比如空格，制表符和换行符。(`\t`, `\n`)

```py
print('Language: \n\tPython\n\tC\n\tJavaScript')
```

#### 删除空白

- String.rstrip(): 删除字符串末尾空白
- String.lstrip(): 删除字符串开头的空白
- String.srtip(): 删除字符串两边的空白

### 数

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

#### 列表排序

```py
# 使用sort()方法对列表永久排序
cars = ['bmw', 'audi', 'toyota', 'subaru']
cars.sort()
print(cars) #  ['audi', 'bmw', 'subaru', 'toyota']

# 相反的顺序排序
cars = ['bmw', 'audi', 'toyota', 'subaru']
cars.sort(reverse=True)
print(cars) #  ['toyota', 'subaru', 'bmw', 'audi']

# 使用函数sorted()对列表临时排序
cars = ['bmw', 'audi', 'toyota', 'subaru']
print(cars) #  ['bmw', 'audi', 'toyota', 'subaru']
print(sorted(cars)) #  ['audi', 'bmw', 'subaru', 'toyota']
print(cars) # ['bmw', 'audi', 'toyota', 'subaru']
print(sorted(cars, reverse=True)) #  ['toyota', 'subaru', 'bmw', 'audi']
```

#### 反转列表元素

反转列表排列顺序，可使用方法`reverse()`

```py
cars = ['bmw', 'audi', 'toyota', 'subaru']
print(cars) #  ['bmw', 'audi', 'toyota', 'subaru']
print(cars.reverse()) #  ['subaru', 'toyota', 'audi', 'bmw']
```

方法`reverse()`也是永久性修改列表元素的排列顺序，但可随时恢复到原来的排列顺序，只需要对列表再次调用`reverse()`方法即可。

#### 确定列表长度

`len()`函数可获得列表长度。

```py
cars = ['bmw', 'audi', 'toyota', 'subaru']
print(len(cars)) #  4
```

## 操作列表

### 遍历列表

```py
magicians = ['alice', 'david', 'carolina']
for magician in magicians:
    print(magician)
print('That was a great magic show')

# 输出为
alice
david
carolina
That was a great magic show
```

>注意缩进&**不要遗忘冒号**

### 创建数字列表

#### range()函数

Python函数`range()`可以生成一系列数。比如：

```py
for value in range(1, 5):
    print(value)

# 输出结果为：
1
2
3
4
```

>左闭右开，很多语言都是这个样子。

#### 使用range()函数创建数字列表

要创建数字列表，可使用函数`list()`将`range()`的结果直接转换为列表。

```py
numbers = list(range(1, 6))
print(numbers) #  [1, 2, 3, 4, 5]

# range() 指定一个参数
numbers = list(range(6))
print(numbers) #  [0， 1, 2, 3, 4, 5]

# range() 第三个参数指定步长
numbers = list(range(0, 6, 2))
print(numbers) #  [0，2, 4]

print(list(range(6, 2))) #  []
```

有几个专门用于处理数字列表的python函数：

- min(list) 找出数字列表中最小值
- max(list) 找出数字列表中最大值
- sun(list) 数字列表总和


#### 列表解析

列表解析将for循环和创建新元素的代码合并到一行，并自动附加新元素。

```py
# 列表解析
squares = [value ** 2 for value in range(1, 11)]
print(squares) #  [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# 等价于
squares = []
for value in range(1, 11):
    squares.append(value ** 2)
print(squares) # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

### 切片

我们已经知道如何访问单个列表元素，以及处理列表的所有元素。除此之外，我们还可以处理列表部分，python称之为**切片**。

要创建切片，可指定要使用的第一个元素和最后一个元素的索引。

```py
players = ['charles', 'martina', 'michnel', 'florance', 'eli']

print(players[0:3])  # ['charles', 'martina', 'michnel']

print(players[:4])  #  ['charles', 'martina', 'michnel', 'florance']

print(players[:4:2])  # ['charles', 'michnel']

print(players[2:])  # ['michnel', 'florance', 'eli']

print(players[-3:])  # ['michnel', 'florance', 'eli']

print(players[: -3])  # ['charles', 'martina']

print(players[:])  # ['charles', 'martina', 'michnel', 'florance', 'eli']
```

如果没有指定起始索引，python从列表开头开始提取；如果省略终止索引,切片终止于列表末尾。

可在切片的方括号内指定第三个值，来告诉python在指定范围内每隔多少元素提取一个。

#### 遍历切片 & 复制列表

```py
players = ['charles', 'martina', 'michnel', 'florance', 'eli']

for play in players[:3]:
    print(play.title())

# 输出：
Charles
Martina
Michnel
```

复制列表

```py
my_foods = ['pizza', 'falafel', 'carrot cake']

frineds_foods = my_foods[:] #  深拷贝
other_friend = my_foods #  浅拷贝

print('my_foods:', my_foods)
print('frineds_foods:', frineds_foods)
print('other_friend:', other_friend)

my_foods.append('ice cream')
frineds_foods.append('cannoli')
other_friend.append('dumpling')

print('-' * 40)

print('my_foods:', my_foods)
print('frineds_foods:', frineds_foods)
print('other_friend:', other_friend)
```

输出为：

```py
my_foods: ['pizza', 'falafel', 'carrot cake']
frineds_foods: ['pizza', 'falafel', 'carrot cake']
other_friend: ['pizza', 'falafel', 'carrot cake']
----------------------------------------
my_foods: ['pizza', 'falafel', 'carrot cake', 'ice cream', 'dumpling']
frineds_foods: ['pizza', 'falafel', 'carrot cake', 'cannoli']
other_friend: ['pizza', 'falafel', 'carrot cake', 'ice cream', 'dumpling']
```

### 元组

列表非常适合用于存储在程序运行期间可能变化的数据集。列表是可以修该的。然而，有时候你需要创建一系列不可修改的元素，**元组**可以满足这种需求。

#### 定义元组 & 遍历元组

元组看起来很像列表，但使用圆括号而非中括号来标识。定义元组后，就可以使用索引来访问其元素，就像访问列表一样。

```py
dimensions = (200, 50)
print(dimensions[0])  # 200
print(dimensions[1])  # 50

# dimensions[0] = 300 #  会导致python报错 TypeError: 'tuple' object does not support item assignment
```

>严格来说，元组是由逗号标识的，圆括号只是让元组看起来更加整洁、更清晰。如果要定义只包含一个元素的元组，必须在这个元素的后面加上逗号：
>`mt_t = (3,)`

遍历元组：

```py
dimensions = (200, 50)

for dimension in dimensions:
    print(dimension)
```

和遍历列表一样。

#### 修改元组变量

虽然不能修改元组的元素，但是可以给存储元组的变量赋值。

```py
dimensions = (100, 200)

dimensions = (200, 400)
```

## if语句

### 检查多个条件

```py
# 使用and检查多个条件
age_0 = 22
age_1 = 18

age_0 >= 21 and age_1 >= 21 #  False

age_1 = 22
age_0 >= 21 and age_1 >= 21 #  True

# 使用or检查多个条件
age_0 = 22
age_1 = 18

age_0 >= 21 or age_1 >= 21 #  True

age_0 = 18
age_0 >= 21 or age_1 >= 21 #  False
```

检查特定值是否包含在列表中:

```py
list = ['mushroom', 'onions', 'pineapple']
'mushroom' in list # True
'pepperoni' in list # False 
```

检查特定值是否不包含在列表中:

```py
ban_users = ['andrew', 'carlion', 'david']
user = 'marie'

if user not in ban_users:
    print(f'{user.title()}, you can post a response if you wash')
```

### if语句/if-else语句/if-elif-else语句

```py
# if语句

age = 19
if age > 18:
    print('You are old enough to vote')

# if-else语句

age = 19
if age > 18:
    print('You are old enough to vote')
else:
    print('Sorry, you are too young to vote')

# if-elif-else语句
age = 12
if age < 4:
    price = 0
elif age < 18:
    price = 25
else:
    price = 40

print(f'Your admission cost is ${price}')
# Your admission cost is $25
```

### 使用多个elif代码块

```py
age = 68
if age < 4:
    price = 0
elif age < 18:
    price = 25
elif age < 65:
    price = 40
else:
    price = 20

print(f'Your admission cost is ${price}')
```

### 省略else代码块

python并不要求if-elif结构后面必须游else代码块。

```py
age = 68
if age < 4:
    price = 0
elif age < 18:
    price = 25
elif age < 65:
    price = 40
elif age >= 65:
    price = 20

print(f'Your admission cost is ${price}')
```

### 测试多个条件

`if-elif-else`结构功能强大，但是仅适合用于只有一个条件满足的情况：遇到通过了的测试后，python就跳过余下的测试。

然而，有时候必须检查你关心的所有条件，在这种情况下，应使用一系列不包含elif和else代码块的简单if语句。在存在多个条件为True且需要在每个条件为True时都采取相应措施时，适合用这种方法。

```py
request_topping = ['mushrooms', 'extra cheese']

if 'mushrooms' in request_topping:
    print('Adding mushrooms')
if 'pepperoni' in request_topping:
    print('Adding pepperoni')
if 'extra cheese' in request_topping:
    print('Adding extra cheese')
    
print('Finished !')
```

### if语句处理列表

#### 检查特殊元素

```py
request_topping = ['mushrooms',  'green peppers', 'extra cheese']

for value in request_topping:
    if value == 'green peppers':
        print('Sorry, we are out of green peppers right now')
    else:
        print(f'Adding {value}')

print('Finished !')
```

#### 确定列表不是空的

```py
request_topping = []

if request_topping:
    for value in request_topping:
        print(f'Adding {value}')
    print('Finished !')
else:
    print('Are you sure you want a plain pizza')
```

### 使用多个列表

```py
avaliable_toppings = ['mushrooms', 'olives', 'green peppers', 'pepperoni', 'pineapple', 'extra cheese']

request_toppings = ['mushrooms', 'french fries', 'extra cheese']

for request_topping in request_toppings:
    if request_topping in avaliable_toppings:
        print(f'Adding {request_topping}')
    else:
        print(f"Sorry, we don't have {request_topping}")

print('Finished !')
```

输出为：

```
Adding mushrooms
Sorry, we don't have french fries
Adding extra cheese
Finished !
```
