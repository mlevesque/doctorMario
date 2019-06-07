interface IInputSet {
    previous: boolean;
    current: boolean;
}

export interface IInputActions {
    [inputType: string]: IInputSet;
}
