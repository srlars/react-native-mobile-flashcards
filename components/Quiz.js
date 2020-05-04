import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";

import PropTypes from "prop-types";

import DeckCard from "./DeckCard";
import QuizResults from "./QuizResults";

import {
  clearLocalNotification,
  setLocalNotification
} from '../utils/helpers';

import { blue, white } from "../utils/colors";

import { Ionicons } from "@expo/vector-icons";

class Quiz extends Component {
  state = {
    index: 0,
    correct: 0,
    showAnswer: false,
    showQueryResults: false
  };

  restartHandler() {
    this.setState({
      index: 0,
      correct: 0,
      showAnswer: false,
      showQueryResults: false
    });
  }

  showResponseHandler() {
    this.setState(prevState => ({
      ...prevState,
      showAnswer: !prevState.showAnswer
    }));
  }

  correctHandler() {
    const { index } = this.state;
    const { numberOfQuestions } = this.props;

    if (index + 1 < numberOfQuestions) {
      this.setState(prevState => ({
        ...prevState,
        index: prevState.index + 1,
        correct: prevState.correct + 1,
        showAnswer: false
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        showQueryResults: true,
        correct: prevState.correct + 1,
        showAnswer: false
      }));
    }
  }

  wrongHandler() {
    const { index } = this.state;
    const { numberOfQuestions } = this.props;

    if (index + 1 < numberOfQuestions) {
      this.setState(prevState => ({
        ...prevState,
        index: prevState.index + 1,
        showAnswer: false
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        showQueryResults: true,
        showAnswer: false
      }));
    }
  }

  render() {
    const { route, numberOfQuestions, questions, navigation } = this.props;
    const { title } = route.params;
    const { index, showAnswer, showQueryResults, correct } = this.state;
    console.log(this.props);

    //answer and question
    let answer = null;
    let question = null;
    if (questions.length >= 1) {
      answer = (
        <View style={styles.questionFormat}>
          <Text style={styles.qAndAText}>{questions[index].answer}</Text>
        </View>
      );
      question = (
        <View style={styles.questionFormat}>
          <Text style={styles.qAndAText}>{questions[index].question}</Text>
        </View>
      );
    }

    //Check answer btn
    const checkAnswer = (
      <TouchableOpacity onPress={() => this.showResponseHandler()}>
        <Text style={styles.checkFormat}>
          {this.state.showAnswer === true
            ? "Check question"
            : "Check answer"
          }
        </Text>
      </TouchableOpacity>
    );

    const correctIncorrectBtn = (
      <View style={styles.btnGroupContainer}>
        <TouchableOpacity
          style={styles.btnContainer}
          onPress={() => this.correctHandler()}
        >
          <Ionicons name="ios-checkmark-circle" color={"green"} size={25} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnContainer}
          onPress={() => this.wrongHandler()}
        >
          <Ionicons name="ios-close-circle" color={"red"} size={25} />
        </TouchableOpacity>
      </View>
    );

    //Back btn
    const backBtn = (
      <TouchableOpacity
        onPress={() => {
          navigation.goBack()
          clearLocalNotification()
            .then(setLocalNotification)
        }}
        style={styles.goBackBtn}
      >
        <Text style={styles.goBack}>Exit</Text>
      </TouchableOpacity>
    );

    const finishQuizBtn = (
      <View>
        <TouchableOpacity
          style={{ alignSelf: "center", marginBottom: 18 }}
          onPress={() => this.restartHandler()}
        >
          <Text style={styles.goBack}>Restart quiz</Text>
        </TouchableOpacity>
        {backBtn}
      </View>
    );

    //Results depending on user performance
    const results = (
      <View style={styles.questionFormat}>
        <QuizResults correct={correct} numberOfQuestions={numberOfQuestions} />
      </View>
    );

    //If no questions in card
    if (numberOfQuestions === 0) {
      return (
        <View style={styles.container}>
          <DeckCard title={title} />
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View
              style={[styles.questionContainer, { justifyContent: "center" }]}
            >
              <Text style={{ fontSize: 30, textAlign: "center", padding: 20 }}>
                No questions so far. Please add some.
              </Text>
            </View>
            {backBtn}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <DeckCard title={title} />
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={styles.questionContainer}>
            <Text style={styles.questionNumber}>
              {index + 1}/{numberOfQuestions}
            </Text>
            {showQueryResults ? results : showAnswer ? answer : question}
            {!showQueryResults ? checkAnswer : null}
          </View>
          {!showQueryResults ? correctIncorrectBtn : finishQuizBtn}
        </View>
      </View>
    );
  }
}

function mapStateToProps(decks, { route }) {
  const deck = decks[route.params.title];
  const numberOfQuestions = deck.questions.length;
  return {
    deck,
    numberOfQuestions,
    questions: deck.questions
  };
}

Quiz.propTypes = {
  deck: PropTypes.object,
  numberOfQuestions: PropTypes.number,
  questions: PropTypes.array
};

export default connect(mapStateToProps)(Quiz);

const styles = StyleSheet.create({
  container: { margin: 20, flex: 1, justifyContent: "flex-start" },
  questionContainer: {
    height: 300,
    width: "90%",
    backgroundColor: white,
    borderColor: blue,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    alignSelf: "center",
    paddingTop: 10,
    paddingBottom: 20,
    marginTop: 20,
    alignItems: "center"
  },
  qAndAText: {
    fontSize: 20,
    fontWeight: "900"
  },
  questionNumber: {
    alignSelf: "flex-end",
    padding: 5,
    marginBottom: 5,
    color: blue,
    fontWeight: "900"
  },
  questionFormat: {
    flex: 1,
    marginBottom: 20,
    backgroundColor: "#F5F5F5",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  checkFormat: {
    fontWeight: "900",
    color: blue
  },
  btnGroupContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-end"
  },
  btnContainer: {
    flex: 1,
    textAlign: "center",
    borderColor: blue,
    borderWidth: 2,
    margin: 5,
    height: 45,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center"
  },
  goBackBtn: {
    alignSelf: "center",
    justifyContent: "flex-end"
  },
  goBack: {
    color: blue,
    fontWeight: "900",
    fontSize: 15
  }
});
