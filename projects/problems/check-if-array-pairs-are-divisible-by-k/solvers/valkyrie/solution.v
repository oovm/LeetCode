namespace leetcode.check_if_array_pairs_are_divisible_by_k;

using std.collection;

# 余数配对：余数 0 的个数须为偶数，余数 k/2（k 为偶数时）的个数须为偶数，
# 其余余数 r 的个数必须与 k-r 的个数相等。
[export(case: "camelCase")]
micro canArrange(arr: ArrayList<i64>, k: i64) -> bool {
    let mut counts: HashMap<i64, i64> = HashMap::new(arr.length())
    loop value in arr {
        let mut remainder: i64 = value % k
        if remainder < 0 {
            remainder = remainder + k
        }
        let mut next: i64 = 1
        if counts.contains_key(remainder) {
            next = counts.get(remainder).unwrap() + 1
        }
        counts.insert(remainder, next)
    }

    let keys: ArrayList<i64> = counts.keys()
    let mut i: usize = 0
    while i < keys.length() {
        let remainder: i64 = keys⁅i⁆
        let amount: i64 = counts.get(remainder).unwrap()
        if remainder == 0 {
            if amount % 2 != 0 {
                return false
            }
        }
        else {
            if k % 2 == 0 && remainder * 2 == k {
                if amount % 2 != 0 {
                    return false
                }
            }
            else {
                if counts.contains_key(k - remainder) == false {
                    return false
                }
                if counts.get(k - remainder).unwrap() != amount {
                    return false
                }
            }
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro canArrange(self, arr: ArrayList<i64>, k: i64): bool {
        return canArrange(arr, k)
    }
}
