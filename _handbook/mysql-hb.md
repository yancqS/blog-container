---
title: MySQL必知必会读书笔记
description: 本文主要记录在阅读《MySQL必知必会》时的笔记，持续更新。
languages:
  - SQL
---

# MySQL必知必会读书笔记

之前根据SQLBolt网站了解了SQL语句，整理了文章[SQL入门学习](https://yancqs.github.io/blog/2021/10/19/sql/)。

本次通过《MySQL必知必会》一书来更加深入且系统的学习下SQL语言。

## 第一章 了解SQL

### 概念

- **数据库(database)**：保存有组织的数据的容器。
- **表(table)**：某种特定类型数据的结构化清单。
- **模式(scheme)**：关于数据库和表的布局及特性信息。
- **列(column)**：表由列组成。所有表都是由一个或多个列组成的。
- **数据类型(datatype)**：所容许的数据的类型。每个表列都有相应的数据类型，它限制改列中存储的数据。
- **行(row)**：表中的一个记录。
- **主键(primary key)**：一列（或**一组列**），其值能够唯一区分表中每个行。表中的任何列都可以作为主键，只要它满足一下条件
  - 任意两行都不具有相同的主键值
  - 每个行都必须具有一个主键值（主键列不允许NULL值）

> 主键的好习惯：
>
> 1. 不更新主键列中的值
> 2. 不重用主键列的值
> 3. 不在主键列中使用可能会更改的值。

- **SQL**：结构化查询语言（Structured Query Language）

## 第二章 MySQL简介

本章主要介绍了什么是MySQL，并引入了几个客户机实用程序。

> 个人还是推荐Navicat premium

## 第三章 使用MySQL

### 连接

为了连接到MySQL，需要以下信息：

- 主机名：如果连接到本地MySQL服务器，为`localhost`
- 端口：默认是3306
- 一个合法的用户名
- 用户密码

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211129222627.png)

### 选择数据库

关键字`USE`、`SHOW`;

显示可用的数据库列表：

```mysql
show databases;
```

```
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| customers          |
| information_schema |
| mysql              |
| performance_schema |
| sql_learn          |
| sys                |
+--------------------+
6 rows in set (0.01 sec)
```

使用`USE`关键字选择一个数据库,并且用`SHOW`获取数据库内表的列表：

```mysql
use customers;
show tables;
```

```
mysql> use customers;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables;
+---------------------+
| Tables_in_customers |
+---------------------+
| customers           |
| orderitems          |
| orders              |
| productnotes        |
| products            |
| vendors             |
+---------------------+
6 rows in set (0.00 sec)
```

`SHOW`也可以用来显示表列：

```mysql
show columns from customers;
//或
describe customers;
```

```
mysql> show columns from customers;
+--------------+-----------+------+-----+---------+----------------+
| Field        | Type      | Null | Key | Default | Extra          |
+--------------+-----------+------+-----+---------+----------------+
| cust_id      | int       | NO   | PRI | NULL    | auto_increment |
| cust_name    | char(50)  | NO   |     | NULL    |                |
| cust_address | char(50)  | YES  |     | NULL    |                |
| cust_city    | char(50)  | YES  |     | NULL    |                |
| cust_state   | char(5)   | YES  |     | NULL    |                |
| cust_zip     | char(10)  | YES  |     | NULL    |                |
| cust_country | char(50)  | YES  |     | NULL    |                |
| cust_contact | char(50)  | YES  |     | NULL    |                |
| cust_email   | char(255) | YES  |     | NULL    |                |
+--------------+-----------+------+-----+---------+----------------+
9 rows in set (0.00 sec)
```

> 什么是自动增量？
>
> 某些表列需要唯一值。例如订单编号、雇员ID等。在每个行添加到表中时，MySQL可以自动地为每个行分配下一个可用编号，不用在添加一行时手动分配唯一值。这个功能就是所谓的自动增量。

### 其他SHOW语句

- `SHOW STATUS;`，用于显示广泛的服务器状态信息；
- `SHOW CREATE DATABASE <base_name>`和`SHOW CREATE TABLE <table_name>`，分别用来显示创建特定数据库或表的MySQL语句。

> 执行`HELP SHOW;`显示运行的`SHOW`语句。

## 第四章 检索数据

### 检索单个列

```mysql
select prod_name from products;
```

