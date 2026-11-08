namespace probe.recursive_descent_parser;

using std.collection
using std.text

# 词法：词元种类与词元载荷各司其职。
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

# 手写递归下降 AST：表达式节点携带子表达式，形成递归载荷。
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

micro is_digit(code: i64) -> bool {
    return code >= 48 && code <= 57
}

micro tokenize(text: utf8) -> ArrayList<Token> {
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
            tokens.push(Token { kind: End, value: 0 })
            index = index + 1
        }
    }
    tokens.push(Token { kind: End, value: 0 })
    return tokens
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

# 加减层：左结合，反复接管乘除层结果。
micro parse_expression(mut parser: Parser) -> Expr {
    let mut left: Expr = parse_term(parser)
    let mut continuing: bool = true
    while continuing {
        let kind: TokenKind = token_at(parser, parser.cursor).kind
        if is_additive(kind) {
            parser.cursor = parser.cursor + 1
            let right: Expr = parse_term(parser)
            left = Binary { op: kind, left: left, right: right }
        } else {
            continuing = false
        }
    }
    return left
}

# 乘除层：左结合，反复接管因子层结果。
micro parse_term(mut parser: Parser) -> Expr {
    let mut left: Expr = parse_factor(parser)
    let mut continuing: bool = true
    while continuing {
        let kind: TokenKind = token_at(parser, parser.cursor).kind
        if is_multiplicative(kind) {
            parser.cursor = parser.cursor + 1
            let right: Expr = parse_factor(parser)
            left = Binary { op: kind, left: left, right: right }
        } else {
            continuing = false
        }
    }
    return left
}

# 因子层：数字、前缀负号、括号。
micro parse_factor(mut parser: Parser) -> Expr {
    let token: Token = token_at(parser, parser.cursor)
    if is_number(token.kind) {
        parser.cursor = parser.cursor + 1
        return Literal { value: token.value }
    }
    if is_minus(token.kind) {
        parser.cursor = parser.cursor + 1
        let operand: Expr = parse_factor(parser)
        return Negate { operand: operand }
    }
    parser.cursor = parser.cursor + 1
    let inner: Expr = parse_expression(parser)
    parser.cursor = parser.cursor + 1
    return inner
}

micro evaluate(expr: Expr) -> i64 {
    return match expr {
        case Literal(value):
            value
        case Negate(operand):
            -evaluate(operand)
        case Binary(op, left, right):
            apply(op, evaluate(left), evaluate(right))
    }
}

micro apply(op: TokenKind, left: i64, right: i64) -> i64 {
    return match op {
        case Plus: left + right
        case Minus: left - right
        case Star: left * right
        case Slash: left / right
        else: 0
    }
}

# "1+2*3" 的乘除优先得 7。
[export(name: "evaluatePrecedence")]
micro evaluate_precedence() -> i64 {
    let tokens: ArrayList<Token> = tokenize("1+2*3")
    let mut parser: Parser = parser_new(tokens)
    return evaluate(parse_expression(parser))
}

# "(1+2)*3 - -4" 的括号与前缀负号得 13。
[export(name: "evaluateParenNegate")]
micro evaluate_paren_negate() -> i64 {
    let tokens: ArrayList<Token> = tokenize("(1+2)*3 - -4")
    let mut parser: Parser = parser_new(tokens)
    return evaluate(parse_expression(parser))
}

# "10/3" 的整数除法向下截断得 3。
[export(name: "evaluateIntegerDivision")]
micro evaluate_integer_division() -> i64 {
    let tokens: ArrayList<Token> = tokenize("10/3")
    let mut parser: Parser = parser_new(tokens)
    return evaluate(parse_expression(parser))
}
