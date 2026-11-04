namespace leetcode.palindrome_linked_list;

# 值数组的双指针：左右两端同时向中间收拢。
[export(case: "camelCase")]
micro isPalindrome(head: ArrayList<i64>) -> bool {
    let mut left: usize = 0
    let mut right: usize = head.length()
    while right > 0 {
        right = right - 1
        if left >= right {
            return true
        }
        if head⁅left⁆ != head⁅right⁆ {
            return false
        }
        left = left + 1
    }
    return true
}

class Solution {
    micro isPalindrome(self, head: ArrayList<i64>): bool {
        return isPalindrome(head)
    }
}
