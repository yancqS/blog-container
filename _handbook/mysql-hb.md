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


