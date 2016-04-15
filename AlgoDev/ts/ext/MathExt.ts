"use strict";

class MathExt {

    public static half(num: number): number {
        return num / 2;
    }
    public static third(num: number): number {
        return num / 3;
    }
    public static quarter(num: number): number {
        return num / 4;
    }
    public static eighth(num: number): number {
        return num / 8;
    }
    public static sixteenth(num: number): number {
        return num / 16;
    }
}

export = MathExt;