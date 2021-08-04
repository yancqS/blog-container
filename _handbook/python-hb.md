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

```Python
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

```Python
first_name = 'ada'
last_name = 'lovelace'
full_name = f'{ first_name } { last_name }'
print(f'Hello, { full_name.title() }')
```

>注意, f字符串是python3.6引入的。在之前的版本中，需要使用`format()`方法。比如：`full_name = '{} {}'.format(first_name, last_name)`

#### 增加空白

在编程中，空白泛指任何任何非打印字符，比如空格，制表符和换行符。(`\t`, `\n`)

```Python
print('Language: \n\tPython\n\tC\n\tJavaScript')
```

#### 删除空白

- `String.rstrip()`: 删除字符串末尾空白
- `String.lstrip()`: 删除字符串开头的空白
- `String.srtip()`: 删除字符串两边的空白

### 数

在Python中，可对整数执行加(`+`)减(`-`)乘(`*`)除(`/`)运算。使用两个乘号表示乘方运算。

将任意两个数相除时，结果总是浮点数，即便这两个数都是整数且能整除。

在其他运算中，如果一个操作数是整数，另一个操作数时浮点数，结果也总是浮点数。

```Python
print(4 / 2) # 2.0
print(1 + 2.0) # 3.0
print(2 * 3,0) # 6.0
print(3.0 ** 2) # 9.0
```

书写很大的数时，可使用下划线将其中的数字分组，使其更加清晰易读：

```Python
big_number = 14_000_00000_0
print(big_number) # 14000000000
```

这是因为在存储这种数时，python会忽略其中的下划线。

同时给多个变量赋值:

```Python
x, y, z = 0, 0, 0
```

Python没有内置的常量类型，但python程序员会使用全大写来指出应将某个变量视为常量，其值应始终不变：

```Python
MAX_CONNECTION = 5000
```

## 列表简介

### 列表是什么

**列表**由一系列特定顺序排列的元素组成，元素之间可以没有任何关系。在Python中，用方括号(`[]`)表示列表，并用逗号分割其中的元素。

```Python
letters = ['a', 'b', 'c']
print(letters) # ['a', 'b', 'c']
```

#### 访问/使用列表中的元素

列表是有序集合，因此要访问列表中的任何元素，只要将该元素的位置（索引）告诉python即可。

```Python
letters = ['a', 'b', 'c']
print(letters[0]) # a
print(letters[0].upper()) # A
print(letters[-1]) # c
print(letters[-2]) # b
message = f'The first letter is { letters[0] }'
print(message) # The first letter is a
```

#### 修改、添加和删除元素

```Python
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

>方法`remove()`只删除第一个指定的值。如果要删除的值可能在列表中出现多次，就需要循环来确保每个值都删除。

### 组织列表

#### 列表排序

```Python
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

```Python
cars = ['bmw', 'audi', 'toyota', 'subaru']
print(cars) #  ['bmw', 'audi', 'toyota', 'subaru']
print(cars.reverse()) #  ['subaru', 'toyota', 'audi', 'bmw']
```

方法`reverse()`也是永久性修改列表元素的排列顺序，但可随时恢复到原来的排列顺序，只需要对列表再次调用`reverse()`方法即可。

#### 确定列表长度

`len()`函数可获得列表长度。

```Python
cars = ['bmw', 'audi', 'toyota', 'subaru']
print(len(cars)) #  4
```

## 操作列表

### 遍历列表

```Python
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

```Python
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

```Python
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

- `min(list)` 找出数字列表中最小值
- `max(list)` 找出数字列表中最大值
- `sun(list)` 数字列表总和


#### 列表解析

列表解析将for循环和创建新元素的代码合并到一行，并自动附加新元素。

```Python
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

```Python
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

```Python
players = ['charles', 'martina', 'michnel', 'florance', 'eli']

for play in players[:3]:
    print(play.title())

# 输出：
Charles
Martina
Michnel
```

复制列表

```Python
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

```Python
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

```Python
dimensions = (200, 50)
print(dimensions[0])  # 200
print(dimensions[1])  # 50

# dimensions[0] = 300 #  会导致python报错 TypeError: 'tuple' object does not support item assignment
```

