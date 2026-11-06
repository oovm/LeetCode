namespace leetcode.two_out_of_three;

using std.collection;

# 三个集合并集后按 1..100 升序输出出现在至少两个集合中的数值。
[export(case: "camelCase")]
micro twoOutOfThree(nums1: ArrayList<i64>, nums2: ArrayList<i64>, nums3: ArrayList<i64>) -> ArrayList<i64> {
    let mut first: HashSet<i64> = HashSet::new()
    let mut index: usize = 0
    while index < nums1.length() {
        first.insert(nums1⁅index⁆)
        index = index + 1
    }
    let mut second: HashSet<i64> = HashSet::new()
    index = 0
    while index < nums2.length() {
        second.insert(nums2⁅index⁆)
        index = index + 1
    }
    let mut third: HashSet<i64> = HashSet::new()
    index = 0
    while index < nums3.length() {
        third.insert(nums3⁅index⁆)
        index = index + 1
    }
    let mut answer: ArrayList<i64> = ArrayList::new(100)
    let mut value: i64 = 1
    while value <= 100 {
        let mut present: i64 = 0
        if first.contains(value) {
            present = present + 1
        }
        if second.contains(value) {
            present = present + 1
        }
        if third.contains(value) {
            present = present + 1
        }
        if present > 1 {
            answer.push(value)
        }
        value = value + 1
    }
    return answer
}

class Solution {
    micro twoOutOfThree(self, nums1: ArrayList<i64>, nums2: ArrayList<i64>, nums3: ArrayList<i64>): ArrayList<i64> {
        return twoOutOfThree(nums1, nums2, nums3)
    }
}
