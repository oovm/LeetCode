namespace leetcode.maximum_product_after_k_increments;

using std.collection;

# 最小优先队列：每次给当前最小值加一，最后取模乘积。
[export(case: "camelCase")]
micro maximumProduct(nums: ArrayList<i64>, k: i64) -> i64 {
    let mut queue: PriorityQueue<i64> = PriorityQueue::new()
    loop value in nums {
        queue.push(value)
    }

    let mut step: i64 = 0
    while step < k {
        let smallest: i64 = queue.pop().unwrap()
        queue.push(smallest + 1)
        step = step + 1
    }

    let modulo: i64 = 1000000007
    let mut product: i64 = 1
    while queue.is_empty() == false {
        product = product * queue.pop().unwrap() % modulo
    }
    return product
}

class Solution {
    micro maximumProduct(self, nums: ArrayList<i64>, k: i64): i64 {
        return maximumProduct(nums, k)
    }
}
