namespace leetcode.minimum_number_of_moves_to_seat_everyone;

using std.collection;

# 两个定长载体都按升序排序；Array<T> 排序入口缺失（G11），视图只做只读配对。
[export(case: "camelCase")]
micro min_moves_to_seat(seats: [i64], students: [i64]) -> i64 {
    sort(seats)
    sort(students)
    let left: ArrayView<i64> = array_view(seats)
    let right: ArrayView<i64> = array_view(students)
    let count: usize = left.length()

    let mut moves: i64 = 0
    let mut i: usize = 0
    while i < count {
        let mut difference: i64 = left⁅i⁆ - right⁅i⁆
        if difference < 0 {
            difference = -difference
        }
        moves = moves + difference
        i = i + 1
    }
    return moves
}

class Solution {
    micro minMovesToSeat(self, seats: [i64], students: [i64]): i64 {
        return min_moves_to_seat(seats, students)
    }
}