>严格来说，元组是由逗号标识的，圆括号只是让元组看起来更加整洁、更清晰。如果要定义只包含一个元素的元组，必须在这个元素的后面加上逗号：
>`mt_t = (3,)`

遍历元组：

```Python
dimensions = (200, 50)

for dimension in dimensions:
    print(dimension)
```

和遍历列表一样。

#### 修改元组变量

虽然不能修改元组的元素，但是可以给存储元组的变量赋值。

```Python
dimensions = (100, 200)

dimensions = (200, 400)
```

## if语句

### 检查多个条件

```Python
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

```Python
list = ['mushroom', 'onions', 'pineapple']
'mushroom' in list # True
'pepperoni' in list # False 
```

检查特定值是否不包含在列表中:

```Python
ban_users = ['andrew', 'carlion', 'david']
user = 'marie'

if user not in ban_users:
    print(f'{user.title()}, you can post a response if you wash')
```

### if语句/if-else语句/if-elif-else语句

```Python
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

```Python
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

```Python
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

```Python
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

```Python
request_topping = ['mushrooms',  'green peppers', 'extra cheese']

for value in request_topping:
    if value == 'green peppers':
        print('Sorry, we are out of green peppers right now')
    else:
        print(f'Adding {value}')

print('Finished !')
```

#### 确定列表不是空的

```Python
request_topping = []

if request_topping:
    for value in request_topping:
        print(f'Adding {value}')
    print('Finished !')
else:
    print('Are you sure you want a plain pizza')
```

### 使用多个列表

```Python
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
## 字典

在python中，**字典**是一系列**键值对**。每个键都与一个值相关联,可以使用键来访问相关联的值。与键相关联的值可以是数、字符串、列表乃至字典。

### 使用字典

```Python
# 获取字典中的值
alien_0 = {
    'color': 'yellow'
}
print(alien_0['color']) # yellow

# 添加键值对

alien_1 = {}

alien_1['x_pos'] = 20
alien_1['y_pos'] = 30

print(alien_1) # {'x_pos': 20, 'y_pos': 30}

# 修改字典中的值

alien_1['x_pos'] = 50

print(alien_1) # {'x_pos': 50, 'y_pos': 30}

# 删除键值对
# 使用del语句时，必须要指定字典明和要删除的键
del alien_1['x_pos']

print(alien_1) # {'y_pos': 30}
```

### 使用get()方法来访问值

使用放在方括号内的键从字典中获取相关联的值时，如果指定的键不存在就会出错。

```Python
favorite_language = {
    'Tom': 'c'
}

print(favorite_language['John'])

# 报错
# Traceback (most recent call last):
#   File "simple_message.py", line 188, in <module>
#     print(favorite_language['John'])
# KeyError: 'John'

```

可以使用get()方法在指定的键不存在时返回一个默认值，从而避免这样的错误。

get()方法的第一个参数用于指定键，是必不可少的，第二个参数为指定的键不存在时要返回的值，是可选的。

```Python
favorite_language = {
    'Tom': 'c'
}

language = favorite_language.get('Tom', 'Python')
print(f'favorite language: {language}') #  favorite language: c

language = favorite_language.get('John', 'Python')
print(f'favorite language: {language}') #  favorite language: Python
```

>调用get()方法时，如果没有指定第二个参数且指定的键不存在时，Python将返回`None`。

### 遍历字典

```Python
favorite_language = {
    'Tom': 'c',
    'Eric': 'Java'
}

print(favorite_language.items())
print(favorite_language.keys())
print(favorite_language.values())
```

输出为：

```
dict_items([('Tom', 'c'), ('Eric', 'Java')])
dict_keys(['Tom', 'Eric'])
dict_values(['c', 'Java'])
```

因此我们可以遍历字典的所有键值对、所有键、所有值。

首先是遍历**键值对**：

```Python
favorite_language = {
    'Tom': 'c',
    'Eric': 'Java'
}

for k, v in favorite_language.items():
    print(f'Key: {k}', end='\t')
    print(f'Value: {v}')
```

然后时遍历字典中的**键**：

```Python
favorite_language = {
    'Tom': 'c',
    'Eric': 'Java'
}

for k in favorite_language.keys():
    print(f'Key: {k}')
```

