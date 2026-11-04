namespace leetcode.take_gifts_from_the_richest_pile;

using std.collection;

# 整数平方根：二分收敛到 floor(sqrt(value))，避免浮点转换的舍入误差。
micro floor_sqrt(value: i64) -> i64 {
    let mut low: i64 = 0
    let mut high: i64 = value
    while low < high {
        let mid: i64 = high - (high - low) / 2
        if mid * mid <= value {
            low = mid
        } else {
            high = mid - 1
        }
    }
    return low
}

# 最大堆用「取负入最小堆」实现；每次取出堆顶换成其平方根并维护总和。
[export(case: "camelCase")]
micro pickGifts(gifts: ArrayList<i64>, k: i64) -> i64 {
    let mut heap: BinaryHeap<i64> = BinaryHeap::new()
    let mut total: i64 = 0
    let mut i: usize = 0
    while i < gifts.length() {
        let value: i64 = gifts⁅i⁆
        heap.push(0 - value)
        total = total + value
        i = i + 1
    }

    let mut step: i64 = 0
    while step < k && heap.length() > 0 {
        let richest: i64 = 0 - heap.pop().unwrap()
        let reduced: i64 = floor_sqrt(richest)
        total = total - richest + reduced
        heap.push(0 - reduced)
        step = step + 1
    }
    return total
}

class Solution {
    micro pickGifts(self, gifts: ArrayList<i64>, k: i64): i64 {
        return pickGifts(gifts, k)
    }
}
