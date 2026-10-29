namespace leetcode.contains_duplicate;

[export(case: "camelCase")]
micro contains_duplicate(nums: ArrayList<i64>) -> bool {
    let mut seen: HashSet<i64> = HashSet::new()
    loop x in nums {
        if seen.contains(x) {
            return true
        }
        seen.insert(x)
    }
    return false
}

class Solution {
    micro containsDuplicate(self, nums: ArrayList<i64>): bool {
        return contains_duplicate(nums)
    }
}