利用`SELECT`语句从`products`表中检索一个名为`prod_name	`的列。

```
mysql> select prod_name from products;
+----------------+
| prod_name      |
+----------------+
| .5 ton anvil   |
| 1 ton anvil    |
| 2 ton anvil    |
| Detonator      |
| Bird seed      |
| Carrots        |
| Fuses          |
| JetPack 1000   |
| JetPack 2000   |
| Oil can        |
| Safe           |
| Sling          |
| TNT (1 stick)  |
| TNT (5 sticks) |
+----------------+
14 rows in set (0.00 sec)
```

> 注意：SQL语句不区分大小写。

### 检索多个列

```mysql
select prod_id, prod_name, prod_price from products;
```

```
mysql> select prod_id, prod_name, prod_price from products;
+---------+----------------+------------+
| prod_id | prod_name      | prod_price |
+---------+----------------+------------+
| ANV01   | .5 ton anvil   |       5.99 |
| ANV02   | 1 ton anvil    |       9.99 |
| ANV03   | 2 ton anvil    |      14.99 |
| DTNTR   | Detonator      |      13.00 |
| FB      | Bird seed      |      10.00 |
| FC      | Carrots        |       2.50 |
| FU1     | Fuses          |       3.42 |
| JP1000  | JetPack 1000   |      35.00 |
| JP2000  | JetPack 2000   |      55.00 |
| OL1     | Oil can        |       8.99 |
| SAFE    | Safe           |      50.00 |
| SLING   | Sling          |       4.49 |
| TNT1    | TNT (1 stick)  |       2.50 |
| TNT2    | TNT (5 sticks) |      10.00 |
+---------+----------------+------------+
14 rows in set (0.00 sec)
```

### 检索所有列

```mysql
select * from products;
```

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211130215805.png)

> 注意：一般，除非你真的需要表中的每个列，否则最好别使用*通配符。因为检索不需要的的列通常会降低检索和应用程序的性能。

### 检索不同行

关键字`DISTINCT`;顾名思义，此关键字指示MySQL只返回不同的值。

正如所见，`SELECT`返回所有匹配的行。但是，如果你不想要每个值每次都出现，怎么办？例如，你想要的出products表中产品的所有供应商ID：

```mysql
select vend_id from products;
```

`SELECT`语句返回14行（即使表中只有4个供货商）。那么，如何检索出有不同值的列表呢？

解决办法时使用`DISTINCT`关键字。

```mysql
select distinct vend_id from products;
```

```
mysql> select distinct vend_id from products;
+---------+
| vend_id |
+---------+
|    1001 |
|    1002 |
|    1003 |
|    1005 |
+---------+
4 rows in set (0.00 sec)
```

> 不能部分使用DISTINCT。`DISTINCT`关键字应用于所有列而不仅是前置它的列。如果给出`SELECT DISTINCT vend_id, prod_price from products`，除非指定的两个列都相同，否则所有行都将被检索出来。

### 限制结果

为了返回第一行或前几行，可使用`LIMIT`子句。

```mysql
select prod_name from products limit 5;
```

```
mysql> select prod_name from products limit 5;
+--------------+
| prod_name    |
+--------------+
| .5 ton anvil |
| 1 ton anvil  |
| 2 ton anvil  |
| Detonator    |
| Bird seed    |
+--------------+
5 rows in set (0.00 sec)
```

```mysql
select prod_name from products limit 5, 5;
```

`LIMIT 5, 5`表示返回从行5开始的5行。**第一个数为开始的位置，第二个数为要检索的行数。**

> 由于这种写法很容易把人搞糊涂，建议使用`LIMIT 5 OFFSET 5`;

```
mysql> select prod_name from products limit 5, 5;
+--------------+
| prod_name    |
+--------------+
| Carrots      |
| Fuses        |
| JetPack 1000 |
| JetPack 2000 |
| Oil can      |
+--------------+
5 rows in set (0.00 sec)
```

> 行0：检索出来的第一行为行0而不是行1.

> MySQL 5支持另外一种替代语法：
>
> `LIMIT 3, 4`等价于`LIMIT 4 OFFSET 3` 

### 使用完全限定的表名

迄今为止使用的SQL例子只通过列明引用列。也可能使用完全限制的名字来引用列（同时使用表名和列名），比如：

```mysql
select products.prod_name from customers.products;
```

## 第五章 排序检索数据

