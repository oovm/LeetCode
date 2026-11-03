namespace leetcode.minimum_recolors_to_get_k_consecutive_black_blocks;

[export(case: "camelCase")]
micro minimum_recolors(blocks: utf8, k: i64) -> i64 {
    let n: usize = blocks.length()
    let kk: usize = k as usize
    let mut whites: i64 = 0
    let mut i: usize = 0
    while i < kk {
        if blocks⁅i⁆ as u32 == 87 {
            whites = whites + 1
        }
        i = i + 1
    }
    let mut best: i64 = whites
    i = kk
    while i < n {
        if blocks⁅i⁆ as u32 == 87 {
            whites = whites + 1
        }
        let left: usize = i - kk
        if blocks⁅left⁆ as u32 == 87 {
            whites = whites - 1
        }
        if whites < best {
            best = whites
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro minimumRecolors(self, blocks: utf8, k: i64): i64 {
        return minimum_recolors(blocks, k)
    }
}
