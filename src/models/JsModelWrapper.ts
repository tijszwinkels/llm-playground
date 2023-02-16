import Model from './Model';

const preamble =
    "Whenever you give a ```js code-block, I will execute this with eval() and paste the result back to you. Use javascript that can run inside the browser. Make sure to not use console.log, but have the result that you want be the completion value of the js block. Remember that if the final result is a promise, assign it to the already existing `ASYNC_EVAL` variable.\n\n" +
    "For any calculations, don't try to give a result, but write javascript code in a ```js code-block to solve the problem instead. Using this, you can fetch external data. If doing so, use fetch and not axios. Prefer public api's that do not require an api key. The result of a fetch is a promise, so assign these to the `ASYNC_EVAL` variable.\n\n" +
    "User:";
const warning = "\nWARNING: Clicking generate will execute above JS code! - Please be careful!";
const jsConsoleCapture = "";//"console.oldLog = console.log; console.log = function(value) { console.oldLog(value); return value;}; console.error = console.log;\n\n";
const name = "jsEval";

class JsModelWrapper implements Model {
    readonly name: string;
    readonly preamble : string;
    readonly warning = warning;
    apiKey: string = "";

    innerModel: Model;

    constructor(innerModel: Model) {
        this.innerModel = innerModel;
        this.name = innerModel.name + " " + name;
        this.preamble = innerModel.preamble + preamble;
    }

    async executeJs(input: string): Promise<string> {
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
        return input;
    }
    async generate(input: string): Promise<string> {
        this.innerModel.apiKey = this.apiKey;

        input = await this.executeJs(input);

        // Let the inner model generate the response
        let output = await this.innerModel.generate(input);
        let newOut = output.replace(input, "");
        if (newOut.indexOf("```js") !== -1) {
            // Add the warning if the response contains js-code
            output += warning;
        }

        return output;
    }

    async generate_streaming(input: string, callback: (output: string) => void): Promise<string> {
        this.innerModel.apiKey = this.apiKey;
        input = await this.executeJs(input);
        return this.innerModel.generate_streaming(input, callback).then((output: string) => {   
            let newOut = output.replace(input, "");
            if (newOut.indexOf("```js") !== -1) {
                // Add the warning if the response contains js-code
                output += warning;
            }
            return output;
        });
    }
}

export default JsModelWrapper;