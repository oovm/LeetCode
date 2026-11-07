namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 先把每个长方体三边归一化，再用自定义记录 `Cuboid` 的字典序排序，
# 之后按「三维都不超过」做最长上升栈 DP。排序不传比较器，序关系挂在类型上。
structure Cuboid {
    a: i64
    b: i64
    c: i64
}

# `Comparable: Equal` 是硬性前置：超 trait 的 evidence 是 fail-closed，不自动派生。
imply Cuboid: std::operator::Equal {
    infix `==`(self, other: Cuboid): bool {
        if self.a != other.a {
            return false
        }
        if self.b != other.b {
            return false
        }
        return self.c == other.c
    }

    infix `!=`(self, other: Cuboid): bool {
        return !(self == other)
    }
}

# 顺序合同：按三边字典序升序。
imply Cuboid: std::operator::Comparable {
    micro compare(self, other: Self): Ordering {
        if self.a < other.a {
            return Less
        }
        if other.a < self.a {
            return Greater
        }
        if self.b < other.b {
            return Less
        }
        if other.b < self.b {
            return Greater
        }
        if self.c < other.c {
            return Less
        }
        if other.c < self.c {
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

# 三边排序后最小的作宽、最大的作高，中间值作深。
micro normalize(row: ArrayList<i64>) -> Cuboid {
    let mut a: i64 = row⁅0⁆
    let mut b: i64 = row⁅1⁆
    let mut c: i64 = row⁅2⁆
    if a > b {
        let tmp: i64 = a
        a = b
        b = tmp
    }
    if b > c {
        let tmp: i64 = b
        b = c
        c = tmp
    }
    if a > b {
        let tmp: i64 = a
        a = b
        b = tmp
    }
    return Cuboid { a: a, b: b, c: c }
}

class Solution {
    [export(case: "camelCase")]
    micro maxHeight(cuboids: ArrayList<ArrayList<i64>>) -> i64 {
        let mut rows: ArrayList<Cuboid> = ArrayList::new(cuboids.length())
        loop row in cuboids {
            rows.push(normalize(row))
        }
        order_items(rows)

        let mut heights: ArrayList<i64> = ArrayList::new(rows.length())
        let mut best: i64 = 0
        let mut index: usize = 0
        while index < rows.length() {
            let current: Cuboid = rows⁅index⁆
            let mut height: i64 = current.c
            let mut below: usize = 0
            while below < index {
                let base: Cuboid = rows⁅below⁆
                if base.a <= current.a && base.b <= current.b && base.c <= current.c {
                    let candidate: i64 = heights⁅below⁆ + current.c
                    if candidate > height {
                        height = candidate
                    }
                }
                below = below + 1
            }
            heights.push(height)
            if height > best {
                best = height
            }
            index = index + 1
        }
        return best
    }
}
