namespace probe.custom_error_chain;

using std.types

# 自定义错误联合：三个阶段各自带错误码。
unite StageError {
    [constructor]
    Parse {
        code: i64
    }

    [constructor]
    Range {
        code: i64
    }

    [constructor]
    Io {
        code: i64
    }
}

micro parse_stage(raw: i64) -> Result<i64, StageError> {
    if raw < 0 {
        return Fail(Parse(1))
    }
    return Fine(raw)
}

micro range_stage(value: i64) -> Result<i64, StageError> {
    if value > 100 {
        return Fail(Range(2))
    }
    return Fine(value)
}

micro io_stage(value: i64) -> Result<i64, StageError> {
    if value == 0 {
        return Fail(Io(3))
    }
    return Fine(value)
}

# 三层错误链：任一层 Fail 原样上传，成功则逐层推进。
micro run_chain(raw: i64) -> Result<i64, StageError> {
    match parse_stage(raw) {
        case Fine(parsed): {
            match range_stage(parsed) {
                case Fine(in_range): {
                    match io_stage(in_range) {
                        case Fine(final_value): {
                            return Fine(final_value)
                        }
                        case Fail(io_error): {
                            return Fail(io_error)
                        }
                    }
                }
                case Fail(range_error): {
                    return Fail(range_error)
                }
            }
        }
        case Fail(parse_error): {
            return Fail(parse_error)
        }
    }
    return Fail(Parse(4))
}

micro error_code(error: StageError) -> i64 {
    return match error {
        case Parse(code): code
        case Range(code): code
        case Io(code): code
    }
}

micro chain_code(raw: i64) -> i64 {
    let outcome: Result<i64, StageError> = run_chain(raw)
    return match outcome {
        case Fine(value): value
        case Fail(error): 0 - error_code(error)
    }
}

[export(name: "chainSuccess")]
micro chain_success() -> i64 {
    return chain_code(25)
}

[export(name: "chainParseFail")]
micro chain_parse_fail() -> i64 {
    return chain_code(-5)
}

[export(name: "chainRangeFail")]
micro chain_range_fail() -> i64 {
    return chain_code(200)
}

[export(name: "chainIoFail")]
micro chain_io_fail() -> i64 {
    return chain_code(0)
}
