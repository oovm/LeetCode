namespace probe.generic_constraints;

using std.collection
using std.operator

# 第一层约束：元素类型只需要三态全序。
micro largest<T>(items: ArrayList<T>) -> T
    where T: std::operator::Comparable
{
    let mut best: T = items⁅0 as usize⁆
    let mut index: i64 = 1
    while index < items.length() as i64 {
        let current: T = items⁅index as usize⁆
        match current.compare(best) {
            case Greater: {
                best = current
            }
            case Less: {
            }
            case Equal: {
            }
            case Unordered: {
            }
        }
        index = index + 1
    }
    return best
}

# 第二层约束叠加：嵌套容器仍对 `T` 施加 `Comparable & Equal`，并把约束传给第一层。
micro largest_of_rows<T>(rows: ArrayList<ArrayList<T>>) -> T
    where T: std::operator::Comparable & std::operator::Equal
{
    let mut best: T = largest(rows⁅0 as usize⁆)
    let mut index: i64 = 1
    while index < rows.length() as i64 {
        let candidate: T = largest(rows⁅index as usize⁆)
        match candidate.compare(best) {
            case Greater: {
                best = candidate
            }
            case Less: {
            }
            case Equal: {
            }
            case Unordered: {
            }
        }
        index = index + 1
    }
    return best
}

# 只用 `Equal` 的叠加约束：内层判定函数与外层容器传递同一个 `T`。
micro contains<T>(items: ArrayList<T>, target: T) -> bool
    where T: std::operator::Equal
{
    loop item in items {
        if item == target {
            return true
        }
    }
    return false
}

micro contains_in_rows<T>(rows: ArrayList<ArrayList<T>>, target: T) -> bool
    where T: std::operator::Equal
{
    loop row in rows {
        if contains(row, target) {
            return true
        }
    }
    return false
}

micro row(values: [i64]) -> ArrayList<i64> {
    let mut items: ArrayList<i64> = ArrayList::new(values.length())
    loop value in values {
        items.push(value)
    }
    return items
}

[export(name: "largestValue")]
micro largest_value() -> i64 {
    return largest(row([2, 9, 4, 7]))
}

[export(name: "largestOfRows")]
micro largest_of_rows_export() -> i64 {
    let mut rows: ArrayList<ArrayList<i64>> = ArrayList::new(3)
    rows.push(row([3, 9, 2]))
    rows.push(row([7, 4]))
    rows.push(row([6, 8, 1]))
    return largest_of_rows(rows)
}

[export(name: "nestedContains")]
micro nested_contains() -> i64 {
    let mut rows: ArrayList<ArrayList<i64>> = ArrayList::new(3)
    rows.push(row([3, 9, 2]))
    rows.push(row([7, 4]))
    rows.push(row([6, 8, 1]))
    if contains_in_rows(rows, 8) {
        return 1
    }
    return 0
}
