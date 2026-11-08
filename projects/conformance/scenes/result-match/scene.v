namespace probe.result_match;

using std.types

unite SquareError {
    [constructor]
    NegativeInput {
        value: i64
    }
}

micro safe_sqrt(value: i64) -> Result<i64, SquareError> {
    if value < 0 {
        return Fail(NegativeInput { value: value })
    }
    let mut root: i64 = 0
    while (root + 1) * (root + 1) <= value {
        root = root + 1
    }
    return Fine(root)
}

# 三态：Fine / 领域错误 / Option 缺席 分别计码。
[export(name: "triState")]
micro tri_state() -> i64 {
    let mut code: i64 = 0
    match safe_sqrt(16) {
        case Fine(root): {
            code = code + 100
        }
        case Fail(reason): {
            code = code + 1
        }
    }
    match safe_sqrt(-4) {
        case Fine(root): {
            code = code + 100
        }
        case Fail(reason): {
            code = code + 10
        }
    }
    let absent: Option<i64> = None
    match absent {
        case Some(value): {
            code = code + value
        }
        case None: {
            code = code + 1
        }
    }
    return code
}
