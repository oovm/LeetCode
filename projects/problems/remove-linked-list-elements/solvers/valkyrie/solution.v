namespace leetcode.remove_linked_list_elements;

# 值数组过滤：不等于目标值的元素按原顺序保留。
# 过滤后可能为空，空链表在题面里是 `null`，所以理想返回类型是 `Option<ArrayList<i64>>`。
[export(case: "camelCase")]
micro removeElements(head: ArrayList<i64>, val: i64) -> Option<ArrayList<i64>> {
    let mut result: ArrayList<i64> = ArrayList::new(head.length())
    let mut i: usize = 0
    while i < head.length() {
        if head⁅i⁆ != val {
            result.push(head⁅i⁆)
        }
        i = i + 1
    }
    if result.length() == 0 {
        return None
    }
    return Some(result)
}

class Solution {
    micro removeElements(self, head: ArrayList<i64>, val: i64): Option<ArrayList<i64>> {
        return removeElements(head, val)
    }
}
