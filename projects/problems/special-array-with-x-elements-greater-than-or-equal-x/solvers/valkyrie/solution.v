namespace leetcode.special_array_with_x_elements_greater_than_or_equal_x;

using std.collection;

# 排序后枚举候选 x：降序视角下 `x = n - i` 恰有 i 个元素小于 x；检查边界严格性。
[export(case: "camelCase")]
micro specialArray(nums: ArrayList<i64>) -> i64 {
    let mut sorted: ArrayList<i64> = ArrayList::new(nums.length())
    loop value in nums {
        sorted.push(value)
    }
    sort(sorted)
    let n: i64 = sorted.length() as i64
    let mut x: i64 = 0
    while x <= n {
        let mut count: i64 = 0
        loop value in sorted {
            if value >= x {
                count = count + 1
            }
        }
        if count == x {
            return x
        }
        x = x + 1
    }
    return -1
}

class Solution {
    micro specialArray(self, nums: ArrayList<i64>): i64 {
        return specialArray(nums)
    }
}
