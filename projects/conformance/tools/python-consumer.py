"""CPython 产物消费者：按执行清单冻结的模块名与载体签名调用一个导出。

输入是一个 JSON 文件路径（argv[1]）：
    {
      "pydPath": "...pyd",
      "moduleName": "leetcode_multiply_strings",
      "exportName": "multiply",
      "parameters": ["utf8", "utf8"],
      "parameterNames": ["num1", "num2"],
      "returns": "utf8",
      "args": ["123", "456"],
      "listExports": false
    }

输出一行 JSON。所有断言失败都以 `ok=false` 报告而不是抛栈，便于消费者把
「载体不匹配 / 类型错误 / 算法错误」分开计数。
"""

import importlib.util
import json
import sys
import traceback

INT_KINDS = {"i64"}
FLOAT_KINDS = {"f64"}


def fail(stage, error, error_type=None):
    payload = {"ok": False, "stage": stage, "error": error}
    if error_type:
        payload["errorType"] = error_type
    print(json.dumps(payload, ensure_ascii=False))
    sys.exit(0)


def check_argument(kind, value, position):
    if kind == "i64":
        if type(value) is not int:
            raise TypeError(f"实参 {position} 需要 int，实际 {type(value).__name__}")
    elif kind == "f64":
        if not isinstance(value, (int, float)) or isinstance(value, bool):
            raise TypeError(f"实参 {position} 需要 float，实际 {type(value).__name__}")
    elif kind == "bool":
        if type(value) is not bool:
            raise TypeError(f"实参 {position} 需要 bool，实际 {type(value).__name__}")
    elif kind == "utf8":
        if type(value) is not str:
            raise TypeError(f"实参 {position} 需要 str，实际 {type(value).__name__}")
    elif kind == "i64[]":
        if type(value) is not list or any(type(item) is not int for item in value):
            raise TypeError(f"实参 {position} 需要 list[int]")
    else:
        raise TypeError(f"未知载体 {kind}")


def encode_result(kind, value):
    if kind == "i64":
        if type(value) is not int:
            raise TypeError(f"i64 返回值必须是 int，实际 {type(value).__name__}")
        return str(value)
    if kind == "f64":
        if not isinstance(value, float):
            raise TypeError(f"f64 返回值必须是 float，实际 {type(value).__name__}")
        return repr(value)
    if kind == "bool":
        if type(value) is not bool:
            raise TypeError(f"bool 返回值必须是 bool，实际 {type(value).__name__}")
        return value
    if kind == "utf8":
        if type(value) is not str:
            raise TypeError(f"utf8 返回值必须是 str，实际 {type(value).__name__}")
        return value
    if kind == "unit":
        if value is not None:
            raise TypeError(f"unit 返回值必须是 None，实际 {type(value).__name__}")
        return None
    if kind == "i64[]":
        if type(value) is not list or any(type(item) is not int for item in value):
            raise TypeError(f"i64[] 返回值必须是 list[int]，实际 {type(value).__name__}")
        return [str(item) for item in value]
    raise TypeError(f"未知返回载体 {kind}")


def main():
    request = json.loads(open(sys.argv[1], encoding="utf-8").read())
    module_name = request["moduleName"]
    spec = importlib.util.spec_from_file_location(module_name, request["pydPath"])
    if spec is None or spec.loader is None:
        fail("load", f"无法为 {request['pydPath']} 建立 import spec")
    module = importlib.util.module_from_spec(spec)
    try:
        spec.loader.exec_module(module)
    except Exception as error:  # noqa: BLE001 - 装载失败需要原样上报
        fail("load", f"{type(error).__name__}: {error}")
    if module.__name__ != module_name:
        fail("load", f"模块名不符：期望 {module_name}，实际 {module.__name__}")
    exports = [name for name in dir(module) if not name.startswith("_")]
    if request["exportName"] not in exports:
        fail("identity", f"模块没有导出 {request['exportName']}（公开名: {', '.join(exports)}）")

    parameters = request["parameters"]
    names = request["parameterNames"]
    args = request["args"]
    if not (len(parameters) == len(names) == len(args)):
        fail("abi", f"签名/形参名/实参数量不一致：{len(parameters)}/{len(names)}/{len(args)}")
    try:
        for position, (kind, value) in enumerate(zip(parameters, args)):
            check_argument(kind, value, position)
        function = getattr(module, request["exportName"])
        # CPython 包装体以 METH_VARARGS 接收位置实参；顺序由清单的
        # parameters/parameter_names 冻结，这里不做任何名字推导。
        result = function(*args)
        encoded = encode_result(request["returns"], result)
    except Exception as error:  # noqa: BLE001 - 类型/执行错误原样上报
        fail("execute", f"{type(error).__name__}: {error}", type(error).__name__)

    payload = {"ok": True, "kind": request["returns"], "value": encoded}
    if request.get("listExports"):
        payload["exports"] = exports
    if request.get("captureArgs"):
        payload["argsAfter"] = args
    print(json.dumps(payload, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except Exception as error:  # noqa: BLE001
        traceback.print_exc()
        fail("driver", f"{type(error).__name__}: {error}")
