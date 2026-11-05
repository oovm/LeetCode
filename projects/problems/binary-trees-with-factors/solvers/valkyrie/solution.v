namespace leetcode.binary_trees_with_factors;

using std.collection;

micro cmp_i64(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

# 升序排序后，`dp[i]` 表示以 `arr[i]` 为根的可构树数。
# 对每个因子对 `(b, a / b)`，两边子树独立组合，累乘进 `dp[i]`。
[export(case: "camelCase")]
micro num_factored_binary_trees(mut arr: ArrayList<i64>) -> i64 {
    let modulus: i64 = 1000000007
    quick_sort(arr, cmp_i64)
    let n: usize = arr.length()
    let mut positions: HashMap<i64, i64> = HashMap::new(n)
    let mut index: usize = 0
    while index < n {
        positions.insert(arr⁅index⁆, index as i64)
        index = index + 1
    }
    let mut dp: ArrayList<i64> = ArrayList::new(n)
    let mut fill: usize = 0
    while fill < n {
        dp.push(1)
        fill = fill + 1
    }
    let mut right: usize = 0
    while right < n {
        let value: i64 = arr⁅right⁆
        let mut left: usize = 0
        while left < right {
            let factor: i64 = arr⁅left⁆
            if value % factor == 0 {
                let other: i64 = value / factor
                if positions.contains_key(other) {
                    let slot: i64 = positions.get(other).unwrap()
                    dp⁅right⁆ = (dp⁅right⁆ + dp⁅left⁆ * dp⁅slot as usize⁆ % modulus) % modulus
                }
            }
            left = left + 1
        }
        right = right + 1
    }
    let mut total: i64 = 0
    let mut scan: usize = 0
    while scan < n {
        total = (total + dp⁅scan⁆) % modulus
        scan = scan + 1
    }
    return total
}

class Solution {
    micro numFactoredBinaryTrees(self, arr: ArrayList<i64>): i64 {
        return num_factored_binary_trees(arr)
    }
}
