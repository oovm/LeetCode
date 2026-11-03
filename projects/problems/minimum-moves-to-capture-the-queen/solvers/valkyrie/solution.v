namespace leetcode.minimum_moves_to_capture_the_queen;

micro between(v: i64, lo: i64, hi: i64) -> bool {
    if lo > hi {
        return between(v, hi, lo)
    }
    return v > lo && v < hi
}

# 车一步：同行/列且主教不挡；主教一步：同对角线且车不挡。否则两步必达。
[export(case: "camelCase")]
micro min_moves_to_capture_the_queen(a: i64, b: i64, c: i64, d: i64, e: i64, f: i64) -> i64 {
    # 车 (a,b) → 后 (e,f)：同行/列且主教 (c,d) 不在路径中间。
    if a == e && !(d == f && between(c, a, e)) {
        return 1
    }
    if b == f && !(c == e && between(d, b, f)) {
        return 1
    }
    # 主教 (c,d) → 后 (e,f)：同对角线且车不在路径中间。
    let dx: i64 = c - e
    let dy: i64 = d - f
    let same_diag: bool = dx == dy || dx + dy == 0
    if same_diag {
        let rx: i64 = a - e
        let ry: i64 = b - f
        let rook_on_diag: bool = rx == ry || rx + ry == 0
        if !rook_on_diag || !between(a, c, e) {
            return 1
        }
    }
    return 2
}

class Solution {
    micro minMovesToCaptureTheQueen(self, a: i64, b: i64, c: i64, d: i64, e: i64, f: i64): i64 {
        return min_moves_to_capture_the_queen(a, b, c, d, e, f)
    }
}
