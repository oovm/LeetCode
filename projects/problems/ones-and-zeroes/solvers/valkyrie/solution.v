namespace leetcode.ones_and_zeroes;

using std.collection;

# 二维费用背包：dp[a][b] 为用 a 个 0、b 个 1 的最大串数；逐串降序转移。
micro count_zeros(word: utf8) -> i64 {
    let mut count: i64 = 0
    let mut i: usize = 0
    while i < word.length() {
        if word⁅i⁆ as u32 == 48 {
            count = count + 1
        }
        i = i + 1
    }
    return count
}

[export(case: "camelCase")]
micro findMaxForm(strs: ArrayList<utf8>, m: i64, n: i64) -> i64 {
    let mut dp: ArrayList<ArrayList<i64>> = ArrayList::new(m as usize + 1)
    let mut a: usize = 0
    while a <= m as usize {
        let mut row: ArrayList<i64> = ArrayList::new(n as usize + 1)
        let mut b: usize = 0
        while b <= n as usize {
            row.push(0)
            b = b + 1
        }
        dp.push(row)
        a = a + 1
    }
    loop word in strs {
        let zeros: usize = count_zeros(word) as usize
        let ones: usize = word.length() - zeros
        let mut i: usize = m as usize
        while i >= zeros {
            let mut j: usize = n as usize
            while j >= ones {
                let candidate: i64 = dp⁅i - zeros⁆⁅j - ones⁆ + 1
                if candidate > dp⁅i⁆⁅j⁆ {
                    dp⁅i⁆⁅j⁆ = candidate
                }
                if j == 0 {
                    break
                }
                j = j - 1
            }
            if i == 0 {
                break
            }
            i = i - 1
        }
    }
    return dp⁅m as usize⁆⁅n as usize⁆
}

class Solution {
    micro findMaxForm(self, strs: ArrayList<utf8>, m: i64, n: i64): i64 {
        return findMaxForm(strs, m, n)
    }
}
