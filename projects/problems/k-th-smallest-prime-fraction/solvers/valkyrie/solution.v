namespace leetcode.k_th_smallest_prime_fraction;

using std.collection;

# 以 (分子下标, 分母下标) 为堆元素，用交叉相乘精确比较大小，手写最小堆。
# 先把 arr[0]/arr[j] 全部入堆，弹 k-1 次并把同分母的下一个分子压回，O((n+k) log n)。

micro fraction_less(arr: ArrayList<i64>, left: ArrayList<i64>, right: ArrayList<i64>) -> bool {
    let left_num: i64 = left⁅0⁆
    let left_den: i64 = left⁅1⁆
    let right_num: i64 = right⁅0⁆
    let right_den: i64 = right⁅1⁆
    let lhs: i64 = arr⁅left_num as usize⁆ * arr⁅right_den as usize⁆
    let rhs: i64 = arr⁅right_num as usize⁆ * arr⁅left_den as usize⁆
    if lhs != rhs {
        return lhs < rhs
    }
    if left_num != right_num {
        return left_num < right_num
    }
    return left_den < right_den
}

micro sift_up(heap: ArrayList<ArrayList<i64>>, arr: ArrayList<i64>) -> unit {
    let mut index: usize = heap.length() - 1
    while index > 0 {
        let parent: usize = (index - 1) / 2
        if !fraction_less(arr, heap⁅index⁆, heap⁅parent⁆) {
            break
        }
        let swap: ArrayList<i64> = heap⁅index⁆
        heap⁅index⁆ = heap⁅parent⁆
        heap⁅parent⁆ = swap
        index = parent
    }
}

micro sift_down(heap: ArrayList<ArrayList<i64>>, arr: ArrayList<i64>) -> unit {
    let size: usize = heap.length()
    let mut index: usize = 0
    while true {
        let left: usize = index * 2 + 1
        if left >= size {
            break
        }
        let right: usize = left + 1
        let mut smallest: usize = left
        if right < size && fraction_less(arr, heap⁅right⁆, heap⁅left⁆) {
            smallest = right
        }
        if !fraction_less(arr, heap⁅smallest⁆, heap⁅index⁆) {
            break
        }
        let swap: ArrayList<i64> = heap⁅index⁆
        heap⁅index⁆ = heap⁅smallest⁆
        heap⁅smallest⁆ = swap
        index = smallest
    }
}

micro push_pair(heap: ArrayList<ArrayList<i64>>, arr: ArrayList<i64>, numerator: i64, denominator: i64) -> unit {
    let mut pair: ArrayList<i64> = ArrayList::new(2)
    pair.push(numerator)
    pair.push(denominator)
    heap.push(pair)
    sift_up(heap, arr)
}

[export(case: "camelCase")]
micro kth_smallest_prime_fraction(arr: ArrayList<i64>, k: i64) -> ArrayList<i64> {
    let size: i64 = arr.length() as i64
    let mut heap: ArrayList<ArrayList<i64>> = ArrayList::new(size as usize)
    let mut denominator: i64 = 1
    while denominator < size {
        push_pair(heap, arr, 0, denominator)
        denominator = denominator + 1
    }

    let mut remaining: i64 = k
    while remaining > 1 {
        let top: ArrayList<i64> = heap⁅0⁆
        let numerator: i64 = top⁅0⁆
        let current_denominator: i64 = top⁅1⁆
        let last: ArrayList<i64> = heap.pop().unwrap()
        if heap.length() > 0 {
            heap⁅0⁆ = last
            sift_down(heap, arr)
        }
        if numerator + 1 < current_denominator {
            push_pair(heap, arr, numerator + 1, current_denominator)
        }
        remaining = remaining - 1
    }

    let winner: ArrayList<i64> = heap⁅0⁆
    let winner_numerator: i64 = winner⁅0⁆
    let winner_denominator: i64 = winner⁅1⁆
    let mut answer: ArrayList<i64> = ArrayList::new(2)
    answer.push(arr⁅winner_numerator as usize⁆)
    answer.push(arr⁅winner_denominator as usize⁆)
    return answer
}

class Solution {
    micro kthSmallestPrimeFraction(self, arr: ArrayList<i64>, k: i64): ArrayList<i64> {
        return kth_smallest_prime_fraction(arr, k)
    }
}
