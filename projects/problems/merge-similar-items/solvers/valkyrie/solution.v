namespace leetcode.merge_similar_items;

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

# 两张表按价值累加进一张频次表，再 `keys()` 物化后升序输出。
# 题内触发点: G3 —— 入参与返回值都是 `ArrayList<ArrayList<i64>>`，命中嵌套聚合 bridge。
# 题内触发点: `HashMap.iterator` 回调无捕获，无法在遍历时向结果容器写入，只能用 `keys()`。
[export(case: "camelCase")]
micro merge_similar_items(items1: ArrayList<ArrayList<i64>>, items2: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let mut weight: HashMap<i64, i64> = HashMap::new(items1.length() + items2.length())
    loop item in items1 {
        let value: i64 = item⁅0⁆
        let amount: i64 = item⁅1⁆
        if weight.contains_key(value) {
            weight.insert(value, weight.get(value).unwrap() + amount)
        } else {
            weight.insert(value, amount)
        }
    }
    loop item in items2 {
        let value: i64 = item⁅0⁆
        let amount: i64 = item⁅1⁆
        if weight.contains_key(value) {
            weight.insert(value, weight.get(value).unwrap() + amount)
        } else {
            weight.insert(value, amount)
        }
    }

    let keys: ArrayList<i64> = weight.keys()
    let mut ordered: ArrayList<i64> = ArrayList::new(keys.length())
    loop value in keys {
        ordered.push(value)
    }
    merge_sort(ordered, compare_asc)

    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(ordered.length())
    let mut index: usize = 0
    while index < ordered.length() {
        let value: i64 = ordered⁅index⁆
        let mut row: ArrayList<i64> = ArrayList::new(2)
        row.push(value)
        row.push(weight.get(value).unwrap())
        result.push(row)
        index = index + 1
    }
    return result
}

class Solution {
    micro mergeSimilarItems(self, items1: ArrayList<ArrayList<i64>>, items2: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return merge_similar_items(items1, items2)
    }
}
