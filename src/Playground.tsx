import React from 'react';
import './Playground.css';

function Playground() {
    return (
        <div className="playground-container">
            <header>
                <h1 className="title">Playground</h1>
                <div className="dropdown-container">
                    <select>
                        <option value="Option 1">Option 1</option>
                        <option value="Option 2">Option 2</option>
                        <option value="Option 3">Option 3</option>
                    </select>
                </div>
            </header>
            <main>
                <textarea className="textbox" />
            </main>
        </div>
    );
}

export default Playground;
