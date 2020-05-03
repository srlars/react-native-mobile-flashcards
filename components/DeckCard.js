import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";

import PropTypes from "prop-types";

import { blue, gray } from "../utils/colors";

const DeckCard = props => {
  const { title, numberOfCards } = props;

  return (
    <View style={styles.deckCard}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.number}>{numberOfCards}</Text>
      <Text>Card(s)</Text>
    </View>
  );
};

function mapStateToProps(decks, { title }) {
  return {
    numberOfCards: decks[title] ? decks[title].length : 0
  };
}

DeckCard.propTypes = {
  decks: PropTypes.object,
  title: PropTypes.string
};

export default connect(mapStateToProps)(DeckCard);

const styles = StyleSheet.create({
  deckCard: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: Platform.OS === "ios" ? 8 : 2,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: "rgba(0,0,0,0.24)",
    shadowOffset: {
      width: 0,
      height: 3
    },
    height: 150,
    justifyContent: "center"
  },
  title: {
    fontSize: 25,
    color: blue,
    fontWeight: "bold"
  },
  number: {
    color: gray,
    fontSize: 50
  }
});
