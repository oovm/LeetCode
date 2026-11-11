namespace leetcode.k_diff_pairs_in_an_array;

using std.collection;

# 去重后按值有序（BTreeSet），`k > 0` 用双指针数差为 k 的值对，`k == 0` 数频次 ≥ 2 的值。
# 题内触发点: G12 —— `BTreeSet::new()` 与 `HashSet::new()` 同样没有容量构造。
# 题内触发点: G16 —— `BTreeSet` 没有 `nth` / `rank`，按秩取元素只能 `to_list()` 后下标访问。
[export(case: "camelCase")]
micro find_pairs(nums: [i64], k: i64) -> i64 {
    let count: usize = nums.length()
    let mut freq: HashMap<i64, i64> = HashMap::new(count)
    let mut distinct: BTreeSet<i64> = BTreeSet::new()
    loop value in nums {
        distinct.insert(value)
        if freq.contains_key(value) {
            freq.insert(value, freq.get(value).unwrap() + 1)
        } else {
            freq.insert(value, 1)
        }
    }

    let ordered: ArrayList<i64> = distinct.to_list()
    let size: usize = ordered.length()
    let mut result: i64 = 0
    if k == 0 {
        let mut index: usize = 0
        while index < size {
            if freq.get(ordered⁅index⁆).unwrap() >= 2 {
                result = result + 1
            }
            index = index + 1
        }
    } else {
        let mut left: usize = 0
        let mut right: usize = 1
        while right < size {
            let difference: i64 = ordered⁅right⁆ - ordered⁅left⁆
            if difference == k {
                result = result + 1
                left = left + 1
                right = right + 1
            } else if difference < k {
                right = right + 1
            } else {
                left = left + 1
                if left == right {
                    right = right + 1
                }
            }
        }
    }
    return result
}

class Solution {
    micro findPairs(self, nums: [i64], k: i64): i64 {
        return find_pairs(nums, k)
    }
}
