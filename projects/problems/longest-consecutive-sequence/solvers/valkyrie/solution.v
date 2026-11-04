namespace leetcode.longest_consecutive_sequence;

# 集合 O(1) 判定；只从段首（前驱不在集合中）起算，整段只走一遍。
[export(case: "camelCase")]
micro longest_consecutive(nums: ArrayList<i64>) -> i64 {
    let mut present: HashSet<i64> = HashSet::new()
    loop value in nums {
        present.insert(value)
    }

    let mut longest: i64 = 0
    loop value in nums {
        if present.contains(value) && !present.contains(value - 1) {
            let mut current: i64 = value
            let mut run: i64 = 0
            while present.contains(current) {
                run = run + 1
                current = current + 1
            }
            if run > longest {
                longest = run
            }
        }
    }
    return longest
}

class Solution {
    micro longestConsecutive(self, nums: ArrayList<i64>): i64 {
        return longest_consecutive(nums)
    }
}
