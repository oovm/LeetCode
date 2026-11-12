namespace leetcode.find_all_numbers_disappeared_in_an_array;

using std.collection

# 值形切片入参：名义 `ArrayList` 句柄的 wasm 入参编组仍是编译器缺口（见 06 登记）。
# 标记算法需要原地改写，先把切片复制进本地 `ArrayList` 再走原逻辑。
[export(case: "camelCase")]
micro find_disappeared_numbers(nums: [i64]) -> [i64] {
    let n: usize = nums.length()
    let mut marks: ArrayList<i64> = ArrayList::new(n)
    let mut copy_cursor: usize = 0
    while copy_cursor < n {
        marks.push(nums⁅copy_cursor⁆)
        copy_cursor = copy_cursor + 1
    }

    let mut cursor: usize = 0
    while cursor < n {
        let mut abs_num: i64 = marks⁅cursor⁆
        if abs_num < 0 {
            abs_num = -abs_num
        }
        let idx: usize = (abs_num - 1) as usize
        let marked: i64 = marks⁅idx⁆
        if marked > 0 {
            marks⁅idx⁆ = -marked
        }
        cursor = cursor + 1
    }

    let mut ans: ArrayList<i64> = ArrayList::new(0)
    let mut i: usize = 0
    while i < n {
        if marks⁅i⁆ > 0 {
            ans.push((i + 1) as i64)
        }
        i = i + 1
    }
    return ans.to_array()
}

class Solution {
    micro findDisappearedNumbers(self, nums: [i64]): [i64] {
        return find_disappeared_numbers(nums)
    }
}
