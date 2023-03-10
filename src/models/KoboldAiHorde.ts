import Model from './Model';
// @ts-ignore
import { SSE } from "sse";

const url = "https://horde.koboldai.net/api/v2/generate/text/async";
const statusUrl = "https://horde.koboldai.net/api/v2/generate/text/status/"
const apiKeyError = "\n\nError: API key not set. Please set the API key by clicking the cog next to the model.\n" +
    "Don't have an api-key? Get it here: https://platform.openai.com/account/api-keys\n";
const name = "KoboldAI Horde";

class KoboldAiHorde implements Model {
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

        const init = this.populateInit(input);

        try {
            const response: Response = await fetch(url, init);
            const json = await response.json();
            const id = json.id;
            const checkUrl = statusUrl + id;
            while (true) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const statusResponse = await fetch(checkUrl);
                const statusJson = await statusResponse.json();
                if (statusJson.done) {
                    console.log(statusJson);
                    console.log(statusJson.generations[0].text)
                    return input + statusJson.generations[0].text;
                }
            }
        } catch (error : any) {
            console.error(error);
            return input + `\n\nError occurred while querying api: ${JSON.stringify(error, null, 2)}\n`+
                `Please remove this error message before retrying.\n`;
        }
    }

    private populateInit(input: string) {
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: this.apiKey,
                'Client-Agent': 'tinkertankai.github.io/llm-playground/'
            },
            body:
                JSON.stringify({
                        prompt: input,
                        models: [this.modelName],
                        trusted_workers: false,
                        params: {
                            max_context_length: 1500,
                            max_length: 100,
                        }
                }, null, 2),
        };
        return init;
    }

    async generate_streaming(input: string, callback: (output: string) => void) : Promise<string>{
       return this.generate(input);

    }
}

export default KoboldAiHorde;