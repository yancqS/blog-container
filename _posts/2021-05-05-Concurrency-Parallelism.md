---
title: Concurrency vs. Parallelism
description: Concurrency vs. Parallelism
date: '2021-05-05'
author: Yoha
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210505231625.png
tags:
    - 翻译
    - 转载
meta:
  - name: title
    content: Concurrency vs. Parallelism
  - name: description
    content: Concurrency vs. Parallelism
  - name: keywords
    content: Concurrency vs. Parallelism
  - name: author
    content: Yoha
featured: true
---

# Concurrency vs. Parallelism
>并发 vs. 并行

**Concurrency** means multiple tasks which start, run, and complete in overlapping time periods, in no specific order. **Parallelism** is when multiple tasks OR several part of a unique task literally run at the same time, e.g. on a multi-core processor. Remember that Concurrency and parallelism are NOT the same thing.
>并发是指多个任务，它们在重叠的时间段内（没有特定的顺序）开始，运行和完成。 并行是指多个任务或唯一任务的多个部分同时运行的情况，例如，在多核处理器上。 请记住，并发和并行性不是一回事。

Let’s understand more in detail that what I mean when I say Concurrency vs. Parallelism.
>让我们更详细地了解一下我所说的并发与并行的含义。

## Concurrency
>并发

Concurrency is essentially applicable when we talk about minimum two tasks or more. When an application is capable of executing two tasks virtually at same time, we call it concurrent application. Though here tasks run looks like simultaneously, but essentially they MAY not. They take advantage of CPU time-slicing feature of operating system where each task run part of its task and then go to waiting state. When first task is in waiting state, CPU is assigned to second task to complete it’s part of task.
>当我们讨论最少两个或更多任务时，并发基本上是适用的。当一个应用程序能够同时执行两个任务时，我们称之为并发应用程序。虽然这里的任务看起来是同时运行的，但本质上它们可能不是。它们利用了操作系统的CPU ***时间切片*** 特性，每个任务运行其部分任务，然后进入等待状态。当第一个任务处于等待状态时，CPU被分配给第二个任务来完成任务的一部分。

Operating system based on priority of tasks, thus, assigns CPU and other computing resources e.g. memory; turn by turn to all tasks and give them chance to complete. To end user, it seems that all tasks are running in parallel. This is called concurrency.
>操作系统根据任务的优先级分配CPU和其他计算资源（例如内存）依次完成所有任务。对于终端用户来说，**似乎**所有任务都是并行运行的。这称为并发。

## Parallelism
>并行

Parallelism does not require two tasks to exist. It literally physically run parts of tasks OR multiple tasks, at the same time using multi-core infrastructure of CPU, by assigning one core to each task or sub-task.
>并行不需要两个任务。通过为每个任务或子任务分配一个内核，利用CPU的多核基础架构同时运行部分任务或多个任务。

Parallelism requires hardware with multiple processing units, essentially. In single core CPU, you may get concurrency but NOT parallelism.
>从本质上讲，并行需要具有多个处理单元的硬件。在单核CPU中，可以获得并发性，但不能获得并行性。

## Differences between concurrency vs. parallelism
>并发和并行的区别

Now let’s list down remarkable differences between concurrency and parallelism.
>现在，让我们列出并发和并行之间的显着差异。

Concurrency is when two tasks can start, run, and complete in overlapping time periods. Parallelism is when tasks literally run at the same time, eg. on a multi-core processor.
>并发是指两个任务可以在重叠的时间段内启动、运行和完成。并行是指任务实际上在同一时间运行，例如。 在多核处理器上。

Concurrency is the composition of independently executing processes, while parallelism is the simultaneous execution of (possibly related) computations.
>并发性是独立执行的进程的组合，而并行性是同时执行（可能相关的）计算。

Concurrency is about **dealing with lots of things** at once. Parallelism is about **doing lots of things** at once.
>并发是指同时处理很多事情。并行是指同时做很多事情。

An application can be concurrent – but not parallel, which means that it processes more than one task at the same time, but no two tasks are executing at same time instant.
>应用程序可以是并发的，但不能是并行的，这意味着它可以同时处理多个任务，但不能同时执行两个任务。

An application can be parallel – but not concurrent, which means that it processes multiple sub-tasks of a task in multi-core CPU at same time.
>应用程序可以是并行的，但不能是并发的，这意味着它在多核CPU中同时处理一个任务的多个子任务。

An application can be neither parallel – nor concurrent, which means that it processes all tasks one at a time, sequentially.
>应用程序既不能并行也不能并发，这意味着它一次按顺序处理一个任务。

An application can be both parallel – and concurrent, which means that it processes multiple tasks concurrently in multi-core CPU at same time .
>一个应用程序既可以是并行的，也可以是并发的，这意味着它可以在多核CPU中同时处理多个任务。

That’s all about **Concurrency vs. Parallelism**, a very important concept in java multi-threading concepts.
>这就是关于并发与并行的全部内容，这是Java多线程概念中非常重要的概念。

Happy Learning !!

>[原文连接](https://howtodoinjava.com/java/multi-threading/concurrency-vs-parallelism/)
