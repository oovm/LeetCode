namespace leetcode.intersection_of_multiple_arrays;

using std.collection;

# 值域 1..1000 桶计数：出现次数等于数组个数即公共元素，升序输出。
[export(case: "camelCase")]
micro intersection(nums: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
    let mut count: ArrayList<i64> = ArrayList::new(1001)
    let mut slot: usize = 0
    while slot <= 1000 {
        count.push(0)
        slot = slot + 1
    }
    loop row in nums {
        loop value in row {
            count⁅value as usize⁆ = count⁅value as usize⁆ + 1
        }
    }
    let rows: i64 = nums.length() as i64
    let mut out: ArrayList<i64> = ArrayList::new(0)
    let mut value: usize = 1
    while value <= 1000 {
        if count⁅value⁆ == rows {
            out.push(value as i64)
        }
        value = value + 1
    }
    return out
}

class Solution {
    micro intersection(self, nums: ArrayList<ArrayList<i64>>): ArrayList<i64> {
        return intersection(nums)
    }
}
