namespace leetcode.bitwise_ors_of_subarrays;

# 已还原（`172b944a` 修复块退出写回 + 当前 addon `25132ccf`）：`loop <var> in <ArrayList>` 可用。
# 维护「以当前元素结尾的所有子数组 OR」去重集合，并累计全局去重集合。
[export(case: "camelCase")]
micro subarray_bitwise_o_rs(arr: ArrayList<i64>) -> i64 {
    let mut current: ArrayList<i64> = ArrayList::new(0)
    let mut seen: HashMap<i64, i64> = HashMap::new(0)
    let mut total: i64 = 0
    loop x in arr {
        let mut next: ArrayList<i64> = ArrayList::new(current.length() + 1)
        let mut next_seen: HashMap<i64, i64> = HashMap::new(0)
        next_seen.insert(x, 1)
        next.push(x)
        if !seen.contains_key(x) {
            seen.insert(x, 1)
            total = total + 1
        }
        loop existing in current {
            let combined: i64 = existing | x
            if !next_seen.contains_key(combined) {
                next_seen.insert(combined, 1)
                next.push(combined)
            }
            if !seen.contains_key(combined) {
                seen.insert(combined, 1)
                total = total + 1
            }
        }
        current = next
    }
    return total
}

class Solution {
    micro subarrayBitwiseORs(self, arr: ArrayList<i64>): i64 {
        return subarray_bitwise_o_rs(arr)
    }
}
