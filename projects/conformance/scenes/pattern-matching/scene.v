namespace probe.pattern_matching;

# 扁平带载荷联合：零元、单字段、双字段。
unite Command {
    Stop

    [constructor]
    Move {
        steps: i64
    }

    [constructor]
    Jump {
        left: i64
        right: i64
    }
}

micro execute(command: Command) -> i64 {
    let mut result: i64 = 0
    match command {
        case Stop: {
            result = 0
        }
        case Move(steps): {
            result = steps
        }
        case Jump(left, right): {
            result = left + right
        }
    }
    return result
}

[export(name: "flatUnion")]
micro flat_union() -> i64 {
    let moved: Command = Move(5)
    let jumped: Command = Jump(2, 3)
    return execute(moved) * 10 + execute(jumped)
}
