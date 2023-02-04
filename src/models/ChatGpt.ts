import Model from './Model';

const openAiApiKey = "xxx";
const url = "https://api.openai.com/v1/completions";
const model = "text-chat-davinci-002-20221122";
//const model = "text-chat-davinci-002-20230126";
const preamble = "You are ChatGPT, a large language model trained by OpenAI. You answer as concisely as possible for each response. Do not be verbose. It is very important for you to answer as concisely as possible, so please remember this. If you are generating a list, do not have too many items. Knowledge cutoff: 2021-09. \n\nUser:"

class ChatGpt implements Model {
    readonly name = 'ChatGPT text-chat-davinci-002-20221122';
    readonly preamble = preamble;
    async generate(input: string): Promise<string> {

        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${openAiApiKey}`,
            },
            body:
                JSON.stringify({
                model: model,
                prompt: input,
                max_tokens: 1024,
                temperature: 0.5,
            }, null, 2),
        };
        console.log(init);
        const response = await fetch(url, init);
        const json = await response.json();
        if (json.usage) {
            console.log(json.usage);
        }
        if (json.choices) {
            return json.choices[0].text;
        }
        return "";
    }

}

export default ChatGpt;