namespace probe.mini_interpreter;

using std.collection
using std.text

# 综合场景：词法 + 递归下降 + 求值 + 错误链，刻意叠加递归 `unite`、`Result` 传播与迭代器链。
enums TokenKind {
    Number
    Plus
    Minus
    Star
    Slash
    Open
    Close
    End
}

structure Token {
    kind: TokenKind
    value: i64
}

unite Expr {
    [constructor]
    Literal {
        value: i64
    }
    [constructor]
    Negate {
        operand: Expr
    }
    [constructor]
    Binary {
        op: TokenKind
        left: Expr
        right: Expr
    }
}

unite CalcError {
    [constructor]
    DivisionByZero {
        position: i64
    }
    [constructor]
    UnexpectedToken {
        position: i64
    }
    [constructor]
    MissingOperand {
        position: i64
    }
}

micro division_error(position: i64) -> CalcError {
    return DivisionByZero(position)
}

micro unexpected_error(position: i64) -> CalcError {
    return UnexpectedToken(position)
}

micro missing_error(position: i64) -> CalcError {
    return MissingOperand(position)
}

micro is_digit(code: i64) -> bool {
    return code >= 48 && code <= 57
}

# 词法：数字成串，算符单字符；非法字符走错误链返回。
micro tokenize(text: utf8) -> Result<ArrayList<Token>, CalcError> {
    let mut tokens: ArrayList<Token> = ArrayList::new(16)
    let length: i64 = text.length() as i64
    let mut index: i64 = 0
    while index < length {
        let code: i64 = (text.character_at(index as usize) as u32) as i64
        if code == 32 {
            index = index + 1
        } else if is_digit(code) {
            let mut value: i64 = 0
            let mut scanning: bool = true
            while scanning && index < length {
                let digit: i64 = (text.character_at(index as usize) as u32) as i64
                if is_digit(digit) {
                    value = value * 10 + (digit - 48)
                    index = index + 1
                } else {
                    scanning = false
                }
            }
            tokens.push(Token { kind: Number, value: value })
        } else if code == 43 {
            tokens.push(Token { kind: Plus, value: 0 })
            index = index + 1
        } else if code == 45 {
            tokens.push(Token { kind: Minus, value: 0 })
            index = index + 1
        } else if code == 42 {
            tokens.push(Token { kind: Star, value: 0 })
            index = index + 1
        } else if code == 47 {
            tokens.push(Token { kind: Slash, value: 0 })
            index = index + 1
        } else if code == 40 {
            tokens.push(Token { kind: Open, value: 0 })
            index = index + 1
        } else if code == 41 {
            tokens.push(Token { kind: Close, value: 0 })
            index = index + 1
        } else {
            let error: CalcError = unexpected_error(index)
            return Fail(error)
        }
    }
    tokens.push(Token { kind: End, value: 0 })
    return Fine(tokens)
}

structure Parser {
    tokens: ArrayList<Token>
    cursor: i64
}

micro parser_new(tokens: ArrayList<Token>) -> Parser {
    return Parser { tokens: tokens, cursor: 0 }
}

micro token_at(parser: Parser, offset: i64) -> Token {
    return parser.tokens⁅offset as usize⁆
}

micro is_number(kind: TokenKind) -> bool {
    return match kind {
        case Number: true
        else: false
    }
}

micro is_open(kind: TokenKind) -> bool {
    return match kind {
        case Open: true
        else: false
    }
}

micro is_close(kind: TokenKind) -> bool {
    return match kind {
        case Close: true
        else: false
    }
}

micro is_minus(kind: TokenKind) -> bool {
    return match kind {
        case Minus: true
        else: false
    }
}

micro is_additive(kind: TokenKind) -> bool {
    return match kind {
        case Plus: true
        case Minus: true
        else: false
    }
}

micro is_multiplicative(kind: TokenKind) -> bool {
    return match kind {
        case Star: true
        case Slash: true
        else: false
    }
}

# 加减层：两层 `Result` 传播，任一子层失败立即向上返回同一条错误。
micro parse_expression(mut parser: Parser) -> Result<Expr, CalcError> {
    let first: Result<Expr, CalcError> = parse_term(parser)
    let mut left: Expr = match first {
        case Fine(value): value
        case Fail(error): return Fail(error)
    }
    let mut continuing: bool = true
    while continuing {
        let kind: TokenKind = token_at(parser, parser.cursor).kind
        if is_additive(kind) {
            parser.cursor = parser.cursor + 1
            let next: Result<Expr, CalcError> = parse_term(parser)
            let right: Expr = match next {
                case Fine(value): value
                case Fail(error): return Fail(error)
            }
            left = Binary { op: kind, left: left, right: right }
        } else {
            continuing = false
        }
    }
    return Fine(left)
}

micro parse_term(mut parser: Parser) -> Result<Expr, CalcError> {
    let first: Result<Expr, CalcError> = parse_factor(parser)
    let mut left: Expr = match first {
        case Fine(value): value
        case Fail(error): return Fail(error)
    }
    let mut continuing: bool = true
    while continuing {
        let kind: TokenKind = token_at(parser, parser.cursor).kind
        if is_multiplicative(kind) {
            parser.cursor = parser.cursor + 1
            let next: Result<Expr, CalcError> = parse_factor(parser)
            let right: Expr = match next {
                case Fine(value): value
                case Fail(error): return Fail(error)
            }
            left = Binary { op: kind, left: left, right: right }
        } else {
            continuing = false
        }
    }
    return Fine(left)
}

