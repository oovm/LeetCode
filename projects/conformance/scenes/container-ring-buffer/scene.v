namespace probe.container_ring_buffer;

using std.collection

micro flag(value: bool) -> i64 {
    if value {
        return 1
    }
    return 0
}

# 容量 3：前三次入队成功，第四次因满被拒。
[export(name: "ringBufferBounds")]
micro ring_buffer_bounds() -> i64 {
    let mut buffer: RingBuffer<i64> = RingBuffer::new(3)
    let accepted: i64 = flag(buffer.enqueue(1)) + flag(buffer.enqueue(2)) + flag(buffer.enqueue(3)) + flag(buffer.enqueue(4))
    let rejected: i64 = flag(buffer.is_full()) - flag(buffer.enqueue(5))
    return accepted * 10 + rejected
}

# 出队两项后再入队触发尾指针回绕，排空顺序 1,2,3,4。
[export(name: "ringBufferWrapAround")]
micro ring_buffer_wrap_around() -> i64 {
    let mut buffer: RingBuffer<i64> = RingBuffer::new(3)
    buffer.enqueue(1)
    buffer.enqueue(2)
    buffer.enqueue(3)
    let first: i64 = buffer.dequeue().unwrap_or(-1)
    let second: i64 = buffer.dequeue().unwrap_or(-1)
    buffer.enqueue(4)
    let mut total: i64 = 0
    while buffer.length() > 0 {
        total = total * 10 + buffer.dequeue().unwrap_or(-1)
    }
    return first * 1000 + second * 100 + total
}
