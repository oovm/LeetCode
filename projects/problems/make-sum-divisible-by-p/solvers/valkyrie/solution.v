namespace leetcode.make_sum_divisible_by_p;

using std.collection;

# 总和模 p 的余数就是需要移除的余数。用前缀余数的首次出现位置找最短可删子数组，
# 一趟 O(n)。
[export(case: "camelCase")]
micro minSubarray(nums: ArrayList<i64>, p: i64) -> i64 {
    let count: i64 = nums.length() as i64
    let mut total: i64 = 0
    let mut i: i64 = 0
    while i < count {
        total = (total + nums⁅i as usize⁆) % p
        i = i + 1
    }
    if total == 0 {
        return 0
    }

    let needed: i64 = total
    let mut first: HashMap<i64, i64> = HashMap::new(count as usize)
    first.insert(0, 0 - 1)
    let mut prefix: i64 = 0
    let mut shortest: i64 = count
    i = 0
    while i < count {
        prefix = (prefix + nums⁅i as usize⁆) % p
        let mut wanted: i64 = (prefix - needed) % p
        if wanted < 0 {
            wanted = wanted + p
        }
        if first.contains_key(wanted) {
            let length: i64 = i - first.get(wanted).unwrap()
            if length < shortest {
                shortest = length
            }
        }
        first.insert(prefix, i)
        i = i + 1
    }
    if shortest == count {
        return 0 - 1
    }
    return shortest
}

class Solution {
    micro minSubarray(self, nums: ArrayList<i64>, p: i64): i64 {
        return minSubarray(nums, p)
    }
}