关系数据库设计理论认为，如果不明确规定顺序排序，则不应该假定检索出的数据的顺序有意义。

### 排序数据

- **子句**：SQL语句由子句构成，有些子句是必须的，而有些是可选的。子句的例子有`SELECT`语句的`FROM`子句。

为了明确地排序用`SELECT`语句检索出的数据，可使用`ORDER BY`子句。

```mysql
select prod_name from products order by prod_name;
```

```
mysql> select prod_name from products order by prod_name;
+----------------+
| prod_name      |
+----------------+
| .5 ton anvil   |
| 1 ton anvil    |
| 2 ton anvil    |
| Bird seed      |
| Carrots        |
| Detonator      |
| Fuses          |
| JetPack 1000   |
| JetPack 2000   |
| Oil can        |
| Safe           |
| Sling          |
| TNT (1 stick)  |
| TNT (5 sticks) |
+----------------+
14 rows in set (0.00 sec)
```

> 用非检索的列排序数据是完全合法的。

### 按多个列排序

下面检索3个列，并按其中两个列对结果进行排序——首先按价格，然后再按名称排序。

```mysql
select prod_id, prod_price, prod_name from products order by prod_price, prod_name;
```

```
mysql> select prod_id, prod_price, prod_name from products order by prod_price, prod_name;
+---------+------------+----------------+
| prod_id | prod_price | prod_name      |
+---------+------------+----------------+
| FC      |       2.50 | Carrots        |
| TNT1    |       2.50 | TNT (1 stick)  |
| FU1     |       3.42 | Fuses          |
| SLING   |       4.49 | Sling          |
| ANV01   |       5.99 | .5 ton anvil   |
| OL1     |       8.99 | Oil can        |
| ANV02   |       9.99 | 1 ton anvil    |
| FB      |      10.00 | Bird seed      |
| TNT2    |      10.00 | TNT (5 sticks) |
| DTNTR   |      13.00 | Detonator      |
| ANV03   |      14.99 | 2 ton anvil    |
| JP1000  |      35.00 | JetPack 1000   |
| SAFE    |      50.00 | Safe           |
| JP2000  |      55.00 | JetPack 2000   |
+---------+------------+----------------+
14 rows in set (0.00 sec)
```

重要的是理解在按多个列排序时，排序完全按照所规定的顺序进行。

对于上述例子的输出，仅在多个行具有相同的prod_price值时才对产品的prod_name进行排序。如果prod_price列中所有的值都是唯一的，则不会按prod_name排序。

### 指定排序方向

默认是升序排序，我们还可以使用`ORDER BY`子句降序排序，此时需要指定关键字`DESC`;

- `DESC`：降序
- `ASC`：升序，默认

```mysql
select prod_id, prod_price, prod_name from products order by prod_price desc;
```

```
mysql> select prod_id, prod_price, prod_name from products order by prod_price desc;
+---------+------------+----------------+
| prod_id | prod_price | prod_name      |
+---------+------------+----------------+
| JP2000  |      55.00 | JetPack 2000   |
| SAFE    |      50.00 | Safe           |
| JP1000  |      35.00 | JetPack 1000   |
| ANV03   |      14.99 | 2 ton anvil    |
| DTNTR   |      13.00 | Detonator      |
| FB      |      10.00 | Bird seed      |
| TNT2    |      10.00 | TNT (5 sticks) |
| ANV02   |       9.99 | 1 ton anvil    |
| OL1     |       8.99 | Oil can        |
| ANV01   |       5.99 | .5 ton anvil   |
| SLING   |       4.49 | Sling          |
| FU1     |       3.42 | Fuses          |
| FC      |       2.50 | Carrots        |
| TNT1    |       2.50 | TNT (1 stick)  |
+---------+------------+----------------+
14 rows in set (0.00 sec)
```

如果打算对多个列排序：

```mysql
select prod_id, prod_price, prod_name from products order by prod_price desc, prod_name;
```

`DESC`关键字只应用到直接位于其前面的列名。如果想在多个列上进行降序排序，必须对每个列指定`DESC`关键字。

