namespace leetcode.maximum_xor_of_two_numbers_in_an_array;

# 从高位开始逐位确定答案：前缀哈希判定该位能否取 1。
[export(name: "findMaximumXOR")]
micro find_maximum_x_o_r(nums: ArrayList<i64>) -> i64 {
    let mut best: i64 = 0
    let mut mask: i64 = 0
    let mut bit: i64 = 30
    while bit >= 0 {
        mask = mask | (1 << bit)
        let mut prefixes: HashMap<i64, i64> = HashMap::new(nums.length())
        let mut loop_index_12: usize = 0
        while loop_index_12 < nums.length() {
            let x: i64 = nums⁅loop_index_12⁆
                prefixes.insert(x & mask, 1)
            loop_index_12 = loop_index_12 + 1
        }
        let candidate: i64 = best | (1 << bit)
        let mut loop_index_16: usize = 0
        while loop_index_16 < nums.length() {
            let x: i64 = nums⁅loop_index_16⁆
                let prefix: i64 = x & mask
                if prefixes.contains_key(candidate ^ prefix) {
                    best = candidate
                }
            loop_index_16 = loop_index_16 + 1
        }
        bit = bit - 1
    }
    return best
}

class Solution {
    micro findMaximumXOR(self, nums: ArrayList<i64>): i64 {
        return find_maximum_x_o_r(nums)
    }
}
