// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "s": "eight8 seven7 six6 five5 four4 three3 two2 one1"
            },
            "expected": "one two three four five six seven eight"
        },
        {
            "args": {
                "s": "seven7 six6 five5 four4 three3 two2 one1"
            },
            "expected": "one two three four five six seven"
        },
        {
            "args": {
                "s": "nine9 eight8 seven7 six6 five5 four4 three3 two2 one1"
            },
            "expected": "one two three four five six seven eight nine"
        },
        {
            "args": {
                "s": "three3 two2 one1"
            },
            "expected": "one two three"
        },
        {
            "args": {
                "s": "is2 sentence4 This1 a3"
            },
            "expected": "This is a sentence"
        },
        {
            "args": {
                "s": "five5 four4 three3 two2 one1"
            },
            "expected": "one two three four five"
        },
        {
            "args": {
                "s": "A9 B8 C7 D6 E5 F4 G3 H2 I1"
            },
            "expected": "I H G F E D C B A"
        },
        {
            "args": {
                "s": "Myself2 Me1 I4 and3"
            },
            "expected": "Me Myself and I"
        },
        {
            "args": {
                "s": "six6 five5 four4 three3 two2 one1"
            },
            "expected": "one two three four five six"
        },
        {
            "args": {
                "s": "one1"
            },
            "expected": "one"
        },
        {
            "args": {
                "s": "two1 one2"
            },
            "expected": "two one"
        },
        {
            "args": {
                "s": "four4 three3 two2 one1"
            },
            "expected": "one two three four"
        },
        {
            "args": {
                "s": "quick5 brown3 fox2 jumps9 over8 lazy4 the7 dog6 a1"
            },
            "expected": "a fox brown lazy quick dog the over jumps"
        },
        {
            "args": {
                "s": "Quick5 brown4 fox3 jumps2 over1"
            },
            "expected": "over jumps fox brown Quick"
        },
        {
            "args": {
                "s": "big2 bigger3 biggest1"
            },
            "expected": "biggest big bigger"
        },
        {
            "args": {
                "s": "a1 bc2 def3 ghij4 klmno5 pqrstu6 vwxyz7 abcdefg8 hijklmno9"
            },
            "expected": "a bc def ghij klmno pqrstu vwxyz abcdefg hijklmno"
        },
        {
            "args": {
                "s": "abc1 def2 ghi3 jkl4 mno5 pqr6 stu7 vwx8 yza9"
            },
            "expected": "abc def ghi jkl mno pqr stu vwx yza"
        },
        {
            "args": {
                "s": "Data2 Science1"
            },
            "expected": "Science Data"
        },
        {
            "args": {
                "s": "Quick5 Brown4 Fox3 Jumps2 Over1"
            },
            "expected": "Over Jumps Fox Brown Quick"
        },
        {
            "args": {
                "s": "Digital2 Transformation1"
            },
            "expected": "Transformation Digital"
        },
        {
            "args": {
                "s": "zebra9 yellow8 xenon7 winter6 volcano5 umbrella4 tornado3 storm2 rainbow1"
            },
            "expected": "rainbow storm tornado umbrella volcano winter xenon yellow zebra"
        },
        {
            "args": {
                "s": "short1 longerWord2 evenLongerWord3"
            },
            "expected": "short longerWord evenLongerWord"
        },
        {
            "args": {
                "s": "one9 two8 three7 four6 five5 six4 seven3 eight2 nine1"
            },
            "expected": "nine eight seven six five four three two one"
        },
        {
            "args": {
                "s": "apple8 banana7 cherry6 date5 elderberry4 fig3 grape2 huckleberry1"
            },
            "expected": "huckleberry grape fig elderberry date cherry banana apple"
        },
        {
            "args": {
                "s": "apple9 banana8 cherry7 date6 elderberry5 fig4 grape3 honeydew2 ice1"
            },
            "expected": "ice honeydew grape fig elderberry date cherry banana apple"
        },
        {
            "args": {
                "s": "MixedCASE1 Word2 with3 DIFFERENT4 cases5"
            },
            "expected": "MixedCASE Word with DIFFERENT cases"
        },
        {
            "args": {
                "s": "Python1 is2 great3"
            },
            "expected": "Python is great"
        },
        {
            "args": {
                "s": "a9 b8 c7 d6 e5 f4 g3 h2 i1"
            },
            "expected": "i h g f e d c b a"
        },
        {
            "args": {
                "s": "single1"
            },
            "expected": "single"
        },
        {
            "args": {
                "s": "one1 two2 three3 four4 five5 six6 seven7 eight8 nine9"
            },
            "expected": "one two three four five six seven eight nine"
        },
        {
            "args": {
                "s": "reverse9 order8 words7 in6 a5 sentence4 for3 testing2 purposes1"
            },
            "expected": "purposes testing for sentence a in words order reverse"
        },
        {
            "args": {
                "s": "sun8 moon7 stars6 galaxy5 universe4 planets3 asteroid2 comet1"
            },
            "expected": "comet asteroid planets universe galaxy stars moon sun"
        },
        {
            "args": {
                "s": "two2 one1 three3 four4 five5 six6 seven7 eight8 nine9"
            },
            "expected": "one two three four five six seven eight nine"
        },
        {
            "args": {
                "s": "complex1 testing2 cases3 with4 multiple5 digits6 and7 shuffled8 order9"
            },
            "expected": "complex testing cases with multiple digits and shuffled order"
        },
        {
            "args": {
                "s": "Sustainability1"
            },
            "expected": "Sustainability"
        },
        {
            "args": {
                "s": "Hard2 Work3 Makes1 Success4"
            },
            "expected": "Makes Hard Work Success"
        },
        {
            "args": {
                "s": "A5 B4 C3 D2 E1 F6 G7 H8 I9"
            },
            "expected": "E D C B A F G H I"
        },
        {
            "args": {
                "s": "Alphabetically9 Better8 Christmas7 Does6 Everyone5 Feel4 Good3 Happy2 Indeed1"
            },
            "expected": "Indeed Happy Good Feel Everyone Does Christmas Better Alphabetically"
        },
        {
            "args": {
                "s": "sun9 moon8 star7 planet6 comet5 asteroid4 meteor3 satellite2 galaxy1"
            },
            "expected": "galaxy satellite meteor asteroid comet planet star moon sun"
        },
        {
            "args": {
                "s": "The9 quick8 brown7 fox6 jumps5 over4 lazy3 dog2 one1"
            },
            "expected": "one dog lazy over jumps fox brown quick The"
        },
        {
            "args": {
                "s": "short6 longer5 very4 much3 more2 words1"
            },
            "expected": "words more much very longer short"
        },
        {
            "args": {
                "s": "first1 second2 third3 fourth4 fifth5 sixth6 seventh7 eighth8 ninth9"
            },
            "expected": "first second third fourth fifth sixth seventh eighth ninth"
        },
        {
            "args": {
                "s": "Two2 Words1"
            },
            "expected": "Words Two"
        },
        {
            "args": {
                "s": "Complicated1 Sorting2 becomes3 significantly4 more5 challenging6 when7 words8 overlap9"
            },
            "expected": "Complicated Sorting becomes significantly more challenging when words overlap"
        },
        {
            "args": {
                "s": "zZ9 yY8 xX7 wW6 vV5 uU4 tT3 sS2 rR1"
            },
            "expected": "rR sS tT uU vV wW xX yY zZ"
        },
        {
            "args": {
                "s": "A9 lot8 of7 testing6 needs5 to4 be3 done2 always1"
            },
            "expected": "always done be to needs testing of lot A"
        },
        {
            "args": {
                "s": "z9 y8 x7 w6 v5 u4 t3 s2 r1"
            },
            "expected": "r s t u v w x y z"
        },
        {
            "args": {
                "s": "twoWords2 oneWord1"
            },
            "expected": "oneWord twoWords"
        },
        {
            "args": {
                "s": "ab9 cd8 ef7 gh6 ij5 kl4 mn3 op2 qr1"
            },
            "expected": "qr op mn kl ij gh ef cd ab"
        },
        {
            "args": {
                "s": "Open3 Source2 Software1"
            },
            "expected": "Software Source Open"
        },
        {
            "args": {
                "s": "a9 quick8 brown7 fox6 jumps5 over4 lazy3 dogs2 one1"
            },
            "expected": "one dogs lazy over jumps fox brown quick a"
        },
        {
            "args": {
                "s": "aA9 bB8 cC7 dD6 eE5 fF4 gG3 hH2 iI1"
            },
            "expected": "iI hH gG fF eE dD cC bB aA"
        },
        {
            "args": {
                "s": "shuffle7 sentence6 original5 reconstruct4 and3 a2 is1"
            },
            "expected": "is a and reconstruct original sentence shuffle"
        },
        {
            "args": {
                "s": "shuffle9 words8 correctly7 to6 get5 the4 right3 order2 one1"
            },
            "expected": "one order right the get to correctly words shuffle"
        },
        {
            "args": {
                "s": "HELLO1 woRLD2"
            },
            "expected": "HELLO woRLD"
        },
        {
            "args": {
                "s": "Short1 words2 can3 also4 be5 tricky6"
            },
            "expected": "Short words can also be tricky"
        },
        {
            "args": {
                "s": "Python3 Java2 C1 Ruby4 Go5"
            },
            "expected": "C Java Python Ruby Go"
        },
        {
            "args": {
                "s": "mixed8 case7 word6 CASE5 Mixed4 CASE3 mixed2 CASE1"
            },
            "expected": "CASE mixed CASE Mixed CASE word case mixed"
        },
        {
            "args": {
                "s": "Python3 Java2 C1"
            },
            "expected": "C Java Python"
        },
        {
            "args": {
                "s": "This8 is7 a6 sample5 sentence4 with3 various2 words1"
            },
            "expected": "words various with sentence sample a is This"
        },
        {
            "args": {
                "s": "ninja9 samurai8 katana7 wakizashi6 tanto5 yoroi4 kusarigama3 tsurugi2 ninja1"
            },
            "expected": "ninja tsurugi kusarigama yoroi tanto wakizashi katana samurai ninja"
        },
        {
            "args": {
                "s": "alpha9 beta8 gamma7 delta6 epsilon5 zeta4 eta3 theta2 iota1"
            },
            "expected": "iota theta eta zeta epsilon delta gamma beta alpha"
        },
        {
            "args": {
                "s": "zebra9 yak8 xenon7 wolf6 vulture5 unicorn4 tiger3 snake2 rabbit1"
            },
            "expected": "rabbit snake tiger unicorn vulture wolf xenon yak zebra"
        },
        {
            "args": {
                "s": "reverse9 order8 words7 in6 this5 shuffled4 sentence3 into2 proper1"
            },
            "expected": "proper into sentence shuffled this in words order reverse"
        },
        {
            "args": {
                "s": "Single1"
            },
            "expected": "Single"
        }
    ];
