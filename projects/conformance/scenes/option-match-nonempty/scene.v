namespace probe.option_match_nonempty;

using std.collection

# 对照：None 分支非空，用来定位空块是否触发 CAN010。
[export(name: "optionMatchNonempty")]
micro option_match_nonempty() -> i64 {
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
                present = present + 0
            }
        }
    }
    return total * 10 + present
}
