// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "replacements": [["W", "wxy"], ["X", "xyz"], ["Y", "%W%_%X%"], ["Z", "uvw"]],
                "text": "%Y%_%Z%"
            },
            "expected": "wxy_xyz_uvw"
        },
        {
            "args": {
                "replacements": [["M", "mno"], ["N", "pqr"], ["O", "stu"], ["P", "%M%%N%"]],
                "text": "%M%_%N%_%O%_%P%"
            },
            "expected": "mno_pqr_stu_mnopqr"
        },
        {
            "args": {
                "replacements": [["X", "xyz"], ["Y", "uvw"], ["Z", "%X%%Y%"]],
                "text": "%X%_%Y%_%Z%"
            },
            "expected": "xyz_uvw_xyzuvw"
        },
        {
            "args": {
                "replacements": [["M", "mno"], ["N", "pqr"], ["O", "stu"], ["P", "vwx"]],
                "text": "%M%_%N%_%O%_%P%"
            },
            "expected": "mno_pqr_stu_vwx"
        },
        {
            "args": {
                "replacements": [["A", "abc"], ["B", "def"]],
                "text": "%A%_%B%"
            },
            "expected": "abc_def"
        },
        {
            "args": {
                "replacements": [["Q", "qwe"], ["R", "rty"], ["S", "%Q%%R%"], ["T", "%R%%S%"]],
                "text": "%Q%_%R%_%S%_%T%"
            },
            "expected": "qwe_rty_qwerty_rtyqwerty"
        },
        {
            "args": {
                "replacements": [["X", "xyz"], ["Y", "uvw"], ["Z", "%X%_%Y%"]],
                "text": "%X%_%Y%_%Z%"
            },
            "expected": "xyz_uvw_xyz_uvw"
        },
        {
            "args": {
                "replacements": [["Q", "qwe"], ["R", "rty"], ["S", "uiop"], ["T", "asdf"], ["U", "%Q%%R%"]],
                "text": "%Q%_%R%_%S%_%T%_%U%"
            },
            "expected": "qwe_rty_uiop_asdf_qwerty"
        },
        {
            "args": {
                "replacements": [["A", "bce"], ["B", "ace"], ["C", "abc%B%"]],
                "text": "%A%_%B%_%C%"
            },
            "expected": "bce_ace_abcace"
        },
        {
            "args": {
                "replacements": [["X", "mno"], ["Y", "pqr"], ["Z", "%X%%Y%"], ["A", "stu"], ["B", "%Z%%A%"], ["C", "vwx%B%"]],
                "text": "%C%"
            },
            "expected": "vwxmnopqrstu"
        },
        {
            "args": {
                "replacements": [
                    ["A", "xy%B%zy"],
                    ["B", "wv%C%vu"],
                    ["C", "ut%D%tu"],
                    ["D", "sr%E%sr"],
                    ["E", "qp%F%pq"],
                    ["F", "on%G%no"],
                    ["G", "ml%H%ml"],
                    ["H", "lk%I%lk"],
                    ["I", "ji%J%ji"],
                    ["J", "hg"]
                ],
                "text": "%A%_%B%_%C%_%D%_%E%_%F%_%G%_%H%_%I%_%J%"
            },
            "expected": "xywvutsrqponmllkjihgjilkmlnopqsrtuvuzy_wvutsrqponmllkjihgjilkmlnopqsrtuvu_utsrqponmllkjihgjilkmlnopqsrtu_srqponmllkjihgjilkmlnopqsr_qponmllkjihgjilkmlnopq_onmllkjihgjilkmlno_mllkjihgjilkml_lkjihgjilk_jihgji_hg"
        },
        {
            "args": {
                "replacements": [["N", "abc%O%"], ["O", "def%P%"], ["P", "ghi"], ["Q", "jkl%O%"], ["R", "mno%P%"], ["S", "pqr%O%"]],
                "text": "%N%_%Q%_%R%_%S%"
            },
            "expected": "abcdefghi_jkldefghi_mnoghi_pqrdefghi"
        },
        {
            "args": {
                "replacements": [["A", "bcd"], ["B", "%A%%A%"], ["C", "%B%def"], ["D", "ghi%C%"]],
                "text": "%A%_%B%_%C%_%D%"
            },
            "expected": "bcd_bcdbcd_bcdbcddef_ghibcdbcddef"
        },
        {
            "args": {
                "replacements": [
                    ["S", "stu"],
                    ["T", "vwx"],
                    ["U", "%S%%T%"],
                    ["V", "%U%%U%"],
                    ["W", "%V%%V%"],
                    ["X", "%W%%W%"],
                    ["Y", "%X%%X%"]
                ],
                "text": "%S%_%T%_%U%_%V%_%W%_%X%_%Y%"
            },
            "expected": "stu_vwx_stuvwx_stuvwxstuvwx_stuvwxstuvwxstuvwxstuvwx_stuvwxstuvwxstuvwxstuvwxstuvwxstuvwxstuvwxstuvwx_stuvwxstuvwxstuvwxstuvwxstuvwxstuvwxstuvwxstuvwxstuvwxstuvwxstuvwxstuvwxstuvwxstuvwxstuvwxstuvwx"
        },
        {
            "args": {
                "replacements": [["H", "xyz%I%"], ["I", "uvw"], ["J", "%H%_%I%"], ["K", "lmn"], ["L", "opq%I%"], ["M", "rst%I%"]],
                "text": "%J%_%K%_%L%_%M%"
            },
            "expected": "xyzuvw_uvw_lmn_opquvw_rstuvw"
        },
        {
            "args": {
                "replacements": [["S", "abc"], ["T", "def"], ["U", "%S%%T%"], ["V", "%U%ghi"], ["W", "jkl%V%"]],
                "text": "%W%"
            },
            "expected": "jklabcdefghi"
        },
        {
            "args": {
                "replacements": [["E", "efg"], ["F", "hij"], ["G", "%E%%F%"], ["H", "%G%%G%"], ["I", "%H%%H%"], ["J", "%I%%I%"]],
                "text": "%E%_%F%_%G%_%H%_%I%_%J%"
            },
            "expected": "efg_hij_efghij_efghijefghij_efghijefghijefghijefghij_efghijefghijefghijefghijefghijefghijefghijefghij"
        },
        {
            "args": {
                "replacements": [["A", "abc"], ["B", "def"], ["C", "%A%%B%"], ["D", "%C%%C%"]],
                "text": "%A%_%B%_%C%_%D%"
            },
            "expected": "abc_def_abcdef_abcdefabcdef"
        },
        {
            "args": {
                "replacements": [["S", "%T%%U%"], ["T", "vwx"], ["U", "%V%uvw"], ["V", "xyz"], ["W", "123"], ["X", "%W%%S%"]],
                "text": "%X%_%S%_%U%_%V%_%W%"
            },
            "expected": "123vwxxyzuvw_vwxxyzuvw_xyzuvw_xyz_123"
        },
        {
            "args": {
                "replacements": [["L", "lmn"], ["M", "nop"], ["N", "qrs"], ["O", "%L%%M%"], ["P", "%O%%N%"], ["Q", "%P%%P%"]],
                "text": "%L%_%M%_%N%_%O%_%P%_%Q%"
            },
            "expected": "lmn_nop_qrs_lmnnop_lmnnopqrs_lmnnopqrslmnnopqrs"
        },
        {
            "args": {
                "replacements": [["A", "bcd%F%"], ["B", "%E%abc"], ["C", "%A%%B%"], ["D", "xyz"], ["E", "uvw"], ["F", "123"]],
                "text": "%C%_%D%_%E%_%F%"
            },
            "expected": "bcd123uvwabc_xyz_uvw_123"
        },
        {
            "args": {
                "replacements": [
                    ["A", "abc"],
                    ["B", "def"],
                    ["C", "%A%%B%"],
                    ["D", "%C%%C%"],
                    ["E", "%D%%D%"],
                    ["F", "%E%%E%"],
                    ["G", "%F%%F%"]
                ],
                "text": "%A%_%B%_%C%_%D%_%E%_%F%_%G%"
            },
            "expected": "abc_def_abcdef_abcdefabcdef_abcdefabcdefabcdefabcdef_abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef_abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef"
        },
        {
            "args": {
                "replacements": [["P", "pqr"], ["Q", "%P%_%P%"], ["R", "%Q%_%Q%"], ["S", "%R%_%R%"]],
                "text": "%P%_%Q%_%R%_%S%"
            },
            "expected": "pqr_pqr_pqr_pqr_pqr_pqr_pqr_pqr_pqr_pqr_pqr_pqr_pqr_pqr_pqr"
        },
        {
            "args": {
                "replacements": [
                    ["A", "bcd%F%efg"],
                    ["B", "hij%G%klm"],
                    ["C", "nop%H%qrs"],
                    ["D", "tuv%I%wxy"],
                    ["E", "yz%J%abc"],
                    ["F", "def"],
                    ["G", "ghi"],
                    ["H", "jkl"],
                    ["I", "mno"],
                    ["J", "pqr"]
                ],
                "text": "%A%_%B%_%C%_%D%_%E%"
            },
            "expected": "bcddefefg_hijghiklm_nopjklqrs_tuvmnowxy_yzpqrabc"
        },
        {
            "args": {
                "replacements": [
                    ["P", "pqr"],
                    ["Q", "stu%P%"],
                    ["R", "uvw%Q%"],
                    ["S", "xyz%R%"],
                    ["T", "abc"],
                    ["U", "def%T%"],
                    ["V", "ghi%U%"],
                    ["W", "jkl%V%"],
                    ["X", "mno%W%"],
                    ["Y", "opq%X%"],
                    ["Z", "rst%Y%"]
                ],
                "text": "%Z%"
            },
            "expected": "rstopqmnojklghidefabc"
        },
        {
            "args": {
                "replacements": [["M", "mnop"], ["N", "%O%%P%"], ["O", "qrst"], ["P", "%Q%%R%"], ["Q", "uvw"], ["R", "xyz"]],
                "text": "%M%_%N%_%O%_%P%_%Q%_%R%"
            },
            "expected": "mnop_qrstuvwxyz_qrst_uvwxyz_uvw_xyz"
        },
        {
            "args": {
                "replacements": [["U", "uvw"], ["V", "xyz"], ["W", "%U%%V%"], ["X", "%W%%W%"], ["Y", "%X%%X%"]],
                "text": "%U%_%V%_%W%_%X%_%Y%"
            },
            "expected": "uvw_xyz_uvwxyz_uvwxyzuvwxyz_uvwxyzuvwxyzuvwxyzuvwxyz"
        },
        {
            "args": {
                "replacements": [["X", "abc"], ["Y", "def%X%ghi"], ["Z", "jkl%Y%mno"], ["W", "pqr%Z%stu"], ["V", "vwx%W%yz"]],
                "text": "%X%_%Y%_%Z%_%W%_%V%"
            },
            "expected": "abc_defabcghi_jkldefabcghimno_pqrjkldefabcghimnostu_vwxpqrjkldefabcghimnostuyz"
        },
        {
            "args": {
                "replacements": [["Y", "%Z%abc"], ["Z", "%A%%B%"], ["A", "def"], ["B", "ghi"], ["C", "%Y%%A%"], ["D", "jkl"]],
                "text": "%C%_%D%_%Y%_%Z%"
            },
            "expected": "defghiabcdef_jkl_defghiabc_defghi"
        },
        {
            "args": {
                "replacements": [["A", "bce"], ["B", "ace"], ["C", "abc%B%"], ["D", "%C%_%A%"], ["E", "%B%_%D%"], ["F", "%E%_%C%"]],
                "text": "%F%"
            },
            "expected": "ace_abcace_bce_abcace"
        },
        {
            "args": {
                "replacements": [["I", "mno"], ["J", "pqr"], ["K", "stu%I%"], ["L", "%J%%K%"], ["M", "vwx%L%"]],
                "text": "%M%"
            },
            "expected": "vwxpqrstumno"
        },
        {
            "args": {
                "replacements": [["M", "abc"], ["N", "def"], ["O", "ghi%N%"], ["P", "jkl%O%"], ["Q", "%P%_%M%"], ["R", "%Q%_%N%"]],
                "text": "%R%"
            },
            "expected": "jklghidef_abc_def"
        },
        {
            "args": {
                "replacements": [
                    ["A", "abc%F%def"],
                    ["B", "ghi%J%klm"],
                    ["C", "nop%K%qr"],
                    ["D", "stu"],
                    ["E", "%A%%B%"],
                    ["F", "%D%vwx"],
                    ["G", "%E%%C%"],
                    ["H", "yz"],
                    ["I", "%H%abc"],
                    ["J", "%I%def"],
                    ["K", "%J%ghi"]
                ],
                "text": "%E%_%G%"
            },
            "expected": "abcstuvwxdefghiyzabcdefklm_abcstuvwxdefghiyzabcdefklmnopyzabcdefghiqr"
        },
        {
            "args": {
                "replacements": [["Y", "abc"], ["Z", "def%Y%"], ["A", "ghi%Z%"], ["B", "jkl%A%"], ["C", "mno%B%"], ["D", "%C%_%A%"]],
                "text": "%D%"
            },
            "expected": "mnojklghidefabc_ghidefabc"
        },
        {
            "args": {
                "replacements": [["A", "def%G%"], ["B", "ghi"], ["C", "jkl%G%"], ["D", "mno"], ["E", "pqr"], ["F", "stu%G%"], ["G", "abc"]],
                "text": "%A%_%B%_%C%_%D%_%E%_%F%"
            },
            "expected": "defabc_ghi_jklabc_mno_pqr_stuabc"
        },
        {
            "args": {
                "replacements": [["E", "%F%"], ["F", "%G%"], ["G", "xyz"], ["H", "%E%_%F%_%G%"]],
                "text": "%H%"
            },
            "expected": "xyz_xyz_xyz"
        },
        {
            "args": {
                "replacements": [["K", "klm"], ["L", "nop"], ["M", "qrs"], ["N", "%K%%L%"], ["O", "%M%%M%"], ["P", "%N%%O%"], ["Q", "%P%%P%"]],
                "text": "%K%_%L%_%M%_%N%_%O%_%P%_%Q%"
            },
            "expected": "klm_nop_qrs_klmnop_qrsqrs_klmnopqrsqrs_klmnopqrsqrsklmnopqrsqrs"
        },
        {
            "args": {
                "replacements": [["N", "opq"], ["O", "rst"], ["P", "%N%%O%"], ["Q", "%P%uvw"], ["R", "xyz%Q%"]],
                "text": "%R%"
            },
            "expected": "xyzopqrstuvw"
        },
        {
            "args": {
                "replacements": [["G", "ghi"], ["H", "%I%jkl"], ["I", "mnop"], ["J", "%G%%H%"], ["K", "qrst"], ["L", "%K%uvw"]],
                "text": "%J%_%L%"
            },
            "expected": "ghimnopjkl_qrstuvw"
        }
    ];
