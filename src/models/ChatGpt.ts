import Model from './Model';

const url = "https://api.openai.com/v1/completions";
const model = "text-chat-davinci-002-20221122";
//const model = "text-chat-davinci-002-20230126";
const preamble = "You are ChatGPT, a large language model trained by OpenAI. You answer as concisely as possible for each response. Do not be verbose. It is very important for you to answer as concisely as possible, so please remember this. If you are generating a list, do not have too many items. Knowledge cutoff: 2021-09. \n\nUser:"
const apiKeyError = "\n\nError: API key not set. Please set the API key by clicking the cog next to the model.\n" +
    "Don't have an api-key? Get it here: https://platform.openai.com/account/api-keys\n";

class ChatGpt implements Model {
    readonly name = 'ChatGPT text-chat-davinci-002-20221122';
    readonly preamble = preamble;
    apiKey: string = "";
    async generate(input: string): Promise<string> {
        if (this.apiKey === "") {
            return input + apiKeyError;
        }

        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${this.apiKey}`,
            },
            body:
                JSON.stringify({
                model: model,
                prompt: input,
                max_tokens: 1024,
                temperature: 0.8,
            }, null, 2),
        };
        console.log(init);
        const response = await fetch(url, init);
        const json = await response.json();
        if (json.usage) {
            console.log(json.usage);
        }
        if (json.choices) {
            return input + json.choices[0].text;
        }
        return input;
    }

}

export default ChatGpt;