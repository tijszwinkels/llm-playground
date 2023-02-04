import React, { useState, useEffect } from 'react';
import ChatGpt from './models/ChatGpt';
import Model from './models/Model';
import './Playground.css';

function Playground() {
    const [model, setModel] = useState('');
    const [generating, setGenerating] = useState(false);
    const [text, setText] = useState('');
    const curModel : Model = new ChatGpt();

    const onGenerate = () => {
        setGenerating(true);
        curModel.generate(text).then((response : string) => {
            console.log(response);
            setText(text + response);
            setGenerating(false);
        });
        //console.log('Generating...');
    };

    const onStopGenerate = () => {
        setGenerating(false);
    };

    useEffect(() => {
        setText(curModel.preamble);
    }, []);

    return (
        <div className="playground-container">
            <header>
                <h1 className="title">Playground</h1>
                <div className="dropdown-container">
                    <label htmlFor="model-select">Model:</label>
                    <select
                        id="model-select"
                        value={model}
                        onChange={e => setModel(e.target.value)}
                    >
                        <option value="">Select a model</option>
                        <option value="petal-bloomz">BloomZ on Petal</option>
                        <option value="chatgpt">ChatGPT</option>
                    </select>
                </div>
            </header>
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
                <button onClick={onStopGenerate}>Stop Generating</button>
            ) : (
                <button onClick={onGenerate}>Generate</button>
            )}
        </div>
    );
}

export default Playground;
