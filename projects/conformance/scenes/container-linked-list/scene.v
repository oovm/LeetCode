namespace probe.container_linked_list;

using std.collection

# 双端建表：尾部 1,2,3，头部 0。
micro four_values() -> LinkedList<i64> {
    let mut list: LinkedList<i64> = LinkedList::new()
    list.push_back(1)
    list.push_back(2)
    list.push_back(3)
    list.push_front(0)
    return list
}

# 头出队 0，尾出队 3，剩余头元素 1。
[export(name: "linkedListFrontBack")]
micro linked_list_front_back() -> i64 {
    let mut list: LinkedList<i64> = four_values()
    let front: i64 = list.pop_front().unwrap_or(-1)
    let back: i64 = list.pop_back().unwrap_or(-1)
    let head: i64 = list.peek_front().unwrap_or(-1)
    return front * 100 + back * 10 + head
}

# 四条记录的长度与成员判定。
[export(name: "linkedListMembership")]
micro linked_list_membership() -> i64 {
    let list: LinkedList<i64> = four_values()
    let length: usize = list.length()
    let has_two: bool = list.contains(2)
    let has_nine: bool = list.contains(9)
    let length_code: i64 = length as i64
    let two_code: i64 = if has_two { 1 } else { 0 }
    let nine_code: i64 = if has_nine { 1 } else { 0 }
    return length_code * 10 + two_code - nine_code
}

# 从头部连续出队得到 0,1,2,3，拼成十进制 123。
[export(name: "linkedListDrainOrder")]
micro linked_list_drain_order() -> i64 {
    let mut list: LinkedList<i64> = four_values()
    let mut total: i64 = 0
    while list.length() > 0 {
        total = total * 10 + list.pop_front().unwrap_or(-1)
    }
    return total
}
