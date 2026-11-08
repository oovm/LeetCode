namespace probe.min_heap_kth;

using std.collection

# 最小堆：数组表示，父节点 `(i - 1) / 2`，子节点 `2i + 1` 与 `2i + 2`。
structure MinHeap {
    items: ArrayList<i64>
}

micro heap_new(capacity: i64) -> MinHeap {
    let mut items: ArrayList<i64> = ArrayList::new(capacity as usize)
    return MinHeap { items: items }
}

micro sift_up(mut heap: MinHeap, start: i64) -> unit {
    let mut index: i64 = start
    while index > 0 {
        let parent: i64 = (index - 1) / 2
        if heap.items⁅parent as usize⁆ <= heap.items⁅index as usize⁆ {
            return
        }
        let value: i64 = heap.items⁅index as usize⁆
        heap.items.set_cardinal(index as usize, heap.items⁅parent as usize⁆)
        heap.items.set_cardinal(parent as usize, value)
        index = parent
    }
}

micro sift_down(mut heap: MinHeap, start: i64) -> unit {
    let mut index: i64 = start
    let size: i64 = heap.items.length() as i64
    while index * 2 + 1 < size {
        let left: i64 = index * 2 + 1
        let right: i64 = left + 1
        let mut smallest: i64 = index
        if heap.items⁅left as usize⁆ < heap.items⁅smallest as usize⁆ {
            smallest = left
        }
        if right < size && heap.items⁅right as usize⁆ < heap.items⁅smallest as usize⁆ {
            smallest = right
        }
        if smallest == index {
            return
        }
        let value: i64 = heap.items⁅index as usize⁆
        heap.items.set_cardinal(index as usize, heap.items⁅smallest as usize⁆)
        heap.items.set_cardinal(smallest as usize, value)
        index = smallest
    }
}

micro heap_push(mut heap: MinHeap, value: i64) -> unit {
    heap.items.push(value)
    sift_up(heap, heap.items.length() as i64 - 1)
}

micro heap_pop(mut heap: MinHeap) -> i64 {
    let top: i64 = heap.items⁅0 as usize⁆
    let last: i64 = heap.items.pop().unwrap_or(0)
    if heap.items.length() > 0 {
        heap.items.set_cardinal(0 as usize, last)
        sift_down(heap, 0)
    }
    return top
}

# 堆排序：逐个弹出最小值拼成升序数字串。
[export(name: "heapSortChecksum")]
micro heap_sort_checksum() -> i64 {
    let mut heap: MinHeap = heap_new(8)
    heap_push(heap, 5)
    heap_push(heap, 3)
    heap_push(heap, 8)
    heap_push(heap, 1)
    heap_push(heap, 9)
    heap_push(heap, 2)
    let mut checksum: i64 = 0
    while heap.items.length() > 0 {
        checksum = checksum * 10 + heap_pop(heap)
    }
    return checksum
}

# 大小为 k 的最小堆求第 k 大：堆顶就是当前第 k 大。
micro kth_largest(values: ArrayList<i64>, k: i64) -> i64 {
    let mut heap: MinHeap = heap_new(k + 1)
    let mut seen: i64 = 0
    loop value in values {
        if seen < k {
            heap_push(heap, value)
        } else {
            if value > heap.items⁅0 as usize⁆ {
                heap.items.set_cardinal(0 as usize, value)
                sift_down(heap, 0)
            }
        }
        seen = seen + 1
    }
    return heap.items⁅0 as usize⁆
}

[export(name: "kthLargestValue")]
micro kth_largest_value() -> i64 {
    let mut values: ArrayList<i64> = ArrayList::new(6)
    values.push(3)
    values.push(2)
    values.push(1)
    values.push(5)
    values.push(6)
    values.push(4)
    return kth_largest(values, 2)
}
