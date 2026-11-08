namespace probe.higher_order;

using std.collection;
using std.types;

micro cmp_desc(left: i64, right: i64) -> i32 {
    if left > right {
        return -1
    }
    if left < right {
        return 1
    }
    return 0
}

micro halve(value: i64) -> Option<i64> {
    if value % 2 != 0 {
        return None
    }
    return Some(value / 2)
}

# 命名函数作为值传给排序入口，比较器返回三态整数。
[export(name: "quickSortDescChecksum")]
micro quick_sort_desc_checksum() -> i64 {
    let mut values: ArrayList<i64> = ArrayList::new(3)
    values.push(3)
    values.push(1)
    values.push(2)
    quick_sort(values, cmp_desc)
    let mut checksum: i64 = 0
    loop value in values {
        checksum = checksum * 10 + value
    }
    return checksum
}

# Option 的方法链：and_then 串联可能失败的一元函数。
[export(name: "optionChain")]
micro option_chain() -> i64 {
    let start: Option<i64> = Some(12)
    let halved_once: Option<i64> = start.and_then(halve)
    let halved_twice: Option<i64> = halved_once.and_then(halve)
    return halved_twice.unwrap_or(-1)
}
