import Model from './Model';

//const url = "https://cors.tinkertankai.eu/http://chat.petals.ml/api/v1/generate";
const url = "http://tinkertankai.eu:5000/api/v1/generate";
//const ws_url = "ws://tinkertankai.eu:5000/api/v2/generate";
const ws_url = "ws://chat.petals.ml/api/v2/generate";

const generationParams = {
    do_sample: 1,
    temperature: 0.9,
    top_k: 40,
};

/**
 * This API uses an open API from the Petals project.
 * This is an awesome project wich runs 175b parameter LLMs on crowdsourced GPU's, so we can play with them.
 * Please consider adding your own GPU to the pool.
 *
 * See: https://github.com/bigscience-workshop/petals/
 */
class PetalsChatApi implements Model {
    readonly name;
    apiKey: string = "";
    modelName: string = "";

    preamble: string = "A human talks to a powerful, helpful AI that follows the human's instructions.\n\n" +
        "Human: Hi!\n" +
        "AI: Hi! How can I help you?\n" +
        "Human: ";

    constructor(modelName: string) {
        this.modelName = modelName;
        this.name = modelName;
    }

    async generate(input: string): Promise<string> {

        const formData = new URLSearchParams();
        formData.append('model', this.modelName);
        formData.append('inputs', input);
        formData.append('do_sample', '1');
        formData.append('max_new_tokens', '512');
        formData.append('temperature', '0.8');
        const init = {
            method: 'POST',
            headers: {
                //'Content-Type': 'application/json',
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
        };

        try {
            const response = await fetch(url, init);
            const json = await response.json();
            if (json.outputs) {
                let output = json.outputs;
                return input + output;
            } else if (json.error) {
                throw json.error;
            }
            return input;
        } catch (error : any) {
            console.error(error);
            // TODO: Host on api with CORS headers, or at least own CORS proxy.
            return input + `\n\nError occurred while querying api: ${JSON.stringify(error, null, 2)}\n`+
                `Please remove this error message before retrying.\n\n` +
                `Please note, this api is currently using a proxy to bypass CORS restrictions.\n` +
                `Go to https://cors-anywhere.herokuapp.com to enabled it\n`
        }
    }

    generate_streaming(input: string, callback: (output: string) => void): Promise<string> {
        //return this.generate(input);
        let context = {
            input : input,
            fullText: input,
            newText: "",
        };
        return new Promise<string>((resolve, reject) => {
            let ws = new WebSocket(ws_url);
            ws.onopen = () => {
                console.log("Connected to websocket");
                ws.send(JSON.stringify({type: "open_inference_session", model: this.modelName, max_length: 2048}));
                console.log("Sent open_inference_session");
                ws.send(JSON.stringify({
                    type: "generate",
                    inputs: input,
                    max_new_tokens: 1,
                    stop_sequence: "</s>",
                    extra_stop_sequences: ["\n\nHuman:"],
                    ...generationParams
                }));
                console.log("Sent generate");
                ws.onmessage = event => {
                    console.log("Received message");
                    const response = JSON.parse(event.data);

                    // Everything ok?
                    if (!response.ok) {
                        console.error(response.traceback);
                        resolve(context.fullText + "\n\nError while querying api: " + response.traceback);
                        return;
                    }

                    if (!response.stop) {
                        if (response.outputs) {
                            // Process new text
                            context.newText += response.outputs
                            console.log(response.outputs);
                            context.fullText = context.input + context.newText;
                            callback(context.fullText);
                        }
                    } else {
                        // Stop condition
                        resolve(context.fullText);
                    }
                };
            };
        });
    }
}

export default PetalsChatApi;