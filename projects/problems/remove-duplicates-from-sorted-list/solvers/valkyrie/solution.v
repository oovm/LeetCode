namespace leetcode.remove_duplicates_from_sorted_list;

# 有序序列的重复值必然相邻：保留每个值第一次出现的位置。
# 空链表在题面里是 `null`，因此理想返回类型是 `Option<ArrayList<i64>>`。
[export(case: "camelCase")]
micro deleteDuplicates(head: ArrayList<i64>) -> Option<ArrayList<i64>> {
    if head.length() == 0 {
        return option_none::<ArrayList<i64>>()
    }
    let mut result: ArrayList<i64> = ArrayList::new(head.length())
    let mut i: usize = 0
    while i < head.length() {
        if i == 0 {
            result.push(head⁅i⁆)
        }
        else {
            let previous: usize = i - 1
            if head⁅i⁆ != head⁅previous⁆ {
                result.push(head⁅i⁆)
            }
        }
        i = i + 1
    }
    return Some(result)
}

class Solution {
    micro deleteDuplicates(self, head: ArrayList<i64>): Option<ArrayList<i64>> {
        return deleteDuplicates(head)
    }
}
