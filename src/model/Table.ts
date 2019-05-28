
/**
 * Class for organizing some type of data into a table.
 */
export class Table<T> {
    private m_width: number;
    private m_height: number;
    private m_grid: T[][];
    private m_invalidValue: T;

    public get width(): number {return this.m_width;}
    public get height(): number {return this.m_height;}
    public get rawGrid(): T[][] {return this.m_grid;}
    
    public isOutOfBounds(x:number, y:number): boolean {
        return y < 0 || x < 0 || x >= this.m_width || y >= this.m_height;
    }
    public getValue(x: number, y: number): T {
        if (this.isOutOfBounds(x, y)) {
            return this.m_invalidValue;
        }
        return this.m_grid[y][x];
    }
    public setValue(x: number, y: number, value: T): void {
        if (!this.isOutOfBounds(x, y)) {
            this.m_grid[y][x] = value;
        }
    }

    constructor(width: number, height: number, invalidValue?: T) {
        this.m_width = width;
        this.m_height = height;
        this.m_grid = new Array<T[]>(height);
        this.m_invalidValue = invalidValue;
        for (let index = 0; index < height; ++index) {
            this.m_grid[index] = new Array<T>(width);
        }
    }
}
