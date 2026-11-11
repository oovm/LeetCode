namespace leetcode.form_smallest_number_from_two_digit_arrays;

using std.collection;

# 有公共数字取最小公共值；否则用两数组最小值拼两位取较优方向。
[export(case: "camelCase")]
micro minNumber(nums1: [i64], nums2: [i64]) -> i64 {
    let mut set1: HashSet<i64> = HashSet::new()
    loop value in nums1 {
        set1.insert(value)
    }
    let mut commonMin: i64 = 10
    loop value in nums2 {
        if set1.contains(value) && value < commonMin {
            commonMin = value
        }
    }
    if commonMin < 10 {
        return commonMin
    }
    let mut min1: i64 = 10
    loop value in nums1 {
        if value < min1 {
            min1 = value
        }
    }
    let mut min2: i64 = 10
    loop value in nums2 {
        if value < min2 {
            min2 = value
        }
    }
    let forward: i64 = 10 * min1 + min2
    let backward: i64 = 10 * min2 + min1
    if forward < backward {
        return forward
    }
    return backward
}

class Solution {
    micro minNumber(self, nums1: [i64], nums2: [i64]): i64 {
        return minNumber(nums1, nums2)
    }
}
