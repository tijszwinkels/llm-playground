import React, { useState, useRef, useEffect } from 'react';
import Collapsible from 'react-collapsible';
import Model from './models/Model';
import OpenAICompletionsApi from './models/OpenAICompletionsApi';
import OpenAIChatApi from './models/OpenAIChatApi';
import KoboldAiHorde from './models/KoboldAiHorde';
import PetalsChatApi from './models/PetalsChatApi';
import JsModelWrapper from './models/JsModelWrapper';
import ModelSettings from './ModelSettings';
import './Playground.css';

function Playground() {
    // Array of Model
    const models = [
        // gpt-3.5-turbo

        new JsModelWrapper(new OpenAIChatApi()),
        new JsModelWrapper(new OpenAICompletionsApi("text-davinci-003")),
        new JsModelWrapper(new OpenAICompletionsApi("code-davinci-002")),
        new JsModelWrapper(new KoboldAiHorde("Facebook/LLaMA-7b")),
        new JsModelWrapper(new KoboldAiHorde("Facebook/LLaMA-13b")),
        new JsModelWrapper(new KoboldAiHorde("Facebook/LLaMA-30b")),
        new JsModelWrapper(new KoboldAiHorde("Facebook/LLaMA-63b")),
        //new JsModelWrapper(new PetalsChatApi("bigscience/bloomz-petals")),
        //new JsModelWrapper(new PetalsChatApi("bigscience/bloom-petals")),
        new OpenAICompletionsApi("text-davinci-003"),
        new OpenAIChatApi(),
        new KoboldAiHorde("Facebook/LLaMA-7b"),
        new KoboldAiHorde("Facebook/LLaMA-13b"),
        new KoboldAiHorde("Facebook/LLaMA-30b"),
        new KoboldAiHorde("Facebook/LLaMA-63b"),
        //new PetalsChatApi("bigscience/bloomz-petals"),
        //new PetalsChatApi("bigscience/bloom-petals")
        // new JsModelWrapper(new PetalsChatApi("bigscience/bloomz-petals")),
        // new JsModelWrapper(new PetalsChatApi("bigscience/bloom-petals")),
    ];

    const [generating, setGenerating] = useState(false);
    const [text, setText] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [curModel, setCurModel]  = useState(models[0]);
    const apiKeyStorageKey = 'openai-api-key';
    const accessTokenStorageKey = 'chatgpt-access-token';
    const textRef = useRef();

    let selectedModelStorageKey = 'selected-model';


    useEffect(() => {
        // @ts-ignore
        textRef.current = text;
    }, [text]);


    // Run on startup
    useEffect(() => {
        // Retrieve the default start-text from the model
        setText(curModel.preamble);
        // Retrieve api-key from local storage
        let apiKey = localStorage.getItem(apiKeyStorageKey);
        if (apiKey && apiKey !== "") {
            setApiKey(apiKey);
        }
        let accessToken = localStorage.getItem(accessTokenStorageKey);
        if (accessToken && accessToken !== "") {
            setAccessToken(accessToken);
        }
        let selectedModelIndex = localStorage.getItem(selectedModelStorageKey);
        if (selectedModelIndex) {
            setCurModel(models[parseInt(selectedModelIndex)]);
        }
    }, []);

    // apiKey changed
    useEffect(() => {
        if (apiKey !== "") {
            localStorage.setItem(apiKeyStorageKey, apiKey);
            if (curModel.name.indexOf("KoboldAI Horde") === -1) { // TODO: Nicer way to check this
                curModel.apiKey = apiKey;
            }
        }
    }, [apiKey]);

    // accessToken changed
    useEffect(() => {
        if (accessToken !== "") {
            localStorage.setItem(accessTokenStorageKey, accessToken);
            if (curModel.name.indexOf("KoboldAI Horde") !== -1) { // TODO: Nicer way to check this
                curModel.apiKey = accessToken;
            }
        }
    }, [accessToken]);

    // curModel changed
    useEffect(() => {
        if ((curModel.name.indexOf("OpenAI") !== -1) || (curModel.name.indexOf("ChatGPT") !== -1)) { // TODO: Nicer way to check this
            curModel.apiKey = apiKey;
        } else if (curModel.name.indexOf("KoboldAI Horde") !== -1) { // TODO: Nicer way to check this
            curModel.apiKey = accessToken;
        }
    }, [curModel]);


    const onGenerate = () => {
        const start = Date.now();
        setGenerating(true);
        console.log('Generating...');
        curModel.generate_streaming(text, (data) => {setText(data)}).then( (response: string) => {
            setText(response);
            setGenerating(false);
            console.log(`Took ${Date.now() - start}ms`);
        });
    };

    const onStopGenerate = () => {
        setGenerating(false);
    };

    const onSettingsClick = () => {
        setShowSettings(!showSettings);
    };

    const onCloseSettings = () => {
        setShowSettings(false);
    };

    const handleKeyDown = ( event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.ctrlKey && event.shiftKey) {
            if (event.key === "Enter") {
                onGenerate();
            } if (event.key === "X") {
                if (curModel instanceof JsModelWrapper) {
                    setText(text + curModel.warning);
                }
            }
        }
    };

    return (
        <div className="playground-container" onKeyDown={handleKeyDown}>
            <header>
                <h1 className="title">Playground</h1>
            </header>

            <Collapsible trigger="Instructions (Click to Show)"
                         triggerWhenOpen="Instructions (Click to Hide)"
                         transitionTime={100}>
                <div className="instructions">
                    Fill out your query next to the "User:" prompt<br/>
                    Click the "Generate" button to generate text.<br/><br/>
                    If there's a js``` code-block in the text, a warning will be shown in the textbox.<br/>
                    If you click "Generate" again, the code-block will be executed and the results will be pasted in the text-box.<br/>
                    <ul>
                        <li>Anything you enter can be stored by the api provider and/or the creators of this software and might be shared as part of public datasets.</li>
                        <li>Don't enter any credentials or private data</li>
                        <li>Use this tool ethically and responsibly</li>
                        <li>Make sure you understand what the js-code does before executing it</li>
                        <li>Have fun! :)</li>
                    </ul>
                    Obtain an api-key at: <a href="https://platform.openai.com/account/api-keys">platform.openai.com/account/api-keys</a> - Click the cog icon to configure the api-key.<br/>
                    More information on: <a href="https://github.com/tijszwinkels/llm-playground/tree/jsEval">github.com/tijszwinkels/llm-playground/tree/jsEval</a><br/><br/>
                    Moved from unofficial ChatGPT api to the officially available text-davinci-003 model. Please be aware that usage will be billed by OpenAI!
                </div>
            </Collapsible>

            <div className="dropdown-container">
                <label htmlFor="model-select">Model:</label>
                <select
                    id="model-select"
                    onChange={e => {
                        const newModel = models[parseInt(e.target.value)];
                        if (text === curModel.preamble) {
                            setText(newModel.preamble)
                        }
                        setCurModel(newModel);
                    }}
                >
                    {models.map((item, index) => (
                        <option key={item.name} value={index}>
                            {item.name}
                        </option>
                    ))}
                </select>
                <div onClick={() => setShowSettings(!showSettings)} className="settings-icon">
                    &#9881;
                </div>
                {showSettings ? (
                    <div className="popup">
                        <ModelSettings
                            apiKey={apiKey}
                            setApiKey={setApiKey}
                            accessToken={accessToken}
                            setAccessToken={setAccessToken}
                            onClose={() => setShowSettings(false)}
                        />
                    </div>
                ) : null}
            </div>
            <div className="textbox-container">
                <textarea
                    className="textbox"
                    value={text}
                    onChange={e => {if (!generating) setText(e.target.value)} }
                    readOnly={generating}
                    disabled={generating}
                />
            </div>
            {generating ? (
                <button onClick={onStopGenerate}>Generating ...</button>
            ) : (
                <button onClick={onGenerate}>Generate</button>
            )}
        </div>
    );
}

export default Playground;
