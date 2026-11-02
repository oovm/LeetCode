namespace leetcode.next_greater_element_i;

[export(case: "camelCase")]
micro next_greater_element(nums1: ArrayList<i64>, nums2: ArrayList<i64>) -> ArrayList<i64> {
    let n2: usize = nums2.length()
    let n1: usize = nums1.length()
    let mut stack: ArrayList<i64> = ArrayList::new(n2)
    let mut keys: ArrayList<i64> = ArrayList::new(n2)
    let mut values: ArrayList<i64> = ArrayList::new(n2)
    let mut j: usize = n2
    while j > 0 {
        j = j - 1
        let x: i64 = nums2⁅j⁆.unwrap()
        while stack.length() > 0 && stack⁅stack.length() - 1⁆.unwrap() < x {
            stack.pop()
        }
        if stack.length() > 0 {
            keys.push(x)
            values.push(stack⁅stack.length() - 1⁆.unwrap())
        }
        stack.push(x)
    }
    let mut result: ArrayList<i64> = ArrayList::new(n1)
    let mut i: usize = 0
    while i < n1 {
        let x: i64 = nums1⁅i⁆.unwrap()
        let mut found: i64 = -1
        let mut k: usize = 0
        while k < keys.length() {
            if keys⁅k⁆.unwrap() == x {
                found = values⁅k⁆.unwrap()
                k = keys.length()
            } else {
                k = k + 1
            }
        }
        result.push(found)
        i = i + 1
    }
    return result
}

class Solution {
    micro nextGreaterElement(self, nums1: ArrayList<i64>, nums2: ArrayList<i64>): ArrayList<i64> {
        return next_greater_element(nums1, nums2)
    }
}