遍历字典时，会默认遍历所有的键。因此上述代码中的：

```Python
for k in favorite_language.keys():
```

替换为：

```Python
for k in favorite_language:
```

输出将不变。

按照特定顺序遍历字典中的所有键：

>从 python3.7 起，遍历字典时将按照插入的顺序返回其中的元素。

要以特定顺序返回元素，可以使用`sorted()`来获得按特定顺序排列的键列表的副本：

```Python
favorite_language = {
    'Tom': 'c',
    'Eric': 'Java',
    'Alice': 'ruby'
}

for name in sorted(favorite_language.keys()):
    print(name, favorite_language[name])

print('*' * 40)

for name in sorted(favorite_language.keys(), reverse=True):
    print(name, favorite_language[name])
```

输出为：

```Python
Alice ruby
Eric Java
Tom c
****************************************
Tom c
Eric Java
Alice ruby
```

然后时遍历字典中所有**值**：

```Python
favorite_language = {
    'Tom': 'c',
    'Eric': 'Java',
    'Alice': 'ruby',
    'phil': 'ruby'
}

for v in favorite_language.values():
    print(f'Value: {v}')
```

输出为：

```
Value: c
Value: Java
Value: ruby
Value: ruby
```

这种做法时提取字典中所有的值，没有考虑重复项。为了剔除重复项，可以使用**集合(set)**。集合中的每个元素都必须时独一无二的。

```Python
favorite_language = {
    'Tom': 'c',
    'Eric': 'Java',
    'Alice': 'ruby',
    'phil': 'ruby'
}

for v in set(favorite_language.values()):
    print(f'Value: {v}')
```

输出为：

```
Value: Java
Value: ruby
Value: c
```

**注意：**

可以使用一对花括号直接创建**集合**，并在其中用逗号分隔元素：

```Python
languages = {'c', 'java', 'ruby', 'java'}
print(languages) #  {'c', 'ruby', 'java'}
```

集合和字典很容易混淆，因为它们都是用一对花括号定义的。当花括号内没有键值对时。定义的很可能是集合。**不同于列表和字典，集合不会以特定的顺序存储元素。**

### 嵌套

#### 字典列表

```Python
alien_0 = {'color': 'green', 'point': 5}
alien_1 = {'color': 'green', 'point': 6}
alien_2 = {'color': 'green', 'point': 7}

aliens = [alien_0, alien_1, alien_2]

for alien in aliens:
    if alien['point'] == 5:
        alien['color'] = 'red'
        alien['point'] = 10

print(aliens)
```

### 字典中存储列表

```Python
pizza = {
    'crust': 'thick',
    'toppings': ['mushrooms', 'extra cheese']
}

for topping in pizza['toppings']:
    print('\t' + topping)
```

### 字典中存储字典

```Python
users = {
    'Tom': {
        'first': 'tom',
        'second': 'twice',
        'location': 'beijing'
    },
    'john': {
        'first': 'john',
        'second': 'eric',
        'location': 'shandong'
    }
}

for username, user_info in users.items():
    print(f'\nUsername: {username}')
    full_name = f'{user_info["first"]} {user_info["second"]}'
    location = user_info['location']

    print(f'\tFull name: {full_name.title()}')
    print(f'\tLocation: {location.title()}')
```

## 用户输入和while循环

### 函数input()的工作原理

函数 `input()` 让程序暂停运行，等待用户输入一下文本，获取用户输入后，Python将其赋给一个变量，以方便使用。

```Python
message = input("Tell me something, and I will repeat it back to you: ")
print(message)
```

### 使用int()来获取数值输入

使用函数 `input()` 时，Python将用户输入解读为字符串。

```Python
message = input("Tell me something, and I will repeat it back to you: ")
print(message > 18)
```

假如输入为数字20，但 `input()` 函数返回的是'21'，因此这样比较与数字18的大小就会报错：

```
TypeError: '>' not supported between instances of 'str' and 'int'
```

为了解决这个问题，可以使用 `int()` 函数，将数的字符串表示转换为数值表示。

```Python
message = int(input("Tell me something, and I will repeat it back to you: "))
print(message > 18) #  True
```

求模运算符（`%`）,它将两个数想除并返回余数。

