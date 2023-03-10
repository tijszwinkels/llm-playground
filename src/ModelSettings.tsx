import React from 'react';
import './ModelSettings.css';
interface Props {
    apiKey: string;
    setApiKey: (apiKey: string) => void;
    accessToken: string;
    setAccessToken: (accessToken: string) => void;
    onClose: () => void;
}

const ModelSettings: React.FC<Props> = ({ apiKey, setApiKey, accessToken, setAccessToken, onClose }) => {

    return (
        <div className="model-settings">
            <h2>Settings</h2>
            <label htmlFor="api-key">OpenAI API Key:</label>
            <input
                id="api-key"
                type="text"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
            />
            <pre>Get an OpenAI API key at platform.openai.com/account/api-keys</pre>
            <br/><br/>

            <label htmlFor="access-token">KoboldAI Horde api-key:</label>
            <input
                id="access-token"
                type="text"
                value={accessToken}
                onChange={e => setAccessToken(e.target.value)}
            />
            <pre>See:<br/>https://stablehorde.net/<br/>for obtaining an api-key, or use '0000000000' for anonymous account.</pre>
            <br/>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default ModelSettings;