namespace leetcode.find_anagram_mappings;

using std.collection;

# 先为 nums2 建「值 -> 下标」表（重复值取最后写入的下标），再按 nums1 逐值查表输出。
# LC 760 允许「任意合法映射」，本用例按 `validator-required` 校验
# `nums2[mapping[i]] == nums1[i]`，不绑定某个具体贪心。
[export(case: "camelCase")]
micro anagramMappings(nums1: [i64], nums2: [i64]) -> [i64] {
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
    return answer.to_array()
}

class Solution {
    micro anagramMappings(self, nums1: [i64], nums2: [i64]): [i64] {
        return anagramMappings(nums1, nums2)
    }
}
