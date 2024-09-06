import axios from "axios";

// Wordle Game
// I will use datamuse API to do the dictionary job: https://www.datamuse.com/api/
// We have 3 type of letter: absent, present, correct
// PatterWord to submit: ["?","?","?","?","?"] -> Win condition: ["d", "o", "i", "n", "g"]
const blackListLetter = new Set();
const presentLetter = new Set();
const patternWord = Array(5).fill("?");

const checkPatternWord = () => {
    return patternWord.every((word) => word === "?");
};

const checkPresentLetter = (word) => {
    return Array.from(presentLetter).every((letter) => [...word].includes(letter));
};
const dealWithPresentLetter = (result) => {
    presentLetter.add(result.guess);
    console.log("Present letter: ", result.guess);
};

const dealWithCorrectLetter = (result) => {
    patternWord[result.slot] = result.guess;
};
const submitGuessWord = async (word, type, userInput = "") => {
    let guessResult;
    console.log("submitGuessWord userInput: ", userInput);

    switch (type) {
        case "daily":
            // Guess Daily
            guessResult = await axios.get(`https://wordle.votee.dev:8000/daily?guess=${word}`).then((res) => res?.data);
            break;
        case "seed":
            // Gues with seed
            guessResult = await axios.get(`https://wordle.votee.dev:8000/random?guess=${word}&seed=${userInput}`).then((res) => res?.data);
            break;
        case "word":
            // Guess with the specific word
            guessResult = await axios.get(`https://wordle.votee.dev:8000/word/${userInput}?guess=${word}`).then((res) => res?.data);
            break;
        default:
            console.log("Invalid Type !");
    }

    guessResult.forEach((e, i) => {
        // we really don't need this case, but for imporement if the future, just let it be
        if (e.result === "absent") {
            blackListLetter.add(e.guess);
        }
        if (e.result === "correct") {
            dealWithCorrectLetter(e);
        }
        if (e.result === "present") {
            dealWithPresentLetter(e);
        }
    });
};
const app = async (type, userInput) => {
    console.time("wordle");
    let turn = 0;
    try {
        while (true) {
            // Exit condition
            if (!patternWord.includes("?")) {
                console.log("You Win");
                console.log("Correct Word: ", patternWord.join(""));
                break;
            }

            ++turn;
            // First: Get a bunch on random word from Datamuse api
            const dictionaryResult = await axios.get(`https://api.datamuse.com/words?sp=${patternWord.join("")}`).then((res) => res?.data);
            console.log("Dictionary Resutl: ", dictionaryResult);

            // Second: filter word with conditons
            // if we have any present letter, compare to dictionaryResult and choosethe word have presentLetter inside
            for (const e of dictionaryResult) {
                if (!patternWord.includes("?")) {
                    console.log("You Win");
                    console.log("Correct Word: ", patternWord.join(""));
                    break;
                } else if (presentLetter.size > 0 && checkPresentLetter(e.word)) {
                    console.log("Word from Dictionary have present letter will be submit: ", e.word);
                    await submitGuessWord(e.word, type, userInput);
                } else if (presentLetter.size === 0) {
                    console.log("Word from Dictionary will be submit: ", e.word);
                    await submitGuessWord(e.word, type, userInput);
                } else {
                    console.log("Ignore word: ", e.word);
                }
            }
            console.log(`------------------END ${turn} TURN -------------------`);
        }
        console.timeEnd("wordle");
    } catch (error) {
        console.log(error);
    }
};

export default app;
