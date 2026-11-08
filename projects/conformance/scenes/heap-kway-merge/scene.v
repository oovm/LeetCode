namespace probe.heap_kway_merge;

using std.collection

micro swap_slots(mut heap: ArrayList<i64>, left: i64, right: i64) -> unit {
    let temporary: i64 = heap⁅left as usize⁆
    heap.set_cardinal(left as usize, heap⁅right as usize⁆)
    heap.set_cardinal(right as usize, temporary)
}

# 向下沉：从 start 开始，到 size 为止维持最小堆。
micro sink(mut heap: ArrayList<i64>, start: i64, size: i64) -> unit {
    let mut parent: i64 = start
    let mut sinking: bool = true
    while sinking {
        let left: i64 = parent * 2 + 1
        let right: i64 = parent * 2 + 2
        let mut smallest: i64 = parent
        if left < size && heap⁅left as usize⁆ < heap⁅smallest as usize⁆ {
            smallest = left
        }
        if right < size && heap⁅right as usize⁆ < heap⁅smallest as usize⁆ {
            smallest = right
        }
        if smallest == parent {
            sinking = false
        } else {
            swap_slots(heap, parent, smallest)
            parent = smallest
        }
    }
}

micro heap_push(mut heap: ArrayList<i64>, value: i64) -> unit {
    heap.push(value)
    let mut child: i64 = heap.length() as i64 - 1
    let mut climbing: bool = true
    while climbing && child > 0 {
        let parent: i64 = (child - 1) / 2
        if heap⁅parent as usize⁆ <= heap⁅child as usize⁆ {
            climbing = false
        } else {
            swap_slots(heap, parent, child)
            child = parent
        }
    }
}

micro heap_pop(mut heap: ArrayList<i64>) -> i64 {
    let top: i64 = heap⁅0⁆
    let last: i64 = heap⁅heap.length() - 1⁆
    heap.pop()
    if heap.length() > 0 {
        heap.set_cardinal(0, last)
        sink(heap, 0, heap.length() as i64)
    }
    return top
}

# 堆合并：两堆拼接后自底向上堆化。
micro meld_heaps(left: ArrayList<i64>, right: ArrayList<i64>) -> ArrayList<i64> {
    let mut merged: ArrayList<i64> = ArrayList::new(left.length() + right.length())
    loop value in left {
        merged.push(value)
    }
    loop value in right {
        merged.push(value)
    }
    let size: i64 = merged.length() as i64
    let mut parent: i64 = size / 2 - 1
    while parent >= 0 {
        sink(merged, parent, size)
        parent = parent - 1
    }
    return merged
}

# 多路归并：堆里存 value * 4 + 路号，按 value 出堆后接该路的下一个元素。
micro kway_merge(lists: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
    let mut heap: ArrayList<i64> = ArrayList::new(8)
    let mut cursors: ArrayList<i64> = ArrayList::new(lists.length())
    let mut merged: ArrayList<i64> = ArrayList::new(8)
    let mut index: i64 = 0
    while index < lists.length() as i64 {
        cursors.push(1)
        let row: ArrayList<i64> = lists⁅index as usize⁆
        if row.length() > 0 {
            heap_push(heap, row⁅0⁆ * 4 + index)
        }
        index = index + 1
    }
    while heap.length() > 0 {
        let encoded: i64 = heap_pop(heap)
        let list_index: i64 = encoded.bit_and(3)
        merged.push(encoded >> 2)
        let cursor: i64 = cursors⁅list_index as usize⁆
        let row: ArrayList<i64> = lists⁅list_index as usize⁆
        if cursor < row.length() as i64 {
            heap_push(heap, row⁅cursor as usize⁆ * 4 + list_index)
            cursors.set_cardinal(list_index as usize, cursor + 1)
        }
    }
    return merged
}

micro sorted_three() -> ArrayList<ArrayList<i64>> {
    let mut lists: ArrayList<ArrayList<i64>> = ArrayList::new(3)
    let mut first: ArrayList<i64> = ArrayList::new(3)
    first.push(1)
    first.push(4)
    first.push(7)
    let mut second: ArrayList<i64> = ArrayList::new(3)
    second.push(2)
    second.push(5)
    second.push(8)
    let mut third: ArrayList<i64> = ArrayList::new(3)
    third.push(3)
    third.push(6)
    third.push(9)
    lists.push(first)
    lists.push(second)
    lists.push(third)
    return lists
}

# 三路归并得 1..9，拼成十进制校验和 123456789。
[export(name: "kwayMergeChecksum")]
micro kway_merge_checksum() -> i64 {
    let lists: ArrayList<ArrayList<i64>> = sorted_three()
    let mut checksum: i64 = 0
    loop value in kway_merge(lists) {
        checksum = checksum * 10 + value
    }
    return checksum
}

# 三路归并的最后一个元素是 9。
[export(name: "kwayMergeLast")]
micro kway_merge_last() -> i64 {
    let lists: ArrayList<ArrayList<i64>> = sorted_three()
    let mut last: i64 = -1
    loop value in kway_merge(lists) {
        last = value
    }
    return last
}

# 两堆 [1,3,5] 与 [2,4,6] 合并后第三个最小值是 3。
[export(name: "meldHeapsThird")]
micro meld_heaps_third() -> i64 {
    let mut left: ArrayList<i64> = ArrayList::new(3)
    left.push(1)
    left.push(3)
    left.push(5)
    let mut right: ArrayList<i64> = ArrayList::new(3)
    right.push(2)
    right.push(4)
    right.push(6)
    let mut merged: ArrayList<i64> = meld_heaps(left, right)
    heap_pop(merged)
    heap_pop(merged)
    return heap_pop(merged)
}
