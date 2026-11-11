namespace probe.enum_equality;

using std.text
using std.operator

enums Phase {
    Alpha
    Beta
}

# 纯标记 `enums` 的相等比较，按语言直觉直接写 `==`。
# `enums` 不自带相等：按 std 合同显式 impl `Equal`，由 impl 成员参与候选。
micro phase_equal(left: Phase, right: Phase) -> bool {
    match left {
        case Alpha:
            match right {
                case Alpha: return true
                case Beta: return false
            }
        case Beta:
            match right {
                case Alpha: return false
                case Beta: return true
            }
    }
}

imply Phase: Equal {
    infix `==`(self, other: Phase): bool {
        return phase_equal(self, other)
    }

    infix `!=`(self, other: Phase): bool {
        return !(self == other)
    }
}

[export(name: "sameEnumEqual")]
micro same_enum_equal() -> i64 {
    let left: Phase = Alpha
    let right: Phase = Alpha
    return if left == right { 1 } else { 0 }
}

[export(name: "differentEnumEqual")]
micro different_enum_equal() -> i64 {
    let left: Phase = Alpha
    let right: Phase = Beta
    return if left == right { 1 } else { 0 }
}
