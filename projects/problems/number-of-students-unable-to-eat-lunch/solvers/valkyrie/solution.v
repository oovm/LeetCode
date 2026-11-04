namespace leetcode.number_of_students_unable_to_eat_lunch;

using std.collection;

# 队列模拟：队首与当前三明治匹配就吃掉，否则整轮挪到队尾；一整轮无人匹配即可停止。
# 题内触发点: `Deque` 第三面 —— 队列侧 `peek_front` / `pop_front` / `push_back`
# （此前批次只压过栈侧 back 操作）。
[export(case: "camelCase")]
micro count_students(students: ArrayList<i64>, sandwiches: ArrayList<i64>) -> i64 {
    let mut queue: Deque<i64> = Deque::new()
    loop student in students {
        queue.push_back(student)
    }

    let mut sandwich_index: usize = 0
    let mut rotations: usize = 0
    while rotations < queue.length() {
        let head: i64 = queue.peek_front().unwrap()
        if head == sandwiches⁅sandwich_index⁆ {
            let served: i64 = queue.pop_front().unwrap()
            sandwich_index = sandwich_index + 1
            rotations = 0
        } else {
            let moved: i64 = queue.pop_front().unwrap()
            queue.push_back(moved)
            rotations = rotations + 1
        }
    }
    return queue.length() as i64
}

class Solution {
    micro countStudents(self, students: ArrayList<i64>, sandwiches: ArrayList<i64>): i64 {
        return count_students(students, sandwiches)
    }
}
