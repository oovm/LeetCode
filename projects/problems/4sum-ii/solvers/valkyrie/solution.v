namespace leetcode.four_sum_ii;

using std.collection;

# 两两配对和：`nums1 × nums2` 的和入表，`nums3 × nums4` 的负和查表计数累加。
[export(case: "camelCase")]
micro fourSumCount(nums1: ArrayList<i64>, nums2: ArrayList<i64>, nums3: ArrayList<i64>, nums4: ArrayList<i64>) -> i64 {
    let mut count: HashMap<i64, i64> = HashMap::new(0)
    loop a in nums1 {
        loop b in nums2 {
            let s: i64 = a + b
            let mut prior: i64 = 0
            if count.contains_key(s) {
                prior = count.get(s).unwrap()
            }
            count.insert(s, prior + 1)
        }
    }
    let mut total: i64 = 0
    loop c in nums3 {
        loop d in nums4 {
            let target: i64 = 0 - c - d
            if count.contains_key(target) {
                total = total + count.get(target).unwrap()
            }
        }
    }
    return total
}

class Solution {
    micro fourSumCount(self, nums1: ArrayList<i64>, nums2: ArrayList<i64>, nums3: ArrayList<i64>, nums4: ArrayList<i64>): i64 {
        return fourSumCount(nums1, nums2, nums3, nums4)
    }
}
