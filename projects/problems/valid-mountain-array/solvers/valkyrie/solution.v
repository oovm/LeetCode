namespace leetcode.valid_mountain_array

# 先严格上升到峰顶，再严格下降到末尾；峰顶必须同时存在左右两段。
[export(case: "camelCase")]
micro validMountainArray(arr: ArrayList<i64>) -> bool {
    let count: usize = arr.length()
    if count < 3 {
        return false
    }
    let last: usize = count - 1
    let mut index: usize = 0
    let mut next: usize = 1
    while next < count && arr⁅index⁆ < arr⁅next⁆ {
        index = index + 1
        next = index + 1
    }
    if index == 0 || index == last {
        return false
    }
    let mut current: usize = index
    let mut ahead: usize = current + 1
    while ahead < count && arr⁅current⁆ > arr⁅ahead⁆ {
        current = current + 1
        ahead = current + 1
    }
    return current == last
}

class Solution {
    micro validMountainArray(self, arr: ArrayList<i64>): bool {
        return validMountainArray(arr)
    }
}
