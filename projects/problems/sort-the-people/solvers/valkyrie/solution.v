namespace leetcode.sort_the_people;

using std.collection;

micro compare_desc(a: i64, b: i64) -> i32 {
    if a > b {
        return -1
    }
    if a < b {
        return 1
    }
    return 0
}

# 身高降序回填人名。比较器不能捕获 `names`，所以把「身高 + 原下标」编码进一个 i64，
# 排序后按低位解码回原下标。
# 题内触发点: G3 —— 返回 `ArrayList<utf8>` 依赖聚合返回值 bridge。
# 题内触发点: G11 —— 编码键集自建副本后 `merge_sort`（就地）。
[export(case: "camelCase")]
micro sort_people(names: ArrayList<utf8>, heights: ArrayList<i64>) -> ArrayList<utf8> {
    let count: usize = names.length()
    let mut encoded: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        # 身高上限 10^9，下标上限 10^3，低位 6 位十进制足够承载原下标。
        encoded.push(heights⁅index⁆ * 1000000 + (index as i64))
        index = index + 1
    }
    merge_sort(encoded, compare_desc)

    let mut result: ArrayList<utf8> = ArrayList::new(count)
    let mut order: usize = 0
    while order < count {
        let key: i64 = encoded⁅order⁆
        let slot: usize = (key % 1000000) as usize
        result.push(names⁅slot⁆)
        order = order + 1
    }
    return result
}

class Solution {
    micro sortPeople(self, names: ArrayList<utf8>, heights: ArrayList<i64>): ArrayList<utf8> {
        return sort_people(names, heights)
    }
}
