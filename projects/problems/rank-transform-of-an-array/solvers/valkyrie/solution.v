namespace leetcode.rank_transform_of_an_array;

using std.collection;

# 先去重（`BTreeSet`）再按升序物化（`to_list`），值到名次一次建表，最后按原序回填。
# 题内触发点: G16 —— `BTreeSet` 没有 `nth` / `rank`，按秩取元素只能 `to_list()` 后下标访问。
# 题内触发点: G12 —— `BTreeSet::new()` 与 `HashSet::new()` 一样没有容量构造。
[export(case: "camelCase")]
micro array_rank_transform(arr: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = arr.length()
    let mut distinct: BTreeSet<i64> = BTreeSet::new()
    loop value in arr {
        distinct.insert(value)
    }
    let ordered: ArrayList<i64> = distinct.to_list()

    let mut rank_of: HashMap<i64, i64> = HashMap::new(ordered.length())
    let mut index: usize = 0
    while index < ordered.length() {
        rank_of.insert(ordered⁅index⁆, (index as i64) + 1)
        index = index + 1
    }

    let mut result: ArrayList<i64> = ArrayList::new(count)
    loop value in arr {
        result.push(rank_of.get(value).unwrap())
    }
    return result
}

class Solution {
    micro arrayRankTransform(self, arr: ArrayList<i64>): ArrayList<i64> {
        return array_rank_transform(arr)
    }
}
