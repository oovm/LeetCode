namespace leetcode.split_array_into_consecutive_subsequences;

using std.collection;

# 升序处理每个值：优先续接已有序列（tails[v]），剩余的量必须各自新开长度 3 的序列，
# 因此要求 v+1、v+2 的剩余频次足够。总代价 O(n log n)（排序）加 O(n)。
micro cmp_i64(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

[export(case: "camelCase")]
micro split_array(nums: ArrayList<i64>) -> bool {
    let mut counts: HashMap<i64, i64> = HashMap::new(nums.length())
    let mut ordered: ArrayList<i64> = ArrayList::new(nums.length())
    let mut index: usize = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        if counts.contains_key(value) {
            counts.insert(value, counts.get(value).unwrap() + 1)
        } else {
            counts.insert(value, 1)
            ordered.push(value)
        }
        index = index + 1
    }
    quick_sort(ordered, cmp_i64)

    let mut tails: HashMap<i64, i64> = HashMap::new(nums.length())
    index = 0
    while index < ordered.length() {
        let value: i64 = ordered⁅index⁆
        let mut available: i64 = counts.get(value).unwrap()
        let mut chain: i64 = 0
        if tails.contains_key(value) {
            chain = tails.get(value).unwrap()
        }
        if chain > 0 {
            let used: i64 = if available < chain { available } else { chain }
            available = available - used
            tails.insert(value, chain - used)
            let next_key: i64 = value + 1
            let next_value: i64 = if tails.contains_key(next_key) { tails.get(next_key).unwrap() } else { 0 }
            tails.insert(next_key, next_value + used)
        }
        if available > 0 {
            let first: i64 = if counts.contains_key(value + 1) { counts.get(value + 1).unwrap() } else { -1 }
            let second: i64 = if counts.contains_key(value + 2) { counts.get(value + 2).unwrap() } else { -1 }
            if first < available || second < available {
                return false
            }
            counts.insert(value + 1, first - available)
            counts.insert(value + 2, second - available)
            let restart_key: i64 = value + 3
            let restart: i64 = if tails.contains_key(restart_key) { tails.get(restart_key).unwrap() } else { 0 }
            tails.insert(restart_key, restart + available)
        }
        index = index + 1
    }
    return true
}

class Solution {
    micro canSplitArray(self, nums: ArrayList<i64>): bool {
        return split_array(nums)
    }
}
