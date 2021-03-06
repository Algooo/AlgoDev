"use strict";

module Drawing {
    export class RgbaColor {
        public r: number;
        public g: number;
        public b: number;
        public a: number;

        constructor(r: number, g: number, b: number, a: number) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }

        public toString(): string {
            return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
        }
    }

    export class Point {
        public x: number;
        public y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
    }


    export class ColorStop {
        public offset: number;
        public color: string;

        constructor(offset: number, color: string) {
            this.offset = offset;
            this.color = color;
        }
    }

    export class Rectangle {
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        public color: string;

        constructor(x: number, y: number, width: number, height: number, color?: string) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            if (color != "") {
                this.color = color;
            }
            else {
                this.color = new RgbaColor(0, 0, 0, 1).toString();
            }
        }

        public stroke(context: CanvasRenderingContext2D) {
            context.save();
            context.beginPath();
            context.strokeStyle = this.color;
            context.lineWidth = 1;
            context.rect(this.x, this.y, this.width, this.height);
            context.stroke();
            context.restore();
        };
    }

    export class Arc {
        public x: number;
        public y: number;
        public color: string;

        constructor(x: number, y: number, color?: string) {
            this.x = x;
            this.y = y;
            if (color != "") {
                this.color = color;
            }
            else {
                this.color = new RgbaColor(0, 0, 0, 1).toString();
            }
        }

        public fill(context: CanvasRenderingContext2D) {
            context.save();
            context.beginPath();
            context.fillStyle = this.color;
            context.strokeStyle = this.color;
            context.lineWidth = 1;
            context.arc(this.x, this.y, 5, 0, (2 * Math.PI), false);
            context.fill();
            context.restore();
        };
    }

    export class BezierCurve {
        constructor() {
        }
        public CalculateCurrentBezierPoint = function (t: number, p0: Point, p1: Point, p2: Point, p3: Point) {
            var cX = 3 * (p1.x - p0.x),
                bX = 3 * (p2.x - p1.x) - cX,
                aX = p3.x - p0.x - cX - bX;

            var cY = 3 * (p1.y - p0.y),
                bY = 3 * (p2.y - p1.y) - cY,
                aY = p3.y - p0.y - cY - bY;

            var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
            var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

            return new Point(x, y);
        }
    }
}

export = Drawing;
