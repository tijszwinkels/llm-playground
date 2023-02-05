interface Model {
    readonly name: string;
    readonly preamble: string;
    apiKey: string;
    generate(input: string): Promise<string>;
}

export default Model;