```Python
4 % 3 # 1
5 % 3 # 2
6 % 3 # 0
7 % 3 # 1 
```

### while 循环

for循环用于针对集合中的每个元素都执行一个代码块。而while循环则不断执行，直到指定的条件不满足为止。

```python
current_num = 0
while current_num <= 5:
    print(current_num)
    current_num += 1
```

让用户选择何时退出, 可以使用 `while` 循环让程序在用户愿意时不断执行：

```python
prompt = "\nTell me something, and I will repeat it back to you:"
prompt += "\nEnter 'quit' to end the program."
message = ""

while message != "quit":
    message = input(prompt)
    if message != "quit":
        print(message)
```

或者可以使用**标志(flag)**:

```python
prompt = "\nTell me something, and I will repeat it back to you:"
prompt += "\nEnter 'quit' to end the program."

active = True

while active:
    message = input(prompt)
    if message == "quit":
        active = False
    else:
        print(message)
```

#### break & continue

要立即退出while循环，不再运行循环中余下的代码，也不管条件测试的结果如何，可使用 `break` 语句。

```Python
prompt = "\nTell me something, and I will repeat it back to you:"
prompt += "\nEnter 'quit' to end the program."

active = True

while active:
    message = input(prompt)
    if message == "quit":
        break
    else:
        print(message)
```

要返回循环开头，并根据条件测试结果决定是否继续执行循环，可使用 `continue` 语句，它不像 `break` 语句那样不再执行余下的代码并退出整个循环。

```Python
current = 0

while current <= 10:
    current += 1
    if current % 2 != 0:
        continue

    print(current)
```

### 使用while循环处理列表和字典

for循环是一种遍历列表的有效方式，但不应该在for循环中修改列表，否则将导致Python难以跟踪其中的元素。要在遍历列表的同时对其进行修改，可以使用while循环。

```Python
# 在列表之间移动元素

unconfirmed_user = ['alice', 'brain', 'candace']
confirmed_user = []

while unconfirmed_user:
    current_user = unconfirmed_user.pop()

    print(f'Verifying user: {current_user.title()}')
    confirmed_user.append(current_user)

print('\nThe following users have been confirmed:')
for user in reversed(confirmed_user):
    print(user.title())
```

输出为：

```
Verifying user: Candace
Verifying user: Brain
Verifying user: Alice

The following users have been confirmed:
Alice
Brain
Candace
```

```Python
# 删除为特定值的所有列表元素

pets = ['dog', 'cat', 'dog', 'goldfish', 'cat', 'rabbit', 'cat']
print(pets)

while 'cat' in pets:
    pets.remove('cat')

print(pets)
```

输出为：

```
['dog', 'cat', 'dog', 'goldfish', 'cat', 'rabbit', 'cat']
['dog', 'dog', 'goldfish', 'rabbit']
```

```Python
# 使用用户输入填充字典

responses = {}

polling = True

while polling:
    name = input("\nWhat is your name? ")
    response = input("Which mountain would you like to climb someday? ")

    responses[name] = response

    repeat = input("Would you like to let another person respond? (yes/no) ")
    if repeat == 'no':
        polling = False

print("\n--- Poll Results ---")
for name, response in responses.items():
    print(f"{name} would like to climb {response}.")
```

输出为：

```
What is your name? Tom
Which mountain would you like to climb someday? 泰山
Would you like to let another person respond? (yes/no) yes

What is your name? Jack
Which mountain would you like to climb someday? 华山
Would you like to let another person respond? (yes/no) no

--- Poll Results ---
Tom would like to climb 泰山.
Jack would like to climb 华山.
```

## 函数

### 定义函数

```Python
def greet(user_name):
    print(f'hello, {user_name.title()}')


greet('jesse')
```

关键字 `def` 来定义函数，向Python指出了函数名，还会在圆括号内指出函数为完成任务需要什么样的信息，即使不需要信息也不可以省略，最后定义以冒号结尾。紧跟在 `def greet():` 后面的所有缩进行构成了函数体。

函数定义中的变量称为*形参*，函数调用中的变量称为*实参*。

### 传递参数

