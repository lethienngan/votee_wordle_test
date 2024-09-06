# votee_wordle_test

### Installation:
```bash
npm i
```

### Start Project
```bash
npm start
```

### 3rd Service reference:
Datamuse api (to check dictionary for random words or word with specific letter)
```text
// For random words
https://api.datamuse.com/words?sp=?????

// For word with specific letter
https://api.datamuse.com/words?sp=d??ng // result = doing / dying / drang / dring... list of matched words
```

### Configuration
There types of API to solve Wordle Game: ./app.js
```javascript
// Guess Daily
app("daily");

// Guess Random with Seed
app("seed", "123455");

// Guess word
app("word", "hello");
```

# Thank you