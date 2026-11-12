namespace probe.recursive_union;

# 递归带载荷联合：零元、单字段、递归字段、双递归字段。
unite Expr {
    Zero

    [constructor]
    Num {
        value: i64
    }

    [constructor]
    Neg {
        inner: Expr
    }

    [constructor]
    Add {
        left: Expr
        right: Expr
    }
}

# 模式匹配按构造器绑定载荷，分支内只赋值不提前 return。
micro evaluate(expr: Expr) -> i64 {
    let mut result: i64 = 0
    match expr {
        case Zero: {
            result = 0
        }
        case Num(value): {
            result = value
        }
        case Neg(inner): {
            result = -evaluate(inner)
        }
        case Add(left, right): {
            result = evaluate(left) + evaluate(right)
        }
    }
    return result
}

[export(name: "evalNegated")]
micro eval_negated() -> i64 {
    return evaluate(Add(Num(2), Neg(Num(3))))
}

# 嵌套递归结构。
[export(name: "evalNested")]
micro eval_nested() -> i64 {
    let inner: Expr = Add(Num(1), Num(2))
    let outer: Expr = Add(inner, Add(Num(3), Num(4)))
    return evaluate(outer)
}
