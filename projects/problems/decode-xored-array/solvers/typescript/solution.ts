export class Solution {
    decode(encoded: number[], first: number): number[] {
        const n = encoded.length + 1;
        const arr: number[] = new Array(n);
        arr[0] = first;
        for (let i = 0; i < encoded.length; i++) {
            arr[i + 1] = arr[i] ^ encoded[i];
        }
        return arr;
    }
}
