# simple OpenAI verbal chatbot

A bare-bones confluence of "getting started"s with OpenAI Text Completion API, Web/JS standard Speech-->Text-->Speech APIs, in a Firebase App and Function.

Nothing is stored.  No auth or notion of login.

Client 'app' code is [speechDemo.js](https://github.com/j-calvert/loggy/blob/main/public/speechDemo.js).

Firebase function `generate` defined in [index.js](https://github.com/j-calvert/loggy/blob/main/functions/index.js) uses the OpenAI completion API to generate responses.

The rest of the files are generated or boilerplate.

Note: Early versions of this repo were playing around w/ Service Workers (for trying out PWA) and geo web APIs.
