namespace leetcode.largest_sum_of_averages;

using std.collection;

# 后缀分组 DP：dp[i] 表示从 i 起把剩余元素分成 groups 组的最大平均值和。
# 转移 dp[i] = max(avg(i, j) + dp[j])，与参考实现的求和次序一致，O(k n²) 时间、O(n) 空间。
[export(case: "camelCase")]
micro largest_sum_of_averages(nums: ArrayList<i64>, k: i64) -> f64 {
    let n: i64 = nums.length() as i64
    let mut prefix: ArrayList<i64> = ArrayList::new((n + 1) as usize)
    loop _zero in 0..(n + 1) as usize {
        prefix.push(0)
    }
    let mut index: i64 = 1
    while index <= n {
        prefix⁅index as usize⁆ = prefix⁅(index - 1) as usize⁆ + nums⁅(index - 1) as usize⁆
        index = index + 1
    }

    let mut dp: ArrayList<f64> = ArrayList::new(n as usize)
    let mut start: i64 = 0
    while start < n {
        dp.push((prefix⁅n as usize⁆ - prefix⁅start as usize⁆) as f64 / (n - start) as f64)
        start = start + 1
    }

    let mut groups: i64 = 2
    while groups <= k {
        let mut next: ArrayList<f64> = ArrayList::new(n as usize)
        loop _zero in 0..n as usize {
            next.push(0.0)
        }

        let mut head: i64 = 0
        while head < n {
            let mut split: i64 = head + 1
            while split < n {
                let average: f64 = (prefix⁅split as usize⁆ - prefix⁅head as usize⁆) as f64
                    / (split - head) as f64
                let candidate: f64 = average + dp⁅split as usize⁆
                if candidate > next⁅head as usize⁆ {
                    next⁅head as usize⁆ = candidate
                }
                split = split + 1
            }
            head = head + 1
        }

        dp = next
        groups = groups + 1
    }
    return dp⁅0⁆
}

class Solution {
    micro largestSumOfAverages(self, nums: ArrayList<i64>, k: i64): f64 {
        return largest_sum_of_averages(nums, k)
    }
}
