namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 映射值记录 `Jumbled` 排序只依赖类型自身的序（映射值升序），
# 映射值相等时靠排序稳定性保持原下标次序，题解不传比较器、不编码「映射值 * 基数 + 下标」。
structure Jumbled {
    mapped: i64
    index: i64
}

# `Comparable: Equal` 是硬性前置：超 trait 的 evidence 是 fail-closed，不自动派生。
imply Jumbled: std::operator::Equal {
    infix `==`(self, other: Jumbled): bool {
        return self.mapped == other.mapped
    }

    infix `!=`(self, other: Jumbled): bool {
        return !(self == other)
    }
}

# 顺序合同：映射值升序。映射值相等视为同序，由排序稳定性保持原下标次序。
imply Jumbled: std::operator::Comparable {
    micro compare(self, other: Self): Ordering {
        if self.mapped < other.mapped {
            return Less
        }
        if other.mapped < self.mapped {
            return Greater
        }
        return Equal
    }
}

# `sort<T>(list) where T: Comparable` 已按类型合同派生比较器，单参入口直接取序。
micro order_items<T>(items: ArrayList<T>): unit
    where T: Equal & Comparable
{
    sort(items)
}

# 逐位过映射表后重新组装；`value` 为 0 时映射表首项即结果。
micro jumbled_value(value: i64, mapping: ArrayList<i64>) -> i64 {
    if value == 0 {
        return mapping⁅0⁆
    }
    let mut digits: ArrayList<i64> = ArrayList::new(10)
    let mut rest: i64 = value
    while rest > 0 {
        digits.push(rest % 10)
        rest = rest / 10
    }
    let mut result: i64 = 0
    let mut index: usize = digits.length()
    while index > 0 {
        index = index - 1
        result = result * 10 + mapping⁅digits⁅index⁆ as usize⁆
    }
    return result
}

class Solution {
    [export(case: "camelCase")]
    micro sortJumbled(mapping: ArrayList<i64>, nums: ArrayList<i64>) -> ArrayList<i64> {
        let mut entries: ArrayList<Jumbled> = ArrayList::new(nums.length())
        let mut index: usize = 0
        while index < nums.length() {
            entries.push(Jumbled { mapped: jumbled_value(nums⁅index⁆, mapping), index: index as i64 })
            index = index + 1
        }
        order_items(entries)

        let mut sorted: ArrayList<i64> = ArrayList::new(nums.length())
        loop entry in entries {
            sorted.push(nums⁅entry.index as usize⁆)
        }
        return sorted
    }
}
