import Model from './Model';

const url = "https://api.openai.com/v1/completions";
const apiKeyError = "\n\nError: API key not set. Please set the API key by clicking the cog next to the model.\n" +
    "Don't have an api-key? Get it here: https://platform.openai.com/account/api-keys\n";
const name = "OpenAI";

class OpenAICompletionsApi implements Model {
    readonly name;
    apiKey: string = "";
    modelName: string = "";

    preamble: string = "You are ChatGPT, a helpful and powerful large language model. Answer concisely.\n\n";

    constructor(modelName: string) {
        this.modelName = modelName;
        this.name = name + " " + modelName;
    }

    async generate(input: string): Promise<string> {
        if (this.apiKey === "") {
            return input + apiKeyError;
        }
        // Chance is pretty low, but prevent the api-key from leaking.
        input = input.replace(this.apiKey, "<api-key>");

        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${this.apiKey}`,
            },
            body:
                JSON.stringify({
                    model: this.modelName,
                    prompt: input,
                    max_tokens: 1024,
                    temperature: 0.8,
                    stop: ["User:", "output"],
                }, null, 2),
        };

        try {
            const response = await fetch(url, init);
            const json = await response.json();
            if (json.usage) {
                console.log(json.usage);
            }
            if (json.choices) {
                let output = json.choices[0].text;
                return input + output;
            } else if (json.error) {
                throw json.error;
            }
            return input;
        } catch (error : any) {
            console.error(error);
            return input + `\n\nError occurred while querying api: ${JSON.stringify(error, null, 2)}\n`+
                `Please remove this error message before retrying.\n`;
        }
    }
}

export default OpenAICompletionsApi;