```
mysql> select prod_id, prod_price, prod_name from products order by prod_price desc, prod_name;
+---------+------------+----------------+
| prod_id | prod_price | prod_name      |
+---------+------------+----------------+
| JP2000  |      55.00 | JetPack 2000   |
| SAFE    |      50.00 | Safe           |
| JP1000  |      35.00 | JetPack 1000   |
| ANV03   |      14.99 | 2 ton anvil    |
| DTNTR   |      13.00 | Detonator      |
| FB      |      10.00 | Bird seed      |
| TNT2    |      10.00 | TNT (5 sticks) |
| ANV02   |       9.99 | 1 ton anvil    |
| OL1     |       8.99 | Oil can        |
| ANV01   |       5.99 | .5 ton anvil   |
| SLING   |       4.49 | Sling          |
| FU1     |       3.42 | Fuses          |
| FC      |       2.50 | Carrots        |
| TNT1    |       2.50 | TNT (1 stick)  |
+---------+------------+----------------+
14 rows in set (0.01 sec)
```

#### 注意⚠️

`ORDER BY`子句的位置，在给出`ORDER BY`子句时，应该保证它位于`FROM`子句之后，如果要使用`LIMIT`，它必须位于`ORDER BY`之后。使用子句的次序不对将产生错误消息。

```mysql
SELECT <column>, <another_column>, …
FROM <mytable>
ORDER BY <column> ASC/DESC
LIMIT <num_limit> OFFSET <num_offset>;
```

## 第六章 过滤数据

### 使用WHERE子句

```mysql
select prod_name, prod_price from products where prod_price=2.50;
```

```
mysql> select prod_name, prod_price from products where prod_price=2.50;
+---------------+------------+
| prod_name     | prod_price |
+---------------+------------+
| Carrots       |       2.50 |
| TNT (1 stick) |       2.50 |
+---------------+------------+
2 rows in set (0.00 sec)
```

> `WHERE`子句的位置：在同时使用`WHERE`子句和`ORDER BY`子句时，应该让`ORDER BY`位于`WHERE`之后，否则将会产生错误。

### WHERE子句操作符

`WHERE`子句操作符：

| 操作符           | 说明               |
| ---------------- | ------------------ |
| =                | 等于               |
| <>               | 不等于             |
| !=               | 不等于             |
| <                | 小于               |
| <=               | 小于等于           |
| >                | 大于               |
| >=               | 大于等于           |
| BETWEEN...AND... | 在指定的两个值之间 |

#### 范围值检查

```mysql
select prod_name, prod_price from products where prod_price between 10 and 30 order by prod_price asc;
```

```
mysql> select prod_name, prod_price from products where prod_price between 10 and 30 order by prod_price asc;
+----------------+------------+
| prod_name      | prod_price |
+----------------+------------+
| Bird seed      |      10.00 |
| TNT (5 sticks) |      10.00 |
| Detonator      |      13.00 |
| 2 ton anvil    |      14.99 |
+----------------+------------+
4 rows in set (0.00 sec)
```

#### 不匹配检查


```mysql
select vend_id, prod_name from products where vend_id!=1003;
```

```
mysql> select vend_id, prod_name from products where vend_id!=1003;
+---------+--------------+
| vend_id | prod_name    |
+---------+--------------+
|    1001 | .5 ton anvil |
|    1001 | 1 ton anvil  |
|    1001 | 2 ton anvil  |
|    1002 | Fuses        |
|    1002 | Oil can      |
|    1005 | JetPack 1000 |
|    1005 | JetPack 2000 |
+---------+--------------+
7 rows in set (0.00 sec)
```

#### 单个值检查

```mysql
select prod_name, prod_price from products where prod_name = 'fuses';
```

```
mysql> select prod_name, prod_price from products where prod_name = 'fuses';
+-----------+------------+
| prod_name | prod_price |
+-----------+------------+
| Fuses     |       3.42 |
+-----------+------------+
1 row in set (0.00 sec)
```

> 何时使用引号？单引号用来限定字符串。如果将值与串类型的列进行比较，则需要限定引号。用来与数值列进行比较的值不用引号。

#### 空值检查

在创建表时，表设计人员可以指定其中的列是否可以不包含值。在一个列不包含值时，称其为包含空值`NULL`。

> `NULL`,无值（no value），它与字段包含0、空字符串或仅仅包含空格不同。

```mysql
select cust_id from customers where cust_email is null;
```

```
mysql> select cust_id from customers where cust_email is null;
+---------+
| cust_id |
+---------+
|   10002 |
|   10005 |
+---------+
2 rows in set (0.01 sec)
```

## 第七章 数据过滤

