namespace probe.monotonic_stack_window;

using std.collection

# 读取辅助：避免在下标表达式里嵌套下标解析产生歧义。
micro value_of(values: ArrayList<i64>, index: i64) -> i64 {
    return values⁅index as usize⁆
}

micro slot_of(queue: ArrayList<i64>, slot: i64) -> i64 {
    return queue⁅slot as usize⁆
}

micro sample_values() -> ArrayList<i64> {
    let mut values: ArrayList<i64> = ArrayList::new(5)
    values.push(2)
    values.push(1)
    values.push(2)
    values.push(4)
    values.push(3)
    return values
}

# 单调递减栈从右向左扫，栈顶即下一个严格更大元素；没有则为 -1。
micro next_greater_sum(values: ArrayList<i64>) -> i64 {
    let length: i64 = values.length() as i64
    let mut stack: ArrayList<i64> = ArrayList::new(length as usize)
    let mut total: i64 = 0
    let mut index: i64 = length - 1
    while index >= 0 {
        let current: i64 = value_of(values, index)
        let mut shrinking: bool = true
        while shrinking && stack.length() > 0 {
            let top: i64 = slot_of(stack, stack.length() as i64 - 1)
            if top <= current {
                stack.pop()
            } else {
                shrinking = false
            }
        }
        if stack.length() > 0 {
            total = total + slot_of(stack, stack.length() as i64 - 1)
        } else {
            total = total - 1
        }
        stack.push(current)
        index = index - 1
    }
    return total
}

# 单调递减双端队列存下标：队首是窗口最大值，队尾在插入前弹掉更小的元素。
micro window_max_sum(values: ArrayList<i64>, window: i64) -> i64 {
    let length: i64 = values.length() as i64
    let mut queue: ArrayList<i64> = ArrayList::new(length as usize)
    let mut head: i64 = 0
    let mut total: i64 = 0
    let mut index: i64 = 0
    while index < length {
        let current: i64 = value_of(values, index)
        let mut shrinking: bool = true
        while shrinking && queue.length() as i64 > head {
            let back: i64 = queue.length() as i64 - 1
            let back_value: i64 = value_of(values, slot_of(queue, back))
            if back_value <= current {
                queue.pop()
            } else {
                shrinking = false
            }
        }
        queue.push(index)
        if slot_of(queue, head) <= index - window {
            head = head + 1
        }
        if index >= window - 1 {
            total = total + value_of(values, slot_of(queue, head))
        }
        index = index + 1
    }
    return total
}

# 单调递增栈求直方图最大矩形：栈顶比当前高时结算宽度。
micro largest_rectangle(heights: ArrayList<i64>) -> i64 {
    let length: i64 = heights.length() as i64
    let mut stack: ArrayList<i64> = ArrayList::new(length as usize)
    let mut best: i64 = 0
    let mut index: i64 = 0
    while index <= length {
        let mut current: i64 = 0
        if index < length {
            current = value_of(heights, index)
        }
        let mut settling: bool = true
        while settling && stack.length() > 0 {
            let top_index: i64 = slot_of(stack, stack.length() as i64 - 1)
            let top_height: i64 = value_of(heights, top_index)
            if top_height <= current {
                settling = false
            } else {
                stack.pop()
                let mut left_bound: i64 = -1
                if stack.length() > 0 {
                    left_bound = slot_of(stack, stack.length() as i64 - 1)
                }
                let area: i64 = top_height * (index - left_bound - 1)
                if area > best {
                    best = area
                }
            }
        }
        stack.push(index)
        index = index + 1
    }
    return best
}

# 2,1,2,4,3 的下一个更大元素为 4,2,4,-1,-1，求和 8。
[export(name: "nextGreaterSum")]
micro next_greater_sum_export() -> i64 {
    return next_greater_sum(sample_values())
}

# 1,3,-1,-3,5,3,6,7 的定宽 3 窗口最大值为 3,3,5,5,6,7，求和 29。
[export(name: "windowMaxSum")]
micro window_max_sum_export() -> i64 {
    let mut values: ArrayList<i64> = ArrayList::new(8)
    values.push(1)
    values.push(3)
    values.push(-1)
    values.push(-3)
    values.push(5)
    values.push(3)
    values.push(6)
    values.push(7)
    return window_max_sum(values, 3)
}

# 直方图 2,1,5,6,2,3 的最大矩形面积为 10。
[export(name: "histogramLargest")]
micro histogram_largest_export() -> i64 {
    let mut heights: ArrayList<i64> = ArrayList::new(6)
    heights.push(2)
    heights.push(1)
    heights.push(5)
    heights.push(6)
    heights.push(2)
    heights.push(3)
    return largest_rectangle(heights)
}
