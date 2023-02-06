import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import ChatGptJsInterpreter from './models/ChatGptJsInterpreter';
import Model from './models/Model';
import ModelSettings from './ModelSettings';
import './Playground.css';

function Playground() {
    const [model, setModel] = useState('');
    const [generating, setGenerating] = useState(false);
    const [text, setText] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [curModel, setCurModel]  = useState(new ChatGptJsInterpreter());
    let apiKeyStorageKey = curModel.name + '-api-key';

    const onGenerate = () => {
        const start = Date.now();
        setGenerating(true);
        console.log('Generating...');
        curModel.generate(text).then((response : string) => {
            // console.log(response);
            setText(text + response);
            setGenerating(false);
            console.log(`Took ${Date.now() - start}ms`);
        });
    };

    useEffect(() => {
        if (apiKey !== "") {
            localStorage.setItem(apiKeyStorageKey, apiKey);
            curModel.apiKey = apiKey;
        }
    }, [apiKey]);

    useEffect(() => {
        // Retrieve the default start-text from the model
        setText(curModel.preamble);
        // Retrieve api-key from local storage
        let apiKey = localStorage.getItem(apiKeyStorageKey);
        if (apiKey && apiKey !== "") {
            setApiKey(apiKey);
        }
    }, []);

    const onStopGenerate = () => {
        setGenerating(false);
    };

    const onSettingsClick = () => {
        setShowSettings(!showSettings);
    };

    const onCloseSettings = () => {
        setShowSettings(false);
    };

    return (
        <div className="playground-container">
            <header>
                <h1 className="title">Playground</h1>
            </header>
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
