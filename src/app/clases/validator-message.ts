export interface ValidatorMessage {
    required: string;
    min: string;
    max: string;
    pattern: string;
    [key: string]: string;
}

