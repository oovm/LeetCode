export class Solution {
    isValidSerialization(preorder: string): boolean {
        let slots = 1;
        for (const node of preorder.split(',')) {
            if (slots === 0) {
                return false;
            }
            slots += node === '#' ? -1 : 1;
        }
        return slots === 0;
    }
}
