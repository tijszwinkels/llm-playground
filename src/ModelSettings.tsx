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

            <label htmlFor="access-token">ChatGpt Access Token:</label>
            <input
                id="access-token"
                type="text"
                value={accessToken}
                onChange={e => setAccessToken(e.target.value)}
            />
            <pre>ChatGpt Access Token Only required for the ChatGPT models</pre>
            <pre>See:<br/>github.com/transitive-bullshit/chatgpt-api#access-token<br/>for information on how to obtain an access token.</pre>
            <br/>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default ModelSettings;