向函数传递实参的方式有很多：可使用**位置实参**，这要求实参的顺序和形参的顺序相同；也可以使用**关键字实参**，其中每个实参都由变量名和值组成；还可以使用列表和字典。

- 位置实参

```Python
def des_pet(animal_type, pet_name):
    print(f'\nI have a {animal_type}')
    print(f"My {animal_type}'s name is {pet_name}")


des_pet('dog', 'Tom')
```

- 关键字实参

```Python
def des_pet(animal_type, pet_name):
    print(f'\nI have a {animal_type}')
    print(f"My {animal_type}'s name is {pet_name}")


des_pet(pet_name='Tom', animal_type='dog')
```

### 默认值

```Python
def des_pet(pet_name, animal_type='dog'):
    print(f'\nI have a {animal_type}')
    print(f"My {animal_type}'s name is {pet_name}")


des_pet('Tom')
des_pet(pet_name='Tom', animal_type='Cat')
des_pet('Tom', 'Cat')
des_pet(animal_type='CCC', pet_name='Toom')
des_pet('CCC', animal_type='Toom')
```

### 返回值

在函数中，可使用`return`语句将值返回调用函数的代码行。返回值能让程序将大部分繁重的工作移到函数中去完成，从而简化主程序。

- 返回简单值

```Python
def format_name(first_name, last_name, middle_name=''):
    """返回整洁的姓名"""
    if middle_name:
        full_name = f'{first_name} {middle_name} {last_name}'
    else:
        full_name = f'{first_name} {last_name}'
    return full_name.title()


print(format_name('john', 'tom'))
print(format_name('john', 'tom', 'Selina'))
print(format_name.__doc__)
```

- 返回字典

```Python
def build_person(first_name, last_name, age=None):
    """可将None视为占位值。在条件测试中。None相当于False"""
    person = {'first': first_name, 'last': last_name}
    if age:
        person['age'] = age
    return person


print(build_person("tom", "john"))
print(build_person("tom", "john", 27))
```

### 传递列表

向函数传递列表很有用，其中包括的可能是名字、数或更复杂的对象（如字典）。

```python
def print_model(un_print_design, printed_design=[]):
    """
    模拟打印每个设计，直到没有未打印的设计为止
    :param un_print_design: 
    :param printed_design: 
    :return: 
    """
    while un_print_design:
        current_design = un_print_design.pop()
        print(f'Printing Model is: {current_design}')
        printed_design.append(current_design)


def show_printed_model(printed_design):
    """
    显示打印好的所有模型
    :param printed_design: 
    :return: 
    """
    print(f'\nThe following model have been printed:\n')
    for design in printed_design:
        print(design)


un_print_design = ['phone case', 'robot case', 'other case']
printed_design = []

print_model(un_print_design, printed_design)
show_printed_model(printed_design)
```

### 传递任意数量的实参

有时候，预先不知道函数需要接受多少个实参，好在Python允许函数从调用语句中收集任意数量的实参。

```python
def pizza(*toppings):
    print(toppings)
    
    
pizza('a', 'b', 'c') # ('a', 'b', 'c')
```

形参名`*toppings`中的星号让Python创建一个名为`toppings`的空元组，并将收到的所有值都封装到这个元组中。

### 结合使用位置实参和任意数量实参

如果要让函数接受不同类型的实参，必须在函数定义中接纳任意数量实参的形参放在最后。Python先匹配位置实参和关键字实参，再将剩余的实参都收集到最后一个形参中。

```python
def pizza(size, *toppings):
    print(f"\nMaking a {size}-inch pizza with the following toppings:")
    for topping in toppings:
        print(f"- {topping}")


pizza(16, 'a', 'b', 'c')
```

### 使用任意数量的关键字实参

```python
def build_profile(first, last, **user_info):
    user_info['first_name'] = first
    user_info['last_name'] = last
    return user_info


user_profile = build_profile('albert', 'einstein', location='princton', field='physics')
print(user_profile)
```

形参名`**user_info`中的两个星号让Python创建一个名为`user_info`的空字典，并将收到的所有键值对都放到这个字典中。

### 将函数存储在模块中

我们可以将函数存储在称为**模块**的独立文件中，再将模块导入到主程序中。

- 导入整个模块

语法如下：

> import *module_name*
>
> module_name.function_name()

