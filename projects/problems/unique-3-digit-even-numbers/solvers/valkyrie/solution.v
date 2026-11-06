namespace leetcode.unique_3_digit_even_numbers;

using std.collection;

# 三重下标枚举三位偶数，用哈希表对数值去重后计数。
[export(case: "camelCase")]
micro totalNumbers(digits: ArrayList<i64>) -> i64 {
    let mut seen: HashMap<i64, i64> = HashMap::new(0)
    let mut total: i64 = 0
    let count: usize = digits.length()
    let mut i: usize = 0
    while i < count {
        if digits⁅i⁆ != 0 {
            let mut j: usize = 0
            while j < count {
                if j != i {
                    let mut k: usize = 0
                    while k < count {
                        if k != i && k != j {
                            let last: i64 = digits⁅k⁆
                            if last % 2 == 0 {
                                let code: i64 = digits⁅i⁆ * 100 + digits⁅j⁆ * 10 + last
                                if !seen.contains_key(code) {
                                    seen.insert(code, 1)
                                    total = total + 1
                                }
                            }
                        }
                        k = k + 1
                    }
                }
                j = j + 1
            }
        }
        i = i + 1
    }
    return total
}

class Solution {
    micro totalNumbers(self, digits: ArrayList<i64>): i64 {
        return totalNumbers(digits)
    }
}
