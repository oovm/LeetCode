namespace leetcode.merge_two_sorted_lists;

# 题目在 ABI 边界上是值数组：两个有序数组归并即可，双指针一次线性扫描。
# 空链表在题面里是 `null`，宿主可空载体是 `T?`（None 走 null wire 形状），
# 不用 `Option<T>` unite——后者在 ABI 位置降为带 tag 判别合同的 `Sum`，
# 宿主拿到的是变体身份而不是值或 null。
[export(case: "camelCase")]
micro mergeTwoLists(list1: ArrayList<i64>, list2: ArrayList<i64>) -> ArrayList<i64>? {
    if list1.length() + list2.length() == 0 {
        return null
    }
    let mut result: ArrayList<i64> = ArrayList::new(list1.length() + list2.length())
    let mut i: usize = 0
    let mut j: usize = 0
    while i < list1.length() || j < list2.length() {
        let mut take_first: bool = false
        if j >= list2.length() {
            take_first = true
        }
        else {
            if i < list1.length() {
                if list1⁅i⁆ <= list2⁅j⁆ {
                    take_first = true
                }
            }
        }
        if take_first {
            result.push(list1⁅i⁆)
            i = i + 1
        }
        else {
            result.push(list2⁅j⁆)
            j = j + 1
        }
    }
    return result
}

class Solution {
    micro mergeTwoLists(self, list1: ArrayList<i64>, list2: ArrayList<i64>): ArrayList<i64>? {
        return mergeTwoLists(list1, list2)
    }
}
