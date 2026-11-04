namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 先把每个长方体三边归一化，再用自定义记录 `Cuboid` 的字典序排序，
# 之后按「三维都不超过」做最长上升栈 DP。排序不传比较器，序关系挂在类型上。
structure Cuboid {
    a: i64
    b: i64
    c: i64
}

# [提案] `std.operator::Comparable` 尚不存在（今日只有 `Equal` / `Identical` / `Ordinal` / `Cardinal`）。
imply Cuboid: std::operator::Comparable {
    infix `<`(self, other: Cuboid): bool {
        if self.a != other.a {
            return self.a < other.a
        }
        if self.b != other.b {
            return self.b < other.b
        }
        return self.c < other.c
    }
}

# [提案] 按 `Comparable` 合同的单参排序；现有 `sort.v` 的 7 个入口全部要求显式 `cmp`。
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
    [export(case: "maxHeight")]
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
