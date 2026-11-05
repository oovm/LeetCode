export class Solution {
    findDuplicate(paths: string[]): string[][] {
        const contents: string[] = [];
        const groups: string[][] = [];
        for (const entry of paths) {
            const [directory, ...files] = entry.split(" ");
            for (const file of files) {
                const open = file.indexOf("(");
                const close = file.indexOf(")", open);
                const name = file.slice(0, open);
                const content = file.slice(open + 1, close);
                const slot = contents.indexOf(content);
                if (slot < 0) {
                    contents.push(content);
                    groups.push([`${directory}/${name}`]);
                } else {
                    groups[slot].push(`${directory}/${name}`);
                }
            }
        }
        return groups.filter((group) => group.length > 1);
    }
}
