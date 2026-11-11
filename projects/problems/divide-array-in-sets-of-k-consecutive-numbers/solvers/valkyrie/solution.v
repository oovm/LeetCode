namespace leetcode.divide_array_in_sets_of_k_consecutive_numbers;

using std.collection;

# 升序扫描：每遇到仍有余量的最小值，就连续消耗 k 个相邻值，消耗不到即失败。
[export(case: "camelCase")]
micro isPossibleDivide(nums: [i64], k: i64) -> bool {
    if nums.length() as i64 % k != 0 {
        return false
    }

    let mut counts: HashMap<i64, i64> = HashMap::new(nums.length())
    loop value in nums {
        let mut next: i64 = 1
        if counts.contains_key(value) {
            next = counts.get(value).unwrap() + 1
        }
        counts.insert(value, next)
    }

    let mut ordered: ArrayList<i64> = ArrayList::new(nums.length())
    loop value in nums {
        ordered.push(value)
    }
    sort(ordered)

    let mut i: usize = 0
    while i < ordered.length() {
        let value: i64 = ordered⁅i⁆
        if counts.get(value).unwrap() > 0 {
            let mut step: i64 = 0
            while step < k {
                let target: i64 = value + step
                if counts.contains_key(target) == false {
                    return false
                }
                let amount: i64 = counts.get(target).unwrap()
                if amount == 0 {
                    return false
                }
                counts.insert(target, amount - 1)
                step = step + 1
            }
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro isPossibleDivide(self, nums: [i64], k: i64): bool {
        return isPossibleDivide(nums, k)
    }
}
