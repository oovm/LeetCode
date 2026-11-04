namespace leetcode.number_of_sub_arrays_with_odd_sum;

using std.collection;

# 临时绕过：`loop <var> in <ArrayList>` 在 OVM 后端因 `Cast` lowering 缺失而编译期失败（fail-closed 前表现为运行期零迭代），这里改用显式索引循环；OVM 后端 `Cast` lowering 落地后还原为 `loop ... in`。
# 前缀奇偶计数：当前前缀为奇时，之前每个偶前缀都构成一个奇数和的子数组。
# 当前前缀为偶时，之前每个奇前缀都构成一个奇数和的子数组。
[export(case: "camelCase")]
micro numOfSubarrays(arr: ArrayList<i64>) -> i64 {
    let mut even_prefixes: i64 = 1
    let mut odd_prefixes: i64 = 0
    let mut parity: i64 = 0
    let mut total: i64 = 0
    let mut loop_index_13: usize = 0
    while loop_index_13 < arr.length() {
        let value: i64 = arr⁅loop_index_13⁆
            if value % 2 != 0 {
                parity = 1 - parity
            }
            if parity == 1 {
                total = total + even_prefixes
                odd_prefixes = odd_prefixes + 1
            } else {
                total = total + odd_prefixes
                even_prefixes = even_prefixes + 1
            }
        loop_index_13 = loop_index_13 + 1
    }
    return total % 1000000007
}

class Solution {
    micro numOfSubarrays(self, arr: ArrayList<i64>): i64 {
        return numOfSubarrays(arr)
    }
}