在第六章介绍的所有`WHERE`子句在过滤时使用的都是单一的条件。

为了进行更强的过滤控制，MySQL允许给出多个`WHERE`子句。这些子句可以两种方式使用：以`AND`子句的方式活以`OR`子句的方式。

### AND操作符

`AND`用于检索满足所有给定条件的行；

```mysql
select prod_id, prod_price, prod_name from products where vend_id = 1003 and prod_price <= 10;
```

```
mysql> select prod_id, prod_price, prod_name from products where vend_id = 1003 and prod_price <= 10;
+---------+------------+----------------+
| prod_id | prod_price | prod_name      |
+---------+------------+----------------+
| FB      |      10.00 | Bird seed      |
| FC      |       2.50 | Carrots        |
| SLING   |       4.49 | Sling          |
| TNT1    |       2.50 | TNT (1 stick)  |
| TNT2    |      10.00 | TNT (5 sticks) |
+---------+------------+----------------+
5 rows in set (0.00 sec)
```

上述例子中使用了只包含一个关键字`AND`的语句，把两个过滤条件组合在一起。还可以添加多个过滤条件，每添加一条就要使用一个`AND`。

### OR操作符

`OR`用于检索匹配任一给定条件的行。

```mysql
select prod_name, prod_price, vend_id from products where vend_id = 1002 or vend_id = 1003;
```

```
mysql> select prod_name, prod_price, vend_id from products where vend_id = 1002 or vend_id = 1003;
+----------------+------------+---------+
| prod_name      | prod_price | vend_id |
+----------------+------------+---------+
| Fuses          |       3.42 |    1002 |
| Oil can        |       8.99 |    1002 |
| Detonator      |      13.00 |    1003 |
| Bird seed      |      10.00 |    1003 |
| Carrots        |       2.50 |    1003 |
| Safe           |      50.00 |    1003 |
| Sling          |       4.49 |    1003 |
| TNT (1 stick)  |       2.50 |    1003 |
| TNT (5 sticks) |      10.00 |    1003 |
+----------------+------------+---------+
9 rows in set (0.00 sec)
```

### 计算次序

`WHERE`可包含任意数目的`AND`和`OR`操作符。允许两者结合以进行复杂和高级的过滤。

但是这样会带来一个问题，请看下面的SQL语句：

```mysql
select prod_name, prod_price from products where vend_id = 1002 or vend_id = 1003 and prod_price >= 10;
```

```
mysql> select prod_name, prod_price from products where vend_id = 1002 or vend_id = 1003 and prod_price >= 10;
+----------------+------------+
| prod_name      | prod_price |
+----------------+------------+
| Fuses          |       3.42 |
| Oil can        |       8.99 |
| Detonator      |      13.00 |
| Bird seed      |      10.00 |
| Safe           |      50.00 |
| TNT (5 sticks) |      10.00 |
+----------------+------------+
6 rows in set (0.00 sec)
```

我们的预期是*列出价格为10美元（含）以上且由1002或1003制造的所有产品*。

请看上面的结果。返回的行中有两行价格小于10美元，显然不符合预期。这样的原因在于**计算的次序**。

**SQL在处理`OR`操作前，优先处理`AND`操作符**。因此上述SQL语句可以理解为：*由供应商1003制造且价格为10美元（含）以上的产品，或者由供应商1002制造的任何产品，而不管其价格*。

此类问题的解决办法是**使用圆括号明确地分组相应的操作**。修改后如下：

```mysql
select prod_name, prod_price from products where (vend_id = 1002 or vend_id = 1003) and prod_price >= 10;
```

```
mysql> select prod_name, prod_price from products where (vend_id = 1002 or vend_id = 1003) and prod_price >= 10;
+----------------+------------+
| prod_name      | prod_price |
+----------------+------------+
| Detonator      |      13.00 |
| Bird seed      |      10.00 |
| Safe           |      50.00 |
| TNT (5 sticks) |      10.00 |
+----------------+------------+
4 rows in set (0.00 sec)
```

> 不要过分的依赖默认计算次序。使用圆括号没什么坏处，它能消除歧义。

### IN操作符

圆括号在`WHERE`子句中还有一种用法。`IN`操作符用来指定条件范围。

```mysql
select prod_name, prod_price from products where vend_id in (1002, 1003) order by prod_name;
```

