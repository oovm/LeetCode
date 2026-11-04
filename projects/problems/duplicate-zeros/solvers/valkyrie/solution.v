namespace leetcode.duplicate_zeros;

# 逆序复写：先数 0 的个数得到目标写指针，再从右向左写，越界项自然被丢弃。
# 定长载体写侧：读指针始终领先写指针，原地完成，不额外分配。
[export(case: "camelCase")]
micro duplicate_zeros(mut arr: ArrayList<i64>) -> unit {
    let count: usize = arr.length()
    if count == 0 {
        return
    }

    let mut zeros: i64 = 0
    let mut i: i64 = 0
    while i < count as i64 {
        if arr⁅i as usize⁆ == 0 {
            zeros = zeros + 1
        }
        i = i + 1
    }

    let mut read: i64 = count as i64 - 1
    let mut write: i64 = count as i64 + zeros - 1
    while read >= 0 {
        let value: i64 = arr⁅read as usize⁆
        if value == 0 {
            if write < count as i64 {
                arr⁅write as usize⁆ = 0
            }
            write = write - 1
            if write < count as i64 {
                arr⁅write as usize⁆ = 0
            }
            write = write - 1
        } else {
            if write < count as i64 {
                arr⁅write as usize⁆ = value
            }
            write = write - 1
        }
        read = read - 1
    }
}

class Solution {
    micro duplicateZeros(mut self, arr: ArrayList<i64>): unit {
        duplicate_zeros(arr)
    }
}
