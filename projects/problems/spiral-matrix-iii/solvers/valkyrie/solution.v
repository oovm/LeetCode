namespace leetcode.spiral_matrix_iii;

using std.collection;

# 从起点开始按 1,1,2,2,3,3… 的步长绕行，越界的点丢弃，只把界内点收进结果。
# 题内触发点: 嵌套容器构造 —— 结果按 `rows * cols` 精确预分配，每个坐标行 `new(2)`。
# 题内触发点: 不依赖 `Array<T>`，全程只走 `ArrayList` 的行容器（G11 的边界未命中）。
[export(case: "camelCase")]
micro spiral_matrix_iii(rows: i64, cols: i64, rStart: i64, cStart: i64) -> ArrayList<ArrayList<i64>> {
    let total: i64 = rows * cols
    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(total as usize)
    let mut origin: ArrayList<i64> = ArrayList::new(2)
    origin.push(rStart)
    origin.push(cStart)
    result.push(origin)

    let mut direction: i64 = 0
    let mut moves: i64 = 1
    while (result.length() as i64) < total {
        let mut turn: i64 = 0
        while turn < 2 {
            let mut step: i64 = 0
            while step < moves {
                if direction == 0 {
                    cStart = cStart + 1
                }
                if direction == 1 {
                    rStart = rStart + 1
                }
                if direction == 2 {
                    cStart = cStart - 1
                }
                if direction == 3 {
                    rStart = rStart - 1
                }
                if rStart >= 0 && rStart < rows && cStart >= 0 && cStart < cols {
                    if (result.length() as i64) < total {
                        let mut point: ArrayList<i64> = ArrayList::new(2)
                        point.push(rStart)
                        point.push(cStart)
                        result.push(point)
                    }
                }
                step = step + 1
            }
            direction = (direction + 1) % 4
            turn = turn + 1
        }
        moves = moves + 1
    }
    return result
}

class Solution {
    micro spiralMatrixIII(self, rows: i64, cols: i64, rStart: i64, cStart: i64): ArrayList<ArrayList<i64>> {
        return spiral_matrix_iii(rows, cols, rStart, cStart)
    }
}
