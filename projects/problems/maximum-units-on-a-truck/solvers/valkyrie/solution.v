namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 箱型记录 `BoxType` 按单位价值升序排序，再从高位反向取值。
structure BoxType {
    boxes: i64
    units: i64
}

# `Comparable: Equal` 是硬性前置：超 trait 的 evidence 是 fail-closed，不自动派生。
imply BoxType: std::operator::Equal {
    infix `==`(self, other: BoxType): bool {
        if self.units != other.units {
            return false
        }
        return self.boxes == other.boxes
    }

    infix `!=`(self, other: BoxType): bool {
        return !(self == other)
    }
}

# 顺序合同：单位价值升序、同价值箱数升序。
imply BoxType: std::operator::Comparable {
    micro compare(self, other: Self): Ordering {
        if self.units < other.units {
            return Less
        }
        if other.units < self.units {
            return Greater
        }
        if self.boxes < other.boxes {
            return Less
        }
        if other.boxes < self.boxes {
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

class Solution {
    [export(case: "camelCase")]
    micro maximumUnits(boxTypes: ArrayList<ArrayList<i64>>, truckSize: i64) -> i64 {
        let mut rows: ArrayList<BoxType> = ArrayList::new(boxTypes.length())
        loop row in boxTypes {
            rows.push(BoxType { boxes: row⁅0⁆, units: row⁅1⁆ })
        }
        order_items(rows)

        let mut remaining: i64 = truckSize
        let mut loaded: i64 = 0
        let mut index: usize = rows.length()
        while index > 0 {
            index = index - 1
            let row: BoxType = rows⁅index⁆
            if remaining > 0 {
                let mut take: i64 = row.boxes
                if take > remaining {
                    take = remaining
                }
                loaded = loaded + take * row.units
                remaining = remaining - take
            }
        }
        return loaded
    }
}
