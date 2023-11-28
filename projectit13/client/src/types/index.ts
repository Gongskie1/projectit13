import { ChangeEvent } from "react";

export interface CustomInputStyles {
    styles: string;
    placeholder?: string;
    type: string;
    name: string;
    values: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface CustomButtonStyles{
    styles: string;
    btnText: string;
    btntype: 'button' | 'submit';
}