namespace leetcode.relative_sort_array;

using std.collection;

# 频次统计后按 arr2 的次序成块输出，剩余值按数值升序收尾。
# 题内触发点: G11 —— 没有返回新序列的 `sorted_by`，剩余值只能自建副本再 `merge_sort`（就地）。
# 题内触发点: G12 —— `HashSet::new()` 无容量构造。
micro compare_i64(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

[export(case: "camelCase")]
micro relative_sort_array(arr1: ArrayList<i64>, arr2: ArrayList<i64>) -> ArrayList<i64> {
    let total: usize = arr1.length()
    let mut freq: HashMap<i64, i64> = HashMap::new(total)
    loop value in arr1 {
        if freq.contains_key(value) {
            freq.insert(value, freq.get(value).unwrap() + 1)
        } else {
            freq.insert(value, 1)
        }
    }

    let mut result: ArrayList<i64> = ArrayList::new(total)
    let mut ranked: HashSet<i64> = HashSet::new()
    loop value in arr2 {
        ranked.insert(value)
        if freq.contains_key(value) {
            let times: i64 = freq.get(value).unwrap()
            let mut copy: i64 = 0
            while copy < times {
                result.push(value)
                copy = copy + 1
            }
        }
    }

    # 未在 arr2 出现的值：升序收尾（副本只装剩余值，直接就地排）。
    let mut leftover: ArrayList<i64> = ArrayList::new(arr1.length())
    loop value in freq.keys() {
        if !ranked.contains(value) {
            leftover.push(value)
        }
    }
    merge_sort(leftover, compare_i64)
    let mut index: usize = 0
    while index < leftover.length() {
        let value: i64 = leftover⁅index⁆
        let times: i64 = freq.get(value).unwrap()
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
    micro relativeSortArray(self, arr1: ArrayList<i64>, arr2: ArrayList<i64>): ArrayList<i64> {
        return relative_sort_array(arr1, arr2)
    }
}
