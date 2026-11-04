namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 箱型记录 `BoxType` 按单位价值升序排序，再从高位反向取值。
structure BoxType {
    boxes: i64
    units: i64
}

# [提案] 顺序合同缺失：单位价值升序、同价值箱数升序。
imply BoxType: std::operator::Comparable {
    infix `<`(self, other: BoxType): bool {
        if self.units != other.units {
            return self.units < other.units
        }
        return self.boxes < other.boxes
    }
}

# [提案] 单参排序依赖 `Comparable`；`sort.v` 现无此入口。
micro order_items<T>(items: ArrayList<T>): unit
    where T: Equal & Comparable
{
    sort(items)
}

class Solution {
    [export(case: "maximumUnits")]
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
