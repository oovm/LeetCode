namespace leetcode.sort_array_by_increasing_frequency;

using std.collection;

micro compare_asc(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

# 频次升序、同频取值降序。比较器只能是具名函数（闭包不能捕获频次表），
# 因此把「频次 + 值」编码进一个 i64 再排序，排完解码回值。
# 题内触发点: G11 —— 编码后的键集仍需自建副本再 `merge_sort`（就地）。
# 题内触发点: `HashMap.iterator(f: micro(K, V) -> unit)` 的回调没有捕获，无法在遍历时
# 往结果容器 `push`，本批只能 `keys()` 物化后在外层循环处理（仍无可用调用点）。
[export(case: "camelCase")]
micro frequency_sort(nums: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = nums.length()
    let mut freq: HashMap<i64, i64> = HashMap::new(count)
    loop value in nums {
        if freq.contains_key(value) {
            freq.insert(value, freq.get(value).unwrap() + 1)
        } else {
            freq.insert(value, 1)
        }
    }

    # 值域 [-100, 100] 平移后落在 [0, 200]，编码位宽 201 足够区分同频的降序。
    let distinct: ArrayList<i64> = freq.keys()
    let mut encoded: ArrayList<i64> = ArrayList::new(distinct.length())
    loop value in distinct {
        let times: i64 = freq.get(value).unwrap()
        let weight: i64 = 200 - (value + 100)
        encoded.push(times * 201 + weight)
    }
    merge_sort(encoded, compare_asc)

    let mut result: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < encoded.length() {
        let key: i64 = encoded⁅index⁆
        let times: i64 = key / 201
        let value: i64 = (200 - (key % 201)) - 100
        let mut copy: i64 = 0
        while copy < times {
            result.push(value)
            copy = copy + 1
        }
        index = index + 1
    }
    return result
}

class Solution {
    micro frequencySort(self, nums: ArrayList<i64>): ArrayList<i64> {
        return frequency_sort(nums)
    }
}
