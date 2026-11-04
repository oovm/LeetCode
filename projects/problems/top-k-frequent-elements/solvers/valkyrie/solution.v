namespace leetcode.top_k_frequent_elements;

using std.collection;

# 频次桶排序：桶下标即频次，桶内按首次出现顺序，最后从高频桶向低频桶取满 k 个。
# 题内触发点: G12 —— `HashSet::new()` 无容量构造，去重集合只能空构造。
# 题内触发点: G3 —— 返回 `ArrayList<i64>` 依赖 wasm glue 的聚合返回值 bridge。
[export(case: "camelCase")]
micro top_k_frequent(nums: ArrayList<i64>, k: i64) -> ArrayList<i64> {
    let count: usize = nums.length()
    let mut freq: HashMap<i64, i64> = HashMap::new(count)
    let mut i: usize = 0
    while i < count {
        let value: i64 = nums⁅i⁆
        if freq.contains_key(value) {
            freq.insert(value, freq.get(value).unwrap() + 1)
        } else {
            freq.insert(value, 1)
        }
        i = i + 1
    }

    # 桶数 = 最长可能频次 + 1（频次不会超过元素个数）。
    let mut buckets: ArrayList<ArrayList<i64>> = ArrayList::new(count + 1)
    let mut slot: usize = 0
    while slot <= count {
        let fresh: ArrayList<i64> = ArrayList::new(0)
        buckets.push(fresh)
        slot = slot + 1
    }

    # 按 nums 顺序回填：HashMap 的 keys() 不保证首次出现顺序，这里显式去重保序。
    let mut seen: HashSet<i64> = HashSet::new()
    i = 0
    while i < count {
        let value: i64 = nums⁅i⁆
        if !seen.contains(value) {
            seen.insert(value)
            let times: i64 = freq.get(value).unwrap()
            let mut bucket: ArrayList<i64> = buckets⁅times as usize⁆
            bucket.push(value)
        }
        i = i + 1
    }

    let mut result: ArrayList<i64> = ArrayList::new(k as usize)
    let mut level: usize = count
    while level > 0 && result.length() < k as usize {
        let bucket: ArrayList<i64> = buckets⁅level⁆
        let mut index: usize = 0
        while index < bucket.length() && result.length() < k as usize {
            result.push(bucket⁅index⁆)
            index = index + 1
        }
        level = level - 1
    }
    return result
}

class Solution {
    micro topKFrequent(self, nums: ArrayList<i64>, k: i64): ArrayList<i64> {
        return top_k_frequent(nums, k)
    }
}
