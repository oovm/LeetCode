namespace leetcode.find_anagram_mappings;

using std.collection;

# 先为 nums2 建「值 -> 下标」表，再按 nums1 逐值查表输出。
[export(case: "camelCase")]
micro anagramMappings(nums1: ArrayList<i64>, nums2: ArrayList<i64>) -> ArrayList<i64> {
    let mut pos: HashMap<i64, i64> = HashMap::new(0)
    let mut index: usize = 0
    while index < nums2.length() {
        pos.insert(nums2⁅index⁆, index as i64)
        index = index + 1
    }
    let mut answer: ArrayList<i64> = ArrayList::new(nums1.length())
    loop value in nums1 {
        answer.push(pos.get(value).unwrap())
    }
    return answer
}

class Solution {
    micro anagramMappings(self, nums1: ArrayList<i64>, nums2: ArrayList<i64>): ArrayList<i64> {
        return anagramMappings(nums1, nums2)
    }
}
