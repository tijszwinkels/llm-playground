import Model from './Model';

const url = "https://cors-anywhere.herokuapp.com/https://chatgpt.hato.ai/completions";
//const url = "https://chatgpt.hato.ai/completions";
//const url = "https://chatgpt.pawan.krd/api/completions";
const apiKeyError = "\n\nError: API key not set. Please set the API key by clicking the cog next to the model.\n" +
    `Please note: This API needs the ChatGPT session's access token instead of the OpenAI Api key.\n`+
    `See https://github.com/waylaidwanderer/node-chatgpt-api#using-a-reverse-proxy for more information on how to obtain this.\n`;
const name = "ChatGPT Proxy";

class ChatGptProxy implements Model {
    readonly name;
    apiKey: string = "";
    modelName: string = "text-davinci-002-render";

    preamble: string = "You are ChatGPT, a helpful and powerful large language model. Answer concisely.\n\n";

    constructor() {
        this.name = name;
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
                `Please note: This API needs the ChatGPT session's access token instead of the OpenAI Api key.\n`+
                `See https://github.com/waylaidwanderer/node-chatgpt-api#using-a-reverse-proxy for more information.\n`;
        }
    }
}

export default ChatGptProxy;