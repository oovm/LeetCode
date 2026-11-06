namespace leetcode.apply_operations_to_an_array;

using std.collection;

# 先就地合并相邻相等项，再把所有 0 移到末尾。
[export(case: "camelCase")]
micro applyOperations(nums: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = nums.length()
    let mut working: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        working.push(nums⁅index⁆)
        index = index + 1
    }

    index = 0
    while index + 1 < count {
        if working⁅index⁆ == working⁅index + 1⁆ {
            working⁅index⁆ = working⁅index⁆ * 2
            working⁅index + 1⁆ = 0
        }
        index = index + 1
    }

    let mut answer: ArrayList<i64> = ArrayList::new(count)
    index = 0
    while index < count {
        let value: i64 = working⁅index⁆
        if value != 0 {
            answer.push(value)
        }
        index = index + 1
    }
    while answer.length() < count {
        answer.push(0)
    }
    return answer
}

class Solution {
    micro applyOperations(self, nums: ArrayList<i64>): ArrayList<i64> {
        return applyOperations(nums)
    }
}
