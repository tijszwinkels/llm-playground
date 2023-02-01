import React, { useState } from 'react';
import './Playground.css';

function Playground() {
    const [model, setModel] = useState('');
    const [generating, setGenerating] = useState(false);
    const [text, setText] = useState('');

    const onGenerate = () => {
        setGenerating(true);
        console.log('Generating...');
    };

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
                        <option value="model1">Model 1</option>
                        <option value="model2">Model 2</option>
                        <option value="model3">Model 3</option>
                    </select>
                </div>
            </header>
            <textarea
                className="textbox"
                value={text}
                onChange={e => setText(e.target.value)}
                readOnly={generating}
                disabled={generating}
            />
            {generating ? (
                <div className="overlay">
                    <div className="spinner" />
                </div>
            ) : (
                <button onClick={onGenerate}>Generate</button>
            )}
        </div>
    );
}

export default Playground;
