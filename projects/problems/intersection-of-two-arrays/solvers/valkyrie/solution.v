namespace leetcode.intersection_of_two_arrays;

[export(case: "camelCase")]
micro intersection(nums1: ArrayList<i64>, nums2: ArrayList<i64>) -> ArrayList<i64> {
    let mut set2: HashMap<i64, bool> = HashMap::new(nums2.length())
    let mut i: usize = 0
    while i < nums2.length() {
        set2.insert(nums2⁅i⁆.unwrap(), true)
        i = i + 1
    }
    let mut result: ArrayList<i64> = ArrayList::new(0)
    let mut seen: HashMap<i64, bool> = HashMap::new(nums1.length())
    i = 0
    while i < nums1.length() {
        let val: i64 = nums1⁅i⁆.unwrap()
        if set2.contains_key(val) && !seen.contains_key(val) {
            seen.insert(val, true)
            result.push(val)
        }
        i = i + 1
    }
    return result
}

class Solution {
    micro intersection(self, nums1: ArrayList<i64>, nums2: ArrayList<i64>): ArrayList<i64> {
        return intersection(nums1, nums2)
    }
}
