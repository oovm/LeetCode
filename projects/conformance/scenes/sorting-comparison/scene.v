namespace probe.sorting_comparison;

using std.collection

micro magnitude(value: i64) -> i64 {
    if value < 0 {
        return -value
    }
    return value
}

micro cmp_magnitude(left: i64, right: i64) -> i32 {
    if magnitude(left) < magnitude(right) {
        return -1
    }
    if magnitude(right) < magnitude(left) {
        return 1
    }
    return 0
}

# 单参 sort 走类型合同派生的比较器。
[export(name: "sortI64Checksum")]
micro sort_i64_checksum() -> i64 {
    let mut values: ArrayList<i64> = ArrayList::new(3)
    values.push(5)
    values.push(1)
    values.push(4)
    sort(values)
    let mut checksum: i64 = 0
    loop value in values {
        checksum = checksum * 10 + value
    }
    return checksum
}

# 显式比较器排序：按绝对值升序。
[export(name: "quicksortMagnitude")]
micro quicksort_magnitude() -> i64 {
    let mut values: ArrayList<i64> = ArrayList::new(3)
    values.push(-3)
    values.push(1)
    values.push(-2)
    quick_sort(values, cmp_magnitude)
    let mut checksum: i64 = 0
    loop value in values {
        checksum = checksum * 10 + value
    }
    return checksum
}
