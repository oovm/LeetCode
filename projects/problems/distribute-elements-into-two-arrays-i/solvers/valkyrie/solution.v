namespace leetcode.distribute_elements_into_two_arrays_i;

using std.collection;

# 首两个元素分别入两表，之后按两表末元素大小分配，最后拼接。
[export(case: "camelCase")]
micro resultArray(nums: [i64]) -> [i64] {
    let mut first: ArrayList<i64> = ArrayList::new(nums.length())
    let mut second: ArrayList<i64> = ArrayList::new(nums.length())
    first.push(nums⁅0⁆)
    second.push(nums⁅1⁆)
    let mut index: usize = 2
    while index < nums.length() {
        if first⁅first.length() - 1⁆ > second⁅second.length() - 1⁆ {
            first.push(nums⁅index⁆)
        } else {
            second.push(nums⁅index⁆)
        }
        index = index + 1
    }
    let mut result: ArrayList<i64> = ArrayList::new(nums.length())
    index = 0
    while index < first.length() {
        result.push(first⁅index⁆)
        index = index + 1
    }
    index = 0
    while index < second.length() {
        result.push(second⁅index⁆)
        index = index + 1
    }
    return result.to_array()
}

class Solution {
    micro resultArray(self, nums: [i64]): [i64] {
        return resultArray(nums)
    }
}
