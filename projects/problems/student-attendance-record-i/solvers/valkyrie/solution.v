namespace leetcode.student_attendance_record_i;

[export(case: "camelCase")]
micro check_record(s: utf8) -> bool {
    let n: usize = s.length()
    let mut i: usize = 0
    let mut absents: i64 = 0
    let mut late_run: i64 = 0
    while i < n {
        let code: u32 = s.char_at(i + 1).unwrap() as u32
        if code == 65 {
            absents = absents + 1
            late_run = 0
        } else if code == 76 {
            late_run = late_run + 1
            if late_run >= 3 {
                return false
            }
        } else {
            late_run = 0
        }
        i = i + 1
    }
    return absents < 2
}

class Solution {
    micro checkRecord(self, s: utf8): bool {
        return check_record(s)
    }
}
