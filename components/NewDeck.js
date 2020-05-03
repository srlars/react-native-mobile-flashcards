import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";

import PropTypes from "prop-types";

import { connect } from "react-redux";
import { saveDeck } from "../utils/api";
import { addNewDeck } from "../actions";

import { blue, white, gray } from "../utils/colors";

import { Ionicons } from "@expo/vector-icons";

class NewDeck extends Component {
  state = {
    titleExisting: false,
    errorMessage: false,
    title: ""
  };

  onChangeHandler = value => {
    this.setState({
      title: value
    });
  };

  submitHandler = () => {
    const { navigation, dispatch, deckTitleArray } = this.props;
    const { title } = this.state;
    const included = deckTitleArray.includes(title);

    if (title === "") {
      this.setState(prevState => ({
        ...prevState,
        errorMessage: !prevState.errorMessage
      }));
    }

    if (title !== "" && included === false) {
      //Update store
      dispatch(addNewDeck(title));
      //Update "DB"
      saveDeck(title);
      //Update state
      this.setState({
        title: "",
        errorMessage: false
      });
      //Go to "DECK" if title is not null
      navigation.navigate("Deck", { title: title });
    } else if (included) {
      this.setState(prevState => ({
        ...prevState,
        titleExisting: !prevState.titleExisting
      }));
    }
  };

  render() {
    const { title, errorMessage, titleExisting } = this.state;

    let errorAlert = null;
    if (errorMessage === true) {
      errorAlert = "Please note your title here...👈!";
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          <View style={styles.headerContainer}>
            <Ionicons name="ios-clipboard" size={80} color={blue} />
            <Text style={styles.headerText}>
              Add your personal deck!
            </Text>
            <Text style={{ color: gray }}>Please start with your title</Text>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.textInput}
              value={title}
              placeholder={errorMessage ? errorAlert : "Please note your title here... "}
              onChangeText={value => this.onChangeHandler(value)}
            />
          </View>
          <View style={{ height: 25 }}>
            {titleExisting ? (
              <Text style={{ color: "red" }}>this title already exist</Text>
            ) : null}
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() => this.submitHandler()}
              style={
                Platform.OS === "ios"
                  ? styles.iosSubmitBtn
                  : styles.androidSubmitBtn
              }
            >
              <Text style={{
                color: white,
                fontSize: 20,
                alignContent: "center",
                justifyContent: "center"
              }}>
                Create your new deck
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

function mapStateToProps(decks) {
  const deckTitleArray = Object.keys(decks);
  return {
    deckTitleArray
  };
}

NewDeck.propTypes = {
  deckTitleArray: PropTypes.array
};

export default connect(mapStateToProps)(NewDeck);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    margin: 20
  },
  headerContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: Platform.OS === "ios" ? 8 : 2,
    padding: 40,
    marginLeft: 10,
    marginRight: 10,
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: "rgba(0,0,0,0.24)",
    shadowOffset: {
      width: 0,
      height: 3
    },
    width: "100%"
  },
  headerText: { fontSize: 25, textAlign: "center", marginBottom: 15 },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%"
  },
  textInput: {
    borderBottomWidth: 2,
    borderBottomColor: blue,
    paddingBottom: 10,
    width: "100%",
    fontSize: 20
  },
  btnContainer: { width: `100%`, justifyContent: "flex-end" },
  iosSubmitBtn: {
    backgroundColor: blue,
    padding: 10,
    borderRadius: 7,
    height: 45,
    width: "100%",
    alignItems: "center"
  },
  androidSubmitBtn: {
    backgroundColor: blue,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 2,
    height: 45
  }
});
