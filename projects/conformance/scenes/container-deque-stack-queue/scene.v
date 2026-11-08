namespace probe.container_deque_stack_queue;

using std.collection

# 双端队列：头出 0，尾出 2，剩余头元素 1。
[export(name: "dequeBothEnds")]
micro deque_both_ends() -> i64 {
    let mut deque: Deque<i64> = Deque::new()
    deque.push_back(1)
    deque.push_back(2)
    deque.push_front(0)
    let front: i64 = deque.pop_front().unwrap_or(-1)
    let back: i64 = deque.pop_back().unwrap_or(-1)
    let remaining: i64 = deque.peek_front().unwrap_or(-1)
    return front * 100 + back * 10 + remaining
}

# 栈后进先出：弹出 3，查看 2，压入 4 后弹出 4，剩余长度 2。
[export(name: "stackLifo")]
micro stack_lifo() -> i64 {
    let mut stack: Stack<i64> = Stack::new()
    stack.push(1)
    stack.push(2)
    stack.push(3)
    let top: i64 = stack.pop().unwrap_or(-1)
    let next: i64 = stack.peek().unwrap_or(-1)
    stack.push(4)
    let pushed: i64 = stack.pop().unwrap_or(-1)
    let length: usize = stack.length()
    return top * 1000 + next * 100 + pushed * 10 + (length as i64)
}

# 队列先进先出：先出 1，压入 4 后查看 2，排空求和 2+3+4。
[export(name: "queueFifo")]
micro queue_fifo() -> i64 {
    let mut queue: Queue<i64> = Queue::new()
    queue.enqueue(1)
    queue.enqueue(2)
    queue.enqueue(3)
    let first: i64 = queue.dequeue().unwrap_or(-1)
    queue.enqueue(4)
    let head: i64 = queue.peek().unwrap_or(-1)
    let length: usize = queue.length()
    let mut total: i64 = 0
    while queue.length() > 0 {
        total = total + queue.dequeue().unwrap_or(-1)
    }
    return first * 1000 + head * 100 + (length as i64) * 10 + total
}
