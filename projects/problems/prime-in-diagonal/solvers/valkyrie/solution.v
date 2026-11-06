namespace leetcode.prime_in_diagonal;

using std.collection;

micro isPrime(value: i64) -> bool {
    if value < 2 {
        return false
    }
    let mut divisor: i64 = 2
    while divisor * divisor <= value {
        if value % divisor == 0 {
            return false
        }
        divisor = divisor + 1
    }
    return true
}

# 扫主、副两条对角线，记录其中的最大素数。
[export(case: "camelCase")]
micro diagonalPrime(nums: ArrayList<ArrayList<i64>>) -> i64 {
    let size: usize = nums.length()
    let mut best: i64 = 0
    let mut index: usize = 0
    while index < size {
        let main_value: i64 = nums⁅index⁆⁅index⁆
        if isPrime(main_value) {
            if main_value > best {
                best = main_value
            }
        }
        let anti_index: usize = size - 1 - index
        let anti_value: i64 = nums⁅index⁆⁅anti_index⁆
        if isPrime(anti_value) {
            if anti_value > best {
                best = anti_value
            }
        }
        index = index + 1
    }
    return best
}

class Solution {
    micro diagonalPrime(self, nums: ArrayList<ArrayList<i64>>): i64 {
        return diagonalPrime(nums)
    }
}
