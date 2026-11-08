namespace probe.option_match;

using std.collection

# Option 的匹配：分别累加「有没有值」的两个维度。
[export(name: "optionMatch")]
micro option_match() -> i64 {
    let mut values: ArrayList<Option<i64>> = ArrayList::new(3)
    values.push(Some(1))
    values.push(None)
    values.push(Some(3))
    let mut total: i64 = 0
    let mut present: i64 = 0
    loop value in values {
        match value {
            case Some(inner): {
                total = total + inner
                present = present + 1
            }
            case None: {
            }
        }
    }
    return total * 10 + present
}
