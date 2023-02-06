# LLM Playground (js Eval)

Very simple playground for interfacing with (future: several) LLM api's. Work in progress.
For advanced use, there's a few advantages to a playground-style interface over a chat interface:
- No inspiration? Just Leave the User: prompt and let GPT generate a question.
- Edit the response of the model if you're not happy with it.
- Partly edit the model response, and let the model fill in the rest. 

This branch prompts the LLM to encourage it to produce js code. If the LLM generates a js code block, the app will
add a warning. If the user clicks 'Generate' again, the app will execute the code block and paste the output back into
the textbox.

I've been greatly enjoying playing with this over the last few days. It looks like adding the ability to execute code
to ChatGPT greatly expands its abilities. For one thing, it allows it to do accurate math with larger and less common
numbers, but I have seen it write little agent-based simulations, retrieve data from API's, and write a poem generator.
It even tends to respond to the question 'can you express this in code' to some philosophical questions.

Some prompts I've found interesting:
- `User: Can you write a simulation of a tic-tac-toe board, and play a few moves?`
- `User: Can you write a poem generator and generate a poem with it?`
- `User: Can you write a function that takes a number and returns the next prime number and show me how to use it?`
- `User: What's todays date?`
- `User: Give me the current bitcoin price.`
- `User: If I have a 96dB signal, and then I reduce the signal strength to 23%, how many dB do I have left? Remember that dB is a logarithmic scale.`

Now, please treat this technology with respect, and make sure you understand the js code you're running. Especially 
since it can do external api-calls, don't just run code unseen.

### Usage

Visit on: https://TinkerTankAI.github.io/llm-playground-jseval/

### Instructions

Fill out your query next to the "User:" prompt
Click the "Generate" button to generate text.

If there's a js``` code-block in the text, a warning will be shown in the textbox.
If you click "Generate" again, the code-block will be executed and the results will be pasted in the text-box.

- Anything you enter can be stored by the api provider and/or the creators of this software and might be shared as part of public datasets.
- Don't enter any credentials or private data
- Use this tool ethically and responsibly
- Make sure you understand what the js-code does before executing it
- Have fun! :)

Obtain an api-key at: platform.openai.com/account/api-keys - Click the cog icon to configure the api-key.

### Keyboard Shortcuts

- Ctrl-Shift-Enter: Generate
- Ctrl-Shift-X: Add the js warning to the end, so it will execute the last code-block the next time you click "Generate"
 
