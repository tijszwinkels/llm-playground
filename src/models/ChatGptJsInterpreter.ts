import Model from './Model';

const openAiApiKey = "xxx";
const url = "https://api.openai.com/v1/completions";
const model = "text-chat-davinci-002-20221122";
//const model = "text-chat-davinci-002-20230126";
const preamble = "You are ChatGPT, a large language model trained by OpenAI. You answer as concisely as possible for each response. Do not be verbose. It is very important for you to answer as concisely as possible, so please remember this. If you are generating a list, do not have too many items. Knowledge cutoff: 2021-09. \n" +
    "\n" +
    "Whenever you give a ```js code-block, I will execute this with eval() and paste the result back to you. Use javascript that can run inside the browser. Make sure to not use console.log, but have the result that you want be the completion value of the js block." +
    " Remember that if the final result is a promise, assign it to the already existing `ASYNC_EVAL` variable.\n" +
    "\n" +
    "For any calculations, don't try to give a result, but write ```js code to solve the problem instead.  Using this, you can fetch external data. If doing so, use fetch and not axios. Prefer public api's that do not require an api key. The result of a fetch is a promise, so assign these to the `ASYNC_EVAL` variable.\n\n" +
    "User:";
const warning = "\nWARNING: Clicking generate will execute above JS code! - Please be careful!";
const jsConsoleCapture = "";//"console.oldLog = console.log; console.log = function(value) { console.oldLog(value); return value;}; console.error = console.log;\n\n";

class ChatGptJsInterpreter implements Model {
    readonly name = 'ChatGPT text-chat-davinci-002-20221122 jsEval';
    readonly preamble = preamble;
    async generate(input: string): Promise<string> {

        console.log(input);

        // Execute code as js if the warning is present.
        if (input.indexOf(warning) !== -1) {
            const jsStart = input.lastIndexOf("```js");
            const jsEnd = input.indexOf("```", jsStart + 5);
            const jsCode = input.substring(jsStart + 5, jsEnd);
            let jsOutput = "";
            if (jsCode) {
                console.log("Executing JS code: " + jsCode);

                try {
                    let ASYNC_EVAL = null;
                    jsOutput = "output: " + eval(jsConsoleCapture + jsCode);
                    if (ASYNC_EVAL) {
                        jsOutput += `\nASYNC_EVAL resolved output: ${await ASYNC_EVAL}`;
                    }
                    jsOutput += "\n\nUser: Please explain these results to me.";
                } catch (e) {
                    jsOutput = "error: " + e;
                    jsOutput += "\n\nUser: Could you fix this?";
                }
            }
            let output = input.replace(warning, "");
            return output + "\n" + jsOutput;
        }

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
                temperature: 0.8,
                stop: ["User:"],
            }, null, 2),
        };
        //console.log(init);
        const response = await fetch(url, init);
        const json = await response.json();
        if (json.usage) {
            console.log(json.usage);
        }
        if (json.choices) {
            let output = json.choices[0].text;
            if (output.indexOf("```js") !== -1) {
                output += warning;
            }
            return input + output;
        }
        return input;
    }

}

export default ChatGptJsInterpreter;