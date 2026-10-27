namespace leetcode.intersection_of_two_arrays;

class Solution {
    micro intersection(self, nums1: ArrayList<i64>, nums2: ArrayList<i64>): ArrayList<i64> {
        let mut set1: HashMap<i64, bool> = HashMap::new(nums1.length())
        let mut i: usize = 1
        while i <= nums1.length() {
            set1.insert(nums1⁅i⁆.unwrap(), true)
            i = i + 1
        }
        let mut result: ArrayList<i64> = ArrayList::new(0)
        let mut seen: HashMap<i64, bool> = HashMap::new(nums2.length())
        i = 1
        while i <= nums2.length() {
            let val: i64 = nums2⁅i⁆.unwrap()
            if set1.contains_key(val) && !seen.contains_key(val) {
                seen.insert(val, true)
                result.push(val)
            }
            i = i + 1
        }
        return result
    }
}
