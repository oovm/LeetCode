namespace leetcode.minimum_number_of_operations_to_make_elements_in_array_distinct;

using std.collection;

# 从右向左收集，首次遇到重复时该位置之前的元素都会被删除，操作数为其下标除以三再加一。
[export(case: "camelCase")]
micro minimumOperations(nums: ArrayList<i64>) -> i64 {
    let mut seen: HashSet<i64> = HashSet::new()
    let mut position: i64 = nums.length() as i64 - 1
    while position >= 0 {
        let value: i64 = nums⁅position as usize⁆
        if seen.contains(value) {
            return position / 3 + 1
        }
        seen.insert(value)
        position = position - 1
    }
    return 0
}

class Solution {
    micro minimumOperations(self, nums: ArrayList<i64>): i64 {
        return minimumOperations(nums)
    }
}