创建`pizza.py`文件：

```python
def make_pizza(size, *toppings):
    print(f"\nMaking a {size}-inch pizza with the following toppings:")
    for topping in toppings:
        print(f"- {topping}")
```

然后在同一目录创建一个名为`making_pizza.py`的文件。这个文件导入刚创建的模块，再调用make_pizza()两次：

```python
import pizza

pizza.make_pizza(16, 'a', 'b', 'c')
pizza.make_pizza(12, 'a', 'b')
```

- 导入特定的函数

语法如下：

> from *module_name* import *function_name1, function_name2*

上面的例子可重写为：

```python
from pizza import make_pizza

make_pizza(16, 'a', 'b', 'c')
make_pizza(12, 'a', 'b')
```

- 使用as给函数指定别名

语法如下：

> from *module_name* import *function_name* as *fn*

```python
from pizza import make_pizza as mp

mp(16, 'a', 'b', 'c')
mp(12, 'a', 'b')
```

- 使用as给模块指定别名

语法如下：

> import *module_name* as *mn*

```python
import pizza as p

p.make_pizza(16, 'a', 'b', 'c')
p.make_pizza(12, 'a', 'b')
```

- 导入模块中所有函数

语法如下：

> from *module_name* import *

```python
from pizza import *

make_pizza(16, 'a', 'b', 'c')
make_pizza(12, 'a', 'b')
```

## 类

### 创建和使用类

```python
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def sit(self):
        print(f"{self.name} is now sitting")

    def roll_over(self):
        print(f"{self.name} rolled over")


my_dog = Dog("Willine", 3)
your_dog = Dog("Frag", 4)
my_dog.roll_over()
my_dog.sit()
print(f"My dog's name is {my_dog.name}, {my_dog.age} years old")
print(f"Your dog's name is {your_dog.name}, {your_dog.age} years old")
```

类中的函数称为**方法**。`__init__`是一个特殊的方法，每当你根据`Dog`类创建新实例时，Python都会自动运行它。以`self`为前缀的变量可供类中的所有方法使用，可以供类的任何实例来访问。像这种可以通过实例来访问的变量称为**属性**。

> `__init__`方法类似与JS类中`constructor`方法，`self`相当于`this`.

### 使用类和实例

我们首先写一个表示汽车的类：

```python
class Car:
    def __init__(self, make, model, year):
        self.make = make
        self.model = model
        self.year = year

    def get_descriptive_name(self):
        long_name = f"{self.year} {self.make} {self.model}"
        return long_name
```

在创建实例时，有些属性无需通过形参来定义，可在`__init__`方法中为其指定默认值。下面我们创建一个属性，并且其初始值为0；再创建一个方法来读取这个属性的值。

```diff
class Car:
    def __init__(self, make, model, year):
        self.make = make
        self.model = model
        self.year = year
+       self.meter = 0

    def get_descriptive_name(self):
        long_name = f"{self.year} {self.make} {self.model}"
        return long_name
    
+   def get_meter(self):
+       print(f"This car has {self.meter} miles on it")
```

#### 修改属性值

- 直接修改属性的值

要修改属性的值最简单的方式是通过**实例**直接访问它。

```python
my_new_car = Car('audi', 'a4', 2019)
my_new_car.get_meter()
my_new_car.meter = 50
my_new_car.get_meter()
```

- 通过方法修改属性的值

```python
class Car:
  --snip--
  def update_meter(self, meter):
      if meter > self.meter:
          self.meter = meter
      else:
          print("You can't roll back an meter")
          

my_new_car = Car('audi', 'a4', 2019)
long_name = my_new_car.get_descriptive_name()
print(long_name)
my_new_car.get_meter()
my_new_car.meter = 50
my_new_car.get_meter()

print('*' * 40)

my_new_car.update_meter(80)
my_new_car.update_meter(30)
my_new_car.get_meter()
```

输出为：

```
2019 audi a4
This car has 0 miles on it
This car has 50 miles on it
****************************************
You can't roll back an meter
This car has 80 miles on it
```

- 通过方法对属性的值进行递增