micro parse_factor(mut parser: Parser) -> Result<Expr, CalcError> {
    let token: Token = token_at(parser, parser.cursor)
    if is_number(token.kind) {
        parser.cursor = parser.cursor + 1
        return Fine(Literal { value: token.value })
    }
    if is_minus(token.kind) {
        parser.cursor = parser.cursor + 1
        let next: Result<Expr, CalcError> = parse_factor(parser)
        let operand: Expr = match next {
            case Fine(value): value
            case Fail(error): return Fail(error)
        }
        return Fine(Negate { operand: operand })
    }
    if is_open(token.kind) {
        parser.cursor = parser.cursor + 1
        let next: Result<Expr, CalcError> = parse_expression(parser)
        let enclosed: Expr = match next {
            case Fine(value): value
            case Fail(error): return Fail(error)
        }
        let closing: Token = token_at(parser, parser.cursor)
        if !is_close(closing.kind) {
            let error: CalcError = unexpected_error(parser.cursor)
            return Fail(error)
        }
        parser.cursor = parser.cursor + 1
        return Fine(enclosed)
    }
    let error: CalcError = missing_error(parser.cursor)
    return Fail(error)
}

# 求值：递归表达式树，除零转为错误链。
micro evaluate(expr: Expr) -> Result<i64, CalcError> {
    return match expr {
        case Literal(value):
            Fine(value)
        case Negate(operand):
            match evaluate(operand) {
                case Fine(value): Fine(-value)
                case Fail(error): Fail(error)
            }
        case Binary(op, left, right):
            match evaluate(left) {
                case Fine(left_value):
                    match evaluate(right) {
                        case Fine(right_value): apply(op, left_value, right_value)
                        case Fail(error): Fail(error)
                    }
                case Fail(error):
                    Fail(error)
            }
    }
}

micro apply(op: TokenKind, left: i64, right: i64) -> Result<i64, CalcError> {
    return match op {
        case Plus: Fine(left + right)
        case Minus: Fine(left - right)
        case Star: Fine(left * right)
        case Slash:
            if right == 0 {
                let error: CalcError = division_error(0)
                Fail(error)
            } else {
                Fine(left / right)
            }
        else: Fine(0)
    }
}

micro error_code(error: CalcError) -> i64 {
    return match error {
        case DivisionByZero(position): -1
        case UnexpectedToken(position): -2
        case MissingOperand(position): -3
    }
}

# "(1+2)*3" 求值得 9。
[export(name: "evaluatePrecedence")]
micro evaluate_precedence() -> i64 {
    let tokenized: Result<ArrayList<Token>, CalcError> = tokenize("(1+2)*3")
    let tokens: ArrayList<Token> = match tokenized {
        case Fine(value): value
        case Fail(error): return error_code(error)
    }
    let mut parser: Parser = parser_new(tokens)
    let parsed: Result<Expr, CalcError> = parse_expression(parser)
    let expression: Expr = match parsed {
        case Fine(value): value
        case Fail(error): return error_code(error)
    }
    let outcome: Result<i64, CalcError> = evaluate(expression)
    return match outcome {
        case Fine(value): value
        case Fail(error): error_code(error)
    }
}

# "1+2*3" 乘除优先得 7。
[export(name: "evaluateNested")]
micro evaluate_nested() -> i64 {
    let tokenized: Result<ArrayList<Token>, CalcError> = tokenize("1+2*3")
    let tokens: ArrayList<Token> = match tokenized {
        case Fine(value): value
        case Fail(error): return error_code(error)
    }
    let mut parser: Parser = parser_new(tokens)
    let parsed: Result<Expr, CalcError> = parse_expression(parser)
    let expression: Expr = match parsed {
        case Fine(value): value
        case Fail(error): return error_code(error)
    }
    let outcome: Result<i64, CalcError> = evaluate(expression)
    return match outcome {
        case Fine(value): value
        case Fail(error): error_code(error)
    }
}

# "10/(5-5)" 除零必须沿错误链返回 DivisionByZero，编码 -1。
[export(name: "divisionByZeroCode")]
micro division_by_zero_code() -> i64 {
    let tokenized: Result<ArrayList<Token>, CalcError> = tokenize("10/(5-5)")
    let tokens: ArrayList<Token> = match tokenized {
        case Fine(value): value
        case Fail(error): return error_code(error)
    }
    let mut parser: Parser = parser_new(tokens)
    let parsed: Result<Expr, CalcError> = parse_expression(parser)
    let expression: Expr = match parsed {
        case Fine(value): value
        case Fail(error): return error_code(error)
    }
    let outcome: Result<i64, CalcError> = evaluate(expression)
    return match outcome {
        case Fine(value): value
        case Fail(error): error_code(error)
    }
}

micro token_value(token: Token) -> i64 {
    return token.value
}

# 迭代器链：词元 value 经 map / collect 汇总，"1+2*3" 只有数字贡献 1+2+3 = 6。
[export(name: "iteratorTokenTotal")]
micro iterator_token_total() -> i64 {
    let tokenized: Result<ArrayList<Token>, CalcError> = tokenize("1+2*3")
    let tokens: ArrayList<Token> = match tokenized {
        case Fine(value): value
        case Fail(error): return error_code(error)
    }
    let collected: ArrayList<i64> = tokens.into_iterator().map(token_value).collect()
    let mut total: i64 = 0
    loop value in collected {
        total = total + value
    }
    return total
}
