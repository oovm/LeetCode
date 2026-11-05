namespace leetcode.corporate_flight_bookings;

using std.collection;

# 差分数组：每条预订在首站 +seats、末站之后 -seats，前缀和即每站座位数。
[export(case: "camelCase")]
micro corp_flight_bookings(bookings: ArrayList<ArrayList<i64>>, n: i64) -> ArrayList<i64> {
    let size: usize = n as usize
    let mut answer: ArrayList<i64> = ArrayList::new(size)
    loop _fill in 0..size {
        answer.push(0)
    }

    let mut index: usize = 0
    while index < bookings.length() {
        let first: i64 = bookings⁅index⁆⁅0⁆
        let last: i64 = bookings⁅index⁆⁅1⁆
        let seats: i64 = bookings⁅index⁆⁅2⁆
        answer⁅(first - 1) as usize⁆ = answer⁅(first - 1) as usize⁆ + seats
        if last < n {
            answer⁅last as usize⁆ = answer⁅last as usize⁆ - seats
        }
        index = index + 1
    }

    let mut position: usize = 1
    while position < size {
        answer⁅position⁆ = answer⁅position⁆ + answer⁅position - 1⁆
        position = position + 1
    }
    return answer
}

class Solution {
    micro corpFlightBookings(self, bookings: ArrayList<ArrayList<i64>>, n: i64): ArrayList<i64> {
        return corp_flight_bookings(bookings, n)
    }
}
