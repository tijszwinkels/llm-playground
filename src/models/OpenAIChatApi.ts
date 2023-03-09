import Model from './Model';
// @ts-ignore
import { SSE } from "sse";

const url = "https://api.openai.com/v1/chat/completions";
const apiKeyError = "\n\nError: API key not set. Please set the API key by clicking the cog next to the model.\n" +
    "Don't have an api-key? Get it here: https://platform.openai.com/account/api-keys\n";
const name = "ChatGPT";

class OpenAIChatApi implements Model {
    readonly name;
    apiKey: string = "";
    modelName: string = "";

    preamble: string = "You are ChatGPT, a helpful and powerful large language model. Prepend your answers with 'ChatGPT:'.\n\n";

    constructor(modelName: string = "gpt-3.5-turbo") {
        this.modelName = modelName;
        this.name = name + " " + modelName;
    }

    async generate(input: string): Promise<string> {
        return this.generate_streaming(input, (output: string) => {}); // Passthrough to generate_streaming
    }


    async generate_streaming(input: string, callback: (output: string) => void) : Promise<string>{
        console.log(`${this.name} generate_streaming`);
        let context = {fullText: input}
        return new Promise<string>((resolve, reject) => {

            if (this.apiKey === "") {
                resolve(input + apiKeyError);
            }
            // Chance is pretty low, but prevent the api-key from leaking.
            input = input.replace(this.apiKey, "<api-key>");

            let data = {
                model: this.modelName,
                messages: [{role: "user", content: input}],
                max_tokens: 1024,
                temperature: 0.8,
                stop: ["User:", "output"],
                stream: true,
            };

            try {
                let eventSource = new SSE(url, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                    method: "POST",
                    payload: JSON.stringify(data),
                });

                eventSource.addEventListener('message', (e: any) => {
                    if (e.data != "[DONE]") {
                        const data = JSON.parse(e.data);
                        //console.log(data);
                        const text: string = data.choices[0].delta.content;
                        if (text) {
                            console.log(text);
                            context.fullText += text;
                            callback(context.fullText);
                        }
                    } else {
                        eventSource.close();
                        resolve(context.fullText);
                    }
                });
                eventSource.stream();
            } catch (error : any) {
                console.error(error);
                resolve(input + `\n\nError occurred while querying api: ${JSON.stringify(error, null, 2)}\n`+
                    `Please remove this error message before retrying.\n`);
            }
        });

    }
}

export default OpenAIChatApi;