```
mysql> select prod_name, prod_price from products where vend_id in (1002, 1003) order by prod_name;
+----------------+------------+
| prod_name      | prod_price |
+----------------+------------+
| Bird seed      |      10.00 |
| Carrots        |       2.50 |
| Detonator      |      13.00 |
| Fuses          |       3.42 |
| Oil can        |       8.99 |
| Safe           |      50.00 |
| Sling          |       4.49 |
| TNT (1 stick)  |       2.50 |
| TNT (5 sticks) |      10.00 |
+----------------+------------+
9 rows in set (0.00 sec)
```

`IN`操作符完成与`OR`相同的功能。

`IN`操作符的优点如下：

- 在使用长的合法选项清单时，`IN`操作符的语法更加清洗且更直观。
- 在使用`IN`操作符时，计算的次序更容易管理。
- `IN`操作符一般比`OR`操作符清单执行的更快。
- `IN`操作符最大优点是可以包含其他`SELECT`语句（子查询），使得能够更加动态地建立`WHERE`子句。

### NOT操作符

WHERE子句中NOT操作符有且只有一个功能，那就是否定它之后所跟的任何条件。

```mysql
select prod_name, prod_price from products where vend_id not in (1002, 1003) order by prod_name;
```

```
mysql> select prod_name, prod_price from products where vend_id not in (1002, 1003) order by prod_name;
+--------------+------------+
| prod_name    | prod_price |
+--------------+------------+
| .5 ton anvil |       5.99 |
| 1 ton anvil  |       9.99 |
| 2 ton anvil  |      14.99 |
| JetPack 1000 |      35.00 |
| JetPack 2000 |      55.00 |
+--------------+------------+
5 rows in set (0.01 sec)
```

## 第八章 用通配符进行过滤

### LIKE操作符

- 通配符：用来匹配值的一部分的特殊字符。实际是SQL的`WHERE`子句中有特殊含义的字符。
- 搜索模式：由字面值、通配符或两者组合构成的搜索条件。

为了在搜索子句中使用通配符，必须使用LIKE操作符。LIKE指示MYSQL后跟的是搜索模式利用通配符匹配而不是直接相等匹配进行比较。

| Operator   | Condition                                                    | Example                                                      |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| =          | Case sensitive exact string comparison (*notice the single equals*) | col_name **=** "abc"                                         |
| != or <>   | Case sensitive exact string inequality comparison            | col_name **!=** "abcd"                                       |
| LIKE       | Case insensitive exact string comparison                     | col_name **LIKE** "ABC"                                      |
| NOT LIKE   | Case insensitive exact string inequality comparison          | col_name **NOT LIKE** "ABCD"                                 |
| **%**      | Used anywhere in a string to match a sequence of zero or more characters (**only with LIKE or NOT LIKE**) | col_name **LIKE** "%AT%" (matches "AT", "ATTIC", "CAT" or even "BATS") |
| **_**      | Used anywhere in a string to match a single character (**only with LIKE or NOT LIKE**) | col_name **LIKE** "AN_" (matches "AND", but not "AN")        |
| IN (…)     | String exists in a list                                      | col_name **IN** ("A", "B", "C")                              |
| NOT IN (…) | String does not exist in a list                              | col_name **NOT IN** ("D", "E", "F")                          |

#### 百分号（&）通配符

在搜索串中，`%`表示*任何字符出现任意次数*。

```mysql
select prod_id, prod_name from products where prod_name like 'jet%';
```

```
mysql> select prod_id, prod_name from products where prod_name like 'jet%';
+---------+--------------+
| prod_id | prod_name    |
+---------+--------------+
| JP1000  | JetPack 1000 |
| JP2000  | JetPack 2000 |
+---------+--------------+
2 rows in set (0.00 sec)
```

> 区分大小写：根据MySQL的配置方式，搜索可以是区分大小写的。如果区分大小写，'jet%'就不匹配 JetPack 1000。
>
> `select prod_id, prod_name from products where prod_name like binary 'Jet%';`使用binary关键字设定where子句区分大小写。

通配符可在搜索模式中任意位置使用，并且可以使用多个通配符。例如：

```mysql
select prod_id, prod_name from products where prod_name like '%anvil%';
```

> 注意尾空格：尾空格可能会干扰通配符匹配。例如在保存anvil时，如果它后面有一个或多个空格，则搜索模式『LIKE '%anvil'』不会匹配他们。解决这个问题的一个简单的办法是在搜索模式最后附加一个%。一个更好的方法是利用函数去掉首尾的空格。

