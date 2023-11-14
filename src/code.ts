//Made by Abhijit Chirde
//abhijitchirde.com

import { wordSpace } from "./data/wordSpace";

const fonts = [
  { family: "Hind", style: "Regular" },
  { family: "Baloo Bhaina 2", style: "Regular" },
  { family: "Mukta Mahee", style: "Regular" },
  { family: "Mukta", style: "Regular" },
];

function loadFont() {
  fonts.forEach((font) => {
    figma.loadFontAsync(font);
  });
}

loadFont();

figma.showUI(__html__, { width: 320, height: 410 });

//language specific punctuation marks
const punctSetOne = [".", ","]; //Marathi, Kannada, Tamil, Gujarati, Telugu, Malayalam
const punctSetTwo = ["।", ","]; //Hindi, Bangla, Odia, Punjabi
const punctSetThree = ["।।", "।"]; //Sanskrit

figma.ui.onmessage = (msg) => {
  if (msg.type === "get-desi-ipsum") {
    const inputNum = parseInt(msg.data.num, 10);
    // const inputNum = msg.data.inputNum;
    const typeInput = msg.data.block;
    const languageInput = msg.data.lang;

    if (figma.currentPage.selection.length === 0) {
      figma.notify("Please select a text layer", { timeout: 1500 });
    }

    for (const node of figma.currentPage.selection) {
      if (node.type !== "TEXT") {
        figma.notify("Please select a text layer", { timeout: 1000 });
      } else if (isNaN(inputNum)) {
        figma.notify("Please enter a number", { timeout: 1000 });
      } else if (inputNum <= 0) {
        figma.notify("Please enter a number greater than 0", { timeout: 1000 });
      } else if (node.type === "TEXT") {
        figma.ui.postMessage({ error: "TextLayer" });

        setNodeFont(node, languageInput);

        node.name = `${languageInput} text`;

        if (typeInput === "words") {
          node.characters = generateWords(
            wordSpace[`${languageInput}`],
            inputNum
          );
          if (msg.data.checkBox === true) {
            figma.closePlugin(
              `Generated ${inputNum} ${typeInput} of ${languageInput}.`
            );
          }
        } else if (typeInput === "sentences") {
          node.characters = generateSentences(
            wordSpace[`${languageInput}`],
            inputNum,
            languageInput
          );
        } else {
          node.characters = generateParagraphs(
            wordSpace[`${languageInput}`],
            inputNum,
            languageInput
          );
        }
      }
    }
  }

  if (msg.type === "disclaimer") {
    figma.notify(
      "This plugin generates random text without any literal meaning.",
      { timeout: 2000 }
    );
  }
};

//function for setting fonts depending on languages
function setNodeFont(currentNode: TextNode, language: string) {
  if (language === "Odia") {
    currentNode.fontName = {
      family: "Baloo Bhaina 2",
      style: "Regular",
    };
  } else if (language === "Punjabi") {
    currentNode.fontName = {
      family: "Mukta Mahee",
      style: "Regular",
    };
  } else if (
    language === "Marathi" ||
    language === "Hindi" ||
    language === "Sanskrit"
  ) {
    currentNode.fontName = {
      family: "Mukta",
      style: "Regular",
    };
  } else {
    currentNode.fontName = {
      family: "Hind",
      style: "Regular",
    };
  }
}

//Function to generate words
function generateWords(inputArray: Array<string>, noOfWords: number) {
  let outputText = "";
  for (let i = 0; i < noOfWords; i++) {
    let randomWords = inputArray[Math.floor(Math.random() * inputArray.length)];
    if (i === noOfWords - 1) {
      outputText += `${randomWords}`;
    } else {
      outputText += `${randomWords} `;
    }
  }
  return outputText;
}

//Function to generate sentences
function generateSentences(
  inputArray: Array<string>,
  noOfSentences: number,
  language: string
) {
  let outputText = "";
  if (
    language === "Hindi" ||
    language === "Bangla" ||
    language === "Odia" ||
    language === "Punjabi"
  ) {
    for (let i = 0; i < noOfSentences; i++) {
      if (i === noOfSentences - 1) {
        outputText +=
          generateWords(inputArray, randomInt(4, 9)) + punctSetTwo[0];
      } else {
        outputText +=
          generateWords(inputArray, randomInt(4, 9)) + punctSetTwo[0] + " ";
      }
    }
  } else if (language === "Sanskrit") {
    for (let j = 0; j < noOfSentences; j++) {
      if (j === noOfSentences - 1) {
        outputText +=
          generateWords(inputArray, randomInt(4, 9)) + punctSetThree[0];
      } else {
        outputText +=
          generateWords(inputArray, randomInt(4, 9)) + punctSetThree[1] + " ";
      }
    }
  } else {
    for (let j = 0; j < noOfSentences; j++) {
      if (j === noOfSentences - 1) {
        outputText +=
          generateWords(inputArray, randomInt(4, 9)) + punctSetOne[0];
      } else {
        outputText +=
          generateWords(inputArray, randomInt(4, 9)) + punctSetOne[0] + " ";
      }
    }
  }
  return outputText;
}

//Function to generate paragraphs
function generateParagraphs(
  inputArray: Array<string>,
  noOfParagraphs: number,
  language: string
) {
  let outputText = "";
  for (let k = 0; k < noOfParagraphs; k++) {
    if (k == noOfParagraphs - 1) {
      outputText += generateSentences(inputArray, randomInt(4, 8), language);
    } else {
      outputText +=
        generateSentences(inputArray, randomInt(4, 8), language) + "\n" + "\n";
    }
  }
  return outputText;
}

//Function to generate random integer for sent and para
function randomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
