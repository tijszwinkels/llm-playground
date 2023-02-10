import Model from './Model';

const url = "https://cors-anywhere.herokuapp.com/http://chat.petals.ml/api/v1/generate";
//const url = "http://localhost:5000/api/v1/generate";

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
}

export default PetalsChatApi;