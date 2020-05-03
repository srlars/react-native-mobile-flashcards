import { AsyncStorage } from "react-native";

const DECK_STORAGE_KEY = "Flashcards:decks";

export function getDecks() {
  return AsyncStorage.getItem(DECK_STORAGE_KEY).then(results => {
    return JSON.parse(results);
  });
}

export function saveDeck(title) {
  return AsyncStorage.mergeItem(
    DECK_STORAGE_KEY,
    JSON.stringify({
      [title]: { title: title, questions: [] }
    })
  );
}

export function deleteDeck(title) {
  return AsyncStorage.getItem(DECK_STORAGE_KEY).then(results => {
    const data = JSON.parse(results);
    const newData = Object.keys(data).reduce((newObj, key) => {
      if (key !== title) {
        newObj[key] = data[key];
      }
      return newObj;
    }, {});
    AsyncStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(newData));
  });
}

export function saveCardToDeck(title, newQuestion) {
  return AsyncStorage.getItem(DECK_STORAGE_KEY).then(results => {
    const data = JSON.parse(results);
    Object.keys(data).map(dTitle => {
      if (dTitle === title) {
        data[dTitle].questions.push(newQuestion);
      }
    });
    AsyncStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(data));
  });
}

export function deleteAll() {
  return AsyncStorage.clear();
}