```diff
class Car:
    def __init__(self, make, model, year):
        self.make = make
        self.model = model
        self.year = year
        self.meter = 0

    def get_descriptive_name(self):
        long_name = f"{self.year} {self.make} {self.model}"
        return long_name

    def get_meter(self):
        print(f"This car has {self.meter} miles on it")

    def update_meter(self, meter):
        if meter > self.meter:
            self.meter = meter
        else:
            print("You can't roll back an meter")

+   def increment_meter(self, miles):
+       self.meter += miles
```

### 继承

编写类时，并非总要从空白开始，如果要编写的类是另一个现成类的特殊版本，可以使用**继承**。一个类**继承**另一个类时，将自动获得另一个类的所有属性和方法。原有的类称为**父类**，而新类称为**子类**。

在既有类的基础上编写新类时，通常要调用父类的方法`__init__()`。这将初始化在父类`__init__()`方法中定义的所有属性，从而让子类包含这些属性。

```python
class E_car(Car):
    def __init__(self, make, model, year):
        super().__init__(make, model, year)


my_e_car = E_car('tesla', 'model S', 2019)
long_name_e = my_e_car.get_descriptive_name()
print(long_name_e) # 2019 tesla model S
```

#### 给子类定义属性和方法

```python
class E_car(Car):
    def __init__(self, make, model, year):
        super().__init__(make, model, year)
        self.battery = 75

    def get_bettery(self):
        print(f"This car has a {self.battery}-kwh battery")


my_e_car = E_car('tesla', 'model S', 2019)
long_name_e = my_e_car.get_descriptive_name()
print(long_name_e)
my_e_car.get_bettery()
```

输出为：

```
2019 tesla model S
This car has a 75-kwh battery
```

#### 重写父类的方法

可在子类中定义一个与要重写的父类方法同名的方法。这样Python将不会考虑这个父类方法，而只关注在子类中定义的相关方法。

```python
class E_car(Car):
    def __init__(self, make, model, year):
        super().__init__(make, model, year)
        self.battery = 75

    def get_bettery(self):
        print(f"This car has a {self.battery}-kwh battery")

    def get_descriptive_name(self):
        long_name = f"e_car info: {self.year} {self.make} {self.model}"
        return long_name


my_e_car = E_car('tesla', 'model S', 2019)
long_name_e = my_e_car.get_descriptive_name()
print(long_name_e)
my_e_car.get_bettery()
```

输出为：

```
e_car info: 2019 tesla model S
This car has a 75-kwh battery
```

#### 将实例用作属性

当给类添加的细节越多时，属性和方法清单及文件都越来越长。在这种情况下，可能需要将类的一部分提取出来，作为一个独立的类。可以将大型类拆分为多个协同工作的小型类。

```python
class E_car(Car):
    def __init__(self, make, model, year):
        super().__init__(make, model, year)
        self.battery = Battery()

    def get_descriptive_name(self):
        long_name = f"e_car info: {self.year} {self.make} {self.model}"
        return long_name


class Battery:
    def __init__(self, battery_size=75):
        self.battery_size = battery_size

    def get_bettery(self):
        print(f"This car has a {self.battery_size}-kwh battery")


my_e_car = E_car('tesla', 'model S', 2019)
long_name_e = my_e_car.get_descriptive_name()
print(long_name_e)
my_e_car.battery.get_bettery()
```

输出为：

```
e_car info: 2019 tesla model S
This car has a 75-kwh battery
```

### 导入类

随着不断给类添加功能，文件可能会变的很长，即便稳妥的使用了继承亦是如此。为遵循Python的总体理念，应该让文件尽可能整洁。Python在这方面提供了帮助，允许将类储存在模块中，然后在主程序中导入所需的模块。

#### 导入单个类

将Car类单独放在一个文件`car.py`模块中

```python
# car.py
class Car:
    def __init__(self, make, model, year):
        self.make = make
        self.model = model
        self.year = year
        self.meter = 0

    def get_descriptive_name(self):
        long_name = f"{self.year} {self.make} {self.model}"
        return long_name

    def get_meter(self):
        print(f"This car has {self.meter} miles on it")

    def update_meter(self, meter):
        if meter > self.meter:
            self.meter = meter
        else:
            print("You can't roll back an meter")

    def increment_meter(self, miles):
        self.meter += miles
```

