namespace leetcode.count_elements_with_maximum_frequency;

using std.collection;

# MultiSet 直接承载频次：`distinct_elements` 给出键集，`count` 取每键频次；
# 最大频次对应元素的总贡献 = 最大频次 × 达到该频次的键数。
[export(case: "camelCase")]
micro max_frequency_elements(nums: [i64]) -> i64 {
    let mut counts: MultiSet<i64> = MultiSet::new()
    let mut inserted: usize = 0
    loop value in nums {
        inserted = counts.insert(value)
    }

    let distinct: ArrayList<i64> = counts.distinct_elements()
    let mut best: usize = 0
    loop value in distinct {
        let frequency: usize = counts.count(value)
        if frequency > best {
            best = frequency
        }
    }

    let mut total: i64 = 0
    loop value in distinct {
        if counts.count(value) == best {
            total = total + best as i64
        }
    }
    return total
}

class Solution {
    micro maxFrequencyElements(self, nums: [i64]): i64 {
        return max_frequency_elements(nums)
    }
}
