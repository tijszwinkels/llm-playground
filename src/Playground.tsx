import React, { useState, useEffect } from 'react';
import Collapsible from 'react-collapsible';
import ChatGpt from './models/ChatGpt';
import ModelSettings from './ModelSettings';
import './Playground.css';

function Playground() {
    const [model, setModel] = useState('');
    const [generating, setGenerating] = useState(false);
    const [text, setText] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [curModel, setCurModel]  = useState(new ChatGpt());
    let apiKeyStorageKey = curModel.name + '-api-key';

    useEffect(() => {
        if (apiKey !== "") {
            localStorage.setItem(apiKeyStorageKey, apiKey);
            curModel.apiKey = apiKey;
        }
    }, [apiKey, apiKeyStorageKey, curModel]);

    useEffect(() => {
        // Retrieve the default start-text from the model
        setText(curModel.preamble);
        // Retrieve api-key from local storage
        let apiKey = localStorage.getItem(apiKeyStorageKey);
        if (apiKey && apiKey !== "") {
            setApiKey(apiKey);
        }
    }, []);

    const onGenerate = () => {
        const start = Date.now();
        setGenerating(true);
        console.log('Generating...');
        curModel.generate(text).then((response : string) => {
            // console.log(response);
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
                    <ul>
                        <li>Anything you enter can be stored by the api provider and/or the creators of this software and might be shared as part of public datasets.</li>
                        <li>Don't enter any credentials or private data</li>
                        <li>Use this tool ethically and responsibly</li>
                        <li>Have fun! :)</li>
                    </ul>
                    Obtain an api-key at: <a href="https://platform.openai.com/account/api-keys">platform.openai.com/account/api-keys</a> - Click the cog icon to configure the api-key.<br/>
                    More information on: <a href="https://github.com/tijszwinkels/llm-playground">github.com/tijszwinkels/llm-playground</a>
                </div>
            </Collapsible>
            <div className="dropdown-container">
                <label htmlFor="model-select">Model:</label>
                <select
                    id="model-select"
                    value={model}
                    onChange={e => setModel(e.target.value)}
                >
                    <option value="">{curModel.name}</option>
                </select>
                <div onClick={() => setShowSettings(!showSettings)} className="settings-icon">
                    &#9881;
                </div>
                {showSettings ? (
                    <div className="popup">
                        <ModelSettings
                            apiKey={apiKey}
                            setApiKey={setApiKey}
                            onClose={() => setShowSettings(false)}
                        />
                    </div>
                ) : null}
            </div>
            <div className="textbox-container">
                <textarea
                    className="textbox"
                    value={text}
                    onChange={e => setText(e.target.value)}
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
