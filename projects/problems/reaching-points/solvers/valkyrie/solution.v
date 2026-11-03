namespace leetcode.reaching_points;

# 反向化简：大者对小者取模；一边已对齐起点时检查差是否为另一边倍数。
[export(case: "camelCase")]
micro reaching_points(sx: i64, sy: i64, tx: i64, ty: i64) -> bool {
    let mut x: i64 = tx
    let mut y: i64 = ty
    while x >= sx && y >= sy {
        if x == sx && y == sy {
            return true
        }
        if x > y {
            if y == sy {
                return (x - sx) % y == 0
            }
            x = x % y
        } else {
            if x == sx {
                return (y - sy) % x == 0
            }
            y = y % x
        }
    }
    return false
}

class Solution {
    micro reachingPoints(self, sx: i64, sy: i64, tx: i64, ty: i64): bool {
        return reaching_points(sx, sy, tx, ty)
    }
}