> 注意NULL：虽然似乎通配符%可以匹配任何东西，但有一个例外，即NULL。即使『LIKE '%'』搜索模式也不能匹配NULL。

**重要的是要注意到，除了一个和多个字符外，`%`还能匹配0个字符。**

下面的例子是找出所有以s开头以e结尾的结尾的所有产品：

```mysql
select prod_name from products where prod_name like 's%e';
```

#### 下划线（_）通配符

下划线的用途与%一样，但是下划线子匹配单个字符而不是多个字符。

```mysql
select prod_name, prod_id from products where prod_name like '_ ton anvil';
```

```
mysql> select prod_name, prod_id from products where prod_name like '_ ton anvil';
+-------------+---------+
| prod_name   | prod_id |
+-------------+---------+
| 1 ton anvil | ANV02   |
| 2 ton anvil | ANV03   |
+-------------+---------+
2 rows in set (0.00 sec)
```

与`%`能匹配0个字符不一样，**`_`总是匹配1个字符**，不能多也不能少。

### 使用通配符的技巧

MySQL的通配符很有用，但是这种功能是有代价的：通配符搜索的处理一般要比前面讨论的其他搜索所花时间更长。因此：

- 不要过度使用通配符。
- 在使用通配符时，除非有必要，否则不要把它们用在搜索模式的开始处。把通配符放在搜索模式的开始处，搜索起来是最慢的。
- 注意通配符的位置。

## 第九章 用正则表达式进行搜索

### 基本字符匹配

下面语句检索列prod_name保含文本1000的所有行：

```mysql
select prod_name from products where prod_name regexp '1000' order by prod_name;
```

```
mysql> select prod_name from products where prod_name regexp '1000' order by prod_name;
+--------------+
| prod_name    |
+--------------+
| JetPack 1000 |
+--------------+
1 row in set (0.00 sec)
```

关键字`REGEXP`告诉MySQL：其后面跟着的东西作为正则表达式处理。

### LIKE和正则表达式区别

在LIKE和REGEXP质检有一个重要的差别。请看一下两条语句：

```mysql
select prod_name from products where prod_name like '1000' order by prod_name;

select prod_name from products where prod_name regexp '1000' order by prod_name;
```

如果执行上述两条语句，会发现第一条语句不返回数据，而第二条返回一条数据。

这是因为`LIKE`匹配整个列。如果被匹配的文本在列值中出现，`LIKE`不会找到它，相应的行也不会被返回（除非使用通配符）。

而`REGEXP`在列值内进行匹配，如果被匹配的文本在列值中出现，`REGEXP`会找到它，相应的行会被返回。

那REGEXP能不能用来匹配整个列，答案是肯定的，使用`^`和`$`定位符即可。

### 进行OR匹配

```mysql
select prod_name from products where prod_name regexp '1000|2000' order by prod_name;
```

```
mysql> select prod_name from products where prod_name regexp '1000|2000' order by prod_name;
+--------------+
| prod_name    |
+--------------+
| JetPack 1000 |
| JetPack 2000 |
+--------------+
2 rows in set (0.00 sec)
```

### 匹配几个字符之一

如果你想匹配特定的字符，你可以指定一组用 [ 和 ] 括起来的字符来完成。

```mysql
select prod_name from products where prod_name regexp '[123] Ton' order by prod_name;
```

```
mysql> select prod_name from products where prod_name regexp '[123] Ton' order by prod_name;
+-------------+
| prod_name   |
+-------------+
| 1 ton anvil |
| 2 ton anvil |
+-------------+
2 rows in set (0.01 sec)
```

事实上，正则表达式[123] Ton 为 [1|2|3] Ton 的缩写，也可以使用后者。

> '1 | 2 | 3 ton' 会被理解为1 或 2  或 3 ton。因此需要[]包裹。

字符集合也可以被否定，[123] 匹配字符1、2或3，但是\[^123]却匹配除这些字符之外的任何东西。

### 匹配范围

下面的集合将匹配数字0到9：[0123456789]，为了简化这种写法，可用`-`来定义范围：[0-9];

范围不限于完整的集合，[1-3]和[6-9]也是合法的。范围也不一定只是数值的，[a-z]匹配任意字母字符。

