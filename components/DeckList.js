import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";
import { connect } from "react-redux";

import PropTypes from "prop-types";

import DeckCard from "./DeckCard";

import { getDecks, deleteAll } from "../utils/api";
import { receiveDecks, deleteAllDecksInStore } from "../actions";

import { gray, blue } from "../utils/colors";

//Get decks and put in store
class DeckList extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    getDecks().then(decks => dispatch(receiveDecks(decks)));
  }

  deleteAllHandler() {
    const { dispatch } = this.props;
    dispatch(deleteAllDecksInStore());
    deleteAll();
  }

  render() {
    const { navigation, deckTitles } = this.props;
    let deckList = "";
    if (deckTitles.length === 0) {
      deckList = (
        <View style={styles.imageContainer}>
          <Text style={styles.message}>
            No decks exist! Please create a new deck.
          </Text>
          <Image
            style={styles.image}
            source={require("../images/error.png")}

          />
        </View>
      );
    } else {
      deckList = (
        <View style={styles.decksListContainer}>
          {deckTitles.map(title => {
            return (
              <TouchableOpacity
                key={title}
                onPress={() => navigation.navigate("Deck", { title: title })}
              >
                <DeckCard title={title} />
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.title}>Welcome to Flashcards</Text>
            {deckTitles.length > 0 ? (
              <Text style={{ color: gray }}>You have created the following decks:</Text>
            ) : null}
            {deckTitles.length > 0 ? (
              <TouchableOpacity
                onPress={() => this.deleteAllHandler()}
                style={styles.delete}
              >
                <Text style={{ color: "red" }}>DELETE ALL</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {deckList}
        </View>
      </ScrollView>
    );
  }
}

function mapStateToProps(decks) {
  const deckTitles = Object.keys(decks);
  return {
    deckTitles
  };
}

DeckList.propTypes = {
  deckTitles: PropTypes.array
};

export default connect(mapStateToProps)(DeckList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20
  },
  decksListContainer: {
    flex: 1,
    justifyContent: "space-between"
  },
  image: {
    marginTop: 100,
    width: 125,
    height: 125,
    alignSelf: "center"
  },
  imageContainer: {
    flex: 1,
    justifyContent: "space-between"
  },
  message: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 30,
    marginTop: 40,
    color: gray,
    fontWeight: "800"
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    color: blue,
    marginBottom: 15
  },
  delete: {
    alignItems: "center",
    marginTop: 10
  }
});