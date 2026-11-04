namespace leetcode.relative_ranks;

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

micro empty_text() -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(0)
    return builder.build()
}

# 前三名用固定文本，其余按名次拼十进制。
# 题内触发点: G3 —— 返回 `ArrayList<utf8>` 依赖聚合返回值 bridge。
# 题内触发点: 比较器不能捕获 `score`，名次与原下标只能编码进同一个 i64。
micro rank_text(position: i64) -> utf8 {
    let gold: utf8 = "Gold Medal"
    let silver: utf8 = "Silver Medal"
    let bronze: utf8 = "Bronze Medal"
    if position == 0 {
        return gold
    }
    if position == 1 {
        return silver
    }
    if position == 2 {
        return bronze
    }

    let mut builder: Utf8Builder = Utf8Builder::new(8)
    builder.append_i64(position + 1)
    return builder.build()
}

[export(case: "camelCase")]
micro find_relative_ranks(score: ArrayList<i64>) -> ArrayList<utf8> {
    let count: usize = score.length()
    let mut encoded: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        # 分数非负且不超过 10^6，下标上限 10^4，低位 6 位十进制足够承载原下标。
        encoded.push(score⁅index⁆ * 100000 + (index as i64))
        index = index + 1
    }
    merge_sort(encoded, compare_desc)

    let mut result: ArrayList<utf8> = ArrayList::new(count)
    index = 0
    while index < count {
        result.push(empty_text())
        index = index + 1
    }

    let mut order: usize = 0
    while order < count {
        let key: i64 = encoded⁅order⁆
        let slot: usize = (key % 100000) as usize
        result⁅slot⁆ = rank_text(order as i64)
        order = order + 1
    }
    return result
}

class Solution {
    micro findRelativeRanks(self, score: ArrayList<i64>): ArrayList<utf8> {
        return find_relative_ranks(score)
    }
}
