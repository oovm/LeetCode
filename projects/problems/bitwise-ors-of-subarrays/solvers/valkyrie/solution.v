namespace leetcode.bitwise_ors_of_subarrays;

# 临时绕过：`loop <var> in <ArrayList>` 当前编译不报错但运行期零迭代，这里改用显式索引循环；`IntoIterator` 合同恢复后还原为 `loop ... in`。
# 维护「以当前元素结尾的所有子数组 OR」去重集合，并累计全局去重集合。
[export(case: "camelCase")]
micro subarray_bitwise_o_rs(arr: ArrayList<i64>) -> i64 {
    let mut current: ArrayList<i64> = ArrayList::new(0)
    let mut seen: HashMap<i64, i64> = HashMap::new(0)
    let mut total: i64 = 0
    let mut loop_index_9: usize = 0
    while loop_index_9 < arr.length() {
        let x: i64 = arr⁅loop_index_9⁆
            let mut next: ArrayList<i64> = ArrayList::new(current.length() + 1)
            let mut next_seen: HashMap<i64, i64> = HashMap::new(0)
            next_seen.insert(x, 1)
            next.push(x)
            if !seen.contains_key(x) {
                seen.insert(x, 1)
                total = total + 1
            }
            let mut k: usize = 0
            while k < current.length() {
                let combined: i64 = current⁅k⁆ | x
                if !next_seen.contains_key(combined) {
                    next_seen.insert(combined, 1)
                    next.push(combined)
                }
                if !seen.contains_key(combined) {
                    seen.insert(combined, 1)
                    total = total + 1
                }
                k = k + 1
            }
            current = next
        loop_index_9 = loop_index_9 + 1
    }
    return total
}

class Solution {
    micro subarrayBitwiseORs(self, arr: ArrayList<i64>): i64 {
        return subarray_bitwise_o_rs(arr)
    }
}