```mysql
select prod_name from products where prod_name regexp '[1-5] Ton' order by prod_name;
```

```
mysql> select prod_name from products where prod_name regexp '[1-5] Ton' order by prod_name;
+--------------+
| prod_name    |
+--------------+
| .5 ton anvil |
| 1 ton anvil  |
| 2 ton anvil  |
+--------------+
3 rows in set (0.00 sec)
```

### 匹配特殊字符

如何找出保含`.`字符的值？为了匹配特殊字符，必须用`\\`为前导。`\\-`表示查找`-`，`\\.`表示查找`.`。

```mysql
select vend_name from vendors where vend_name regexp '\\.' order by vend_name;
```

```
mysql> select vend_name from vendors where vend_name regexp '\\.' order by vend_name;
+--------------+
| vend_name    |
+--------------+
| Furball Inc. |
+--------------+
1 row in set (0.00 sec)
```

> 匹配`\`字符本身：需要使用`\\\`

多数正则表达式实现使用单个反斜杠转义特殊字符，以便能使用这些字符本身。但是MySQL要求两个反斜杠（MySQL自己解释一个，正则表达式库解释另一个）。

### 匹配字符类

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211212222215.png)

```mysql
select vend_name from vendors where vend_name regexp '[[:upper:]]';
//等价于
select vend_name from vendors where vend_name regexp '[A-Z]';
```

### 匹配多个实例

| 元字符 | 说明                         |
| ------ | ---------------------------- |
| *      | 0个或多个匹配                |
| +      | 一个或多个匹配（等于{1,}）   |
| ?      | 0个或1个匹配（等于{0, 1}）   |
| {n}    | 指定数目的匹配               |
| {n, }  | 不少于指定数目的匹配         |
| {n, m} | 匹配数目的范围（m不超过255） |

```mysql
select prod_name from products where prod_name regexp '\\([0-9] sticks?\\)' order by prod_name;
```

```
mysql> select prod_name from products where prod_name regexp '\\([0-9] sticks?\\)' order by prod_name;
+----------------+
| prod_name      |
+----------------+
| TNT (1 stick)  |
| TNT (5 sticks) |
+----------------+
2 rows in set (0.00 sec)
```

另外一个例子：

```mysql
select prod_name from products where prod_name regexp '[[:digit:]]{4}' order by prod_name;
```

```
mysql> select prod_name from products where prod_name regexp '[[:digit:]]{4}' order by prod_name;
+--------------+
| prod_name    |
+--------------+
| JetPack 1000 |
| JetPack 2000 |
+--------------+
2 rows in set (0.00 sec)
```

上面的例子也可如此编写：

```mysql
select prod_name from products where prod_name regexp '[0-9][0-9][0-9][0-9]' order by prod_name;
```

### 定位符

为了匹配特定位置的文本，可以使用下列定位符：

| 元字符  | 说明       |
| ------- | ---------- |
| ^       | 文本的开始 |
| $       | 文本的结尾 |
| [[:<:]] | 词的开始   |
| [[:>:]] | 词的结尾   |

例如找出以一个数（包括小数点开始的数）开始的所有产品：

```mysql
select prod_name from products where prod_name regexp '^[[0-9]\\.]' order by prod_name;
// 或
select prod_name from products where prod_name regexp '^[[:digit:]\\.]' order by prod_name;
```

```
mysql> select prod_name from products where prod_name regexp '^[[0-9]\\.]' order by prod_name;
+--------------+
| prod_name    |
+--------------+
| .5 ton anvil |
| 1 ton anvil  |
| 2 ton anvil  |
+--------------+
3 rows in set (0.00 sec)
```

> `^`的双重用途，在集合（用 [ 和 ] 定义）中，用它来否定该集合，否则，用来指串的开始处。

#### 简单的正则表达式测试

可以在不实用数据库表的情况下用`select`来测试正则表达式。`REGEXP`检查总是返回0（没有匹配）或者1（匹配）。

语法如下：

```mysql
select 'hello' regexp '[0-9]';
select 'hello' regexp '[a-z]{2,}';
```

```
mysql> select 'hello' regexp '[a-z]{2,}';
+----------------------------+
| 'hello' regexp '[a-z]{2,}' |
+----------------------------+
|                          1 |
+----------------------------+
1 row in set (0.00 sec)
```

## 第十章 创建计算字段


