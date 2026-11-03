namespace leetcode.minimum_impossible_or;

# 任何 2 的幂只能由「恰好等于它的元素」经 OR 得到，故答案是缺失的最小 2 的幂。
[export(name: "minImpossibleOR")]
micro min_impossible_o_r(nums: ArrayList<i64>) -> i64 {
    let mut present: HashMap<i64, i64> = HashMap::new(0)
    loop x in nums {
        present.insert(x, 1)
    }
    let mut bit: i64 = 0
    while bit < 32 {
        let value: i64 = 1 << bit
        if !present.contains_key(value) {
            return value
        }
        bit = bit + 1
    }
    return 4294967296
}

class Solution {
    micro minImpossibleOR(self, nums: ArrayList<i64>): i64 {
        return min_impossible_o_r(nums)
    }
}
