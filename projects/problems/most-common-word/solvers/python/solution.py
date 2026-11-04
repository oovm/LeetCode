import re


class Solution:
    def mostCommonWord(self, paragraph, banned):
        banned_set = {word.lower() for word in banned}
        counts = {}
        best = ""
        best_count = 0
        for word in re.findall(r"[a-zA-Z]+", paragraph.lower()):
            if word in banned_set:
                continue
            counts[word] = counts.get(word, 0) + 1
            if counts[word] > best_count:
                best_count = counts[word]
                best = word
        return best
