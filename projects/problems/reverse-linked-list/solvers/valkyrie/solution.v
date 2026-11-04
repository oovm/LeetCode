namespace leetcode.reverse_linked_list;

# ABI 传入的是值数组：从尾部向头部读取即得到逆置序列。
# 空链表在题面里是 `null`，因此理想返回类型是 `Option<ArrayList<i64>>`。
[export(case: "camelCase")]
micro reverseList(head: ArrayList<i64>) -> Option<ArrayList<i64>> {
    if head.length() == 0 {
        return option_none::<ArrayList<i64>>()
    }
    let mut result: ArrayList<i64> = ArrayList::new(head.length())
    let mut index: usize = head.length()
    while index > 0 {
        index = index - 1
        result.push(head⁅index⁆)
    }
    return Some(result)
}

class Solution {
    micro reverseList(self, head: ArrayList<i64>): Option<ArrayList<i64>> {
        return reverseList(head)
    }
}
