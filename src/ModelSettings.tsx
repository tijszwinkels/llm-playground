import React from 'react';
import './ModelSettings.css';
interface Props {
    apiKey: string;
    setApiKey: (apiKey: string) => void;
    onClose: () => void;
}

const ModelSettings: React.FC<Props> = ({ apiKey, setApiKey, onClose }) => {

    return (
        <div className="model-settings">
            <h2>Model Settings</h2>
            <label htmlFor="api-key">OpenAI API Key:</label>
            <input
                id="api-key"
                type="text"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
            /><br/>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default ModelSettings;