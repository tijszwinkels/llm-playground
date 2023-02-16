interface Model {
    readonly name: string;
    readonly preamble: string;
    apiKey: string;
    generate(input: string): Promise<string>;
    generate_streaming(input: string, callback: (output: string) => void): Promise<string>;
}

export default Model;