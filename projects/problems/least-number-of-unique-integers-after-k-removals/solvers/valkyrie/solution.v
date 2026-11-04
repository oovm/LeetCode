namespace leetcode.least_number_of_unique_integers_after_k_removals;

using std.collection;

# 先统计每个值的频次，再把频次升序排序：优先整类删除频次最小的值，删除代价最小。
[export(case: "camelCase")]
micro findLeastNumOfUniqueInts(arr: ArrayList<i64>, k: i64) -> i64 {
    let mut counts: HashMap<i64, i64> = HashMap::new(arr.length())
    loop value in arr {
        let mut next: i64 = 1
        if counts.contains_key(value) {
            next = counts.get(value).unwrap() + 1
        }
        counts.insert(value, next)
    }

    let keys: ArrayList<i64> = counts.keys()
    let mut frequencies: ArrayList<i64> = ArrayList::new(keys.length())
    loop key in keys {
        frequencies.push(counts.get(key).unwrap())
    }
    sort(frequencies)

    let mut removed: i64 = 0
    let mut remaining: i64 = frequencies.length() as i64
    let mut stop: bool = false
    let mut i: usize = 0
    while i < frequencies.length() && stop == false {
        let frequency: i64 = frequencies⁅i⁆
        if removed + frequency <= k {
            removed = removed + frequency
            remaining = remaining - 1
            i = i + 1
        }
        else {
            stop = true
        }
    }
    return remaining
}

class Solution {
    micro findLeastNumOfUniqueInts(self, arr: ArrayList<i64>, k: i64): i64 {
        return findLeastNumOfUniqueInts(arr, k)
    }
}