然后在另外一个文件`my_car.py`中，在其中导入`Car`类并创建其实例：

```python
# my_car.py
from car import Car

my_new_car = Car('audi', 'a4', 2019)
long_name = my_new_car.get_descriptive_name()
print(long_name)
my_new_car.get_meter()
my_new_car.meter = 50
my_new_car.get_meter()
```

输出为：

```
2019 audi a4
This car has 0 miles on it
This car has 50 miles on it
```

#### 在一个模块中存储多个类、从一个模块中导入多个类

把`E_car`类和`Battery`类都放到`car.py`中,然后在`my_car.py`中把这些类导入：

```python
# my_car.py
from car import Car, E_car

my_new_car = Car('audi', 'a4', 2019)
long_name = my_new_car.get_descriptive_name()
print(long_name)
my_new_car.get_meter()
my_new_car.meter = 50
my_new_car.get_meter()

print('*' * 40)

my_new_car.update_meter(80)
my_new_car.update_meter(30)
my_new_car.get_meter()
my_new_car.increment_meter(20)
my_new_car.get_meter()

print('+' * 40)

my_e_car = E_car('tesla', 'model S', 2019)
long_name_e = my_e_car.get_descriptive_name()
print(long_name_e)
my_e_car.battery.get_bettery()
```

输出为：

```
2019 audi a4
This car has 0 miles on it
This car has 50 miles on it
****************************************
You can't roll back an meter
This car has 80 miles on it
This car has 100 miles on it
++++++++++++++++++++++++++++++++++++++++
e_car info: 2019 tesla model S
This car has a 100-kwh battery
```

#### 导入整个模块

```python
import car

my_new_car = car.Car('audi', 'a4', 2019)

my_e_car = car.E_car('tesla', 'model S', 2019)
```

#### 导入模块中所有的类

语法：from *module_name* import *

> 不推荐这种写法。

#### 在一个模块中导入另一个模块

把`Battery`类单独放到`battery.py`文件，然后在`car.py`中引入（因为E_car类的battery属性是Battery类的实例）：

```python
# car.py
from battery import Battery

class Car:
  # ....

class E_car(Car):
    def __init__(self, make, model, year):
        super().__init__(make, model, year)
        self.battery = Battery(100)

    def get_descriptive_name(self):
        long_name = f"e_car info: {self.year} {self.make} {self.model}"
        return long_name
```

#### 使用别名

```python
from car import E_car as EC, Car
```

## 文件和异常

### 从文件中读取数据

新建一个文件`pi_digits.txt`,他包含精确到小数点后30位的圆周率值，且在小数点后10位处换行：

```
3.1415926535
  8979323846
  2463383297
```

 下面的程序打开并读取这个文件，再将其显示在屏幕上：

```python
with open('pi_digits.txt') as file_object:
    contents = file_object.read()

print(contents)
```

函数`open()`返回一个表示文件的对象。在本例中，`open('pi_digits.txt')`返回一个表示文件`pi_digits.txt`的对象，Python将该对象赋给`file_object`供以后使用。

关键字`with`在不需要访问文件后将其关闭。在这程序中调用了`open()`方法，但是没有调用`close()`方法。也可以调用`open()`和`close()`方法，但这样做时，如果程序存在bug导致方法`close()`未执行，文件将不会关闭。未妥善关闭的文件可能会导致数据丢失。如果在程序执行过程中过早的调用`clsoe()`方法，会发现在需要使用文件时它已关闭，这会导致更多的错误。但是使用`with`可以让Python去确定：你只管打开文件，并在需要时使用它，Python自会在合适的时候自动将其关闭。

然后使用`read()`方法读取这个文件的全部内容，并将其作为一个长长的字符串赋给变量`contents`。

#### 逐行读取

```python
file_name = "pi_digits.txt"

with open(file_name) as file_object_line:
    for line in file_object_line:
        print(line.rstrip())
```

#### 创建一个包含文件各行内容的列表

```python
with open(file_name) as file_object_rline:
    lines = file_object_rline.readlines()

print(lines) # ['3.1415926535\n', '  8979323846\n', '  2463383297']

for line in lines:
    print(line.rstrip())
```

#### 使用文件内容





