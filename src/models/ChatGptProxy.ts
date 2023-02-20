import Model from './Model';
// @ts-ignore
import { SSE } from "sse";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'

// Thanks to https://github.com/transitive-bullshit/chatgpt-api
const url = "https://cors.tinkertankai.eu/https://chat.duti.tech/api/conversation";
const apiKeyError = "\n\nError: API key not set. Please set the API key by clicking the cog next to the model.\n" +
    "The ChatGPT Proxy requires the ChatGPT access token. Look here to learn how to obtain it: https://github.com/transitive-bullshit/chatgpt-api#access-token\n";
const name = "ChatGPT Proxy";

class ChatGPTProxy implements Model {
    readonly name;
    apiKey: string = "";
    modelName: string = "";

    preamble: string = "";

    constructor(modelName: string = "text-davinci-002-render-sha") {
        this.modelName = modelName;
        this.name = name + " " + modelName;
    }

    async generate(input: string): Promise<string> {
        // Not implemented
        throw new Error("Method not implemented.");
    }

    private populateInit(input: string) {
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${this.apiKey}`,
            },
            body:
                JSON.stringify({
                    action: "next",
                    model: this.modelName,
                    parent_message_id: uuidv4(),
                    messages: [
                        {
                            // Generate Random uuid
                            id: uuidv4(),
                            role: 'user',
                            content: {
                                content_type: 'text',
                                parts: [input]
                            }
                        }
                    ],

                }, null, 2),
        };
        return init;
    }

    async generate_streaming(input: string, callback: (output: string) => void) : Promise<string>{
        let context = {
            input: input,
            newTextStart: "\nChatGPT: ",
            newText: ""
        };
        return new Promise<string>((resolve, reject) => {
            console.log(`${this.name} generate_streaming`);
            if (this.apiKey === "") {
                resolve(input + apiKeyError);
            }
            // Chance is pretty low, but prevent the api-key from leaking.
            input = input.replace(this.apiKey, "<api-key>");

            const init = this.populateInit(input);
            try {
                let eventSource = new SSE(url, {
                    headers: init.headers,
                    method: init.method,
                    payload: init.body,
                });

                eventSource.addEventListener('message', (e: any) => {
                    if (e.data != "[DONE]") {
                        //console.log(e);
                        let data : any = {};
                        try {
                            data = JSON.parse(e.data);
                        } catch {
                            console.error(`Error parsing JSON ${e.data}`);
                            return;
                        }
                        //console.log(data);
                        const text = data.message.content.parts[0];
                        //console.log(text);
                        context.newText = text;
                        callback(context.input + context.newTextStart + context.newText);
                    } else {
                        eventSource.close();
                        resolve(context.input + context.newTextStart + context.newText);
                    }
                });
                eventSource.stream();
            } catch (error : any) {
                console.error(error);
                resolve(input + `\n\nError occurred while querying api: ${JSON.stringify(error, null, 2)}\n`+
                    `Configure an access token by clicking the cog. See https://github.com/transitive-bullshit/chatgpt-api#access-token for information on how to get an access token.\n` +
                    `Please remove this error message before retrying.\n`);
            }
        });

    }
}

export default ChatGPTProxy;