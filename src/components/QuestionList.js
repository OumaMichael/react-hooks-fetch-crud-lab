import React, { useState, useEffect } from "react";
import QuestionItem from "./QuestionItem";
import NewQuestionForm from "./NewQuestionForm";

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.log(error));
  }, []);

  const handleAddQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setQuestions(questions.filter((question) => question.id !== id));
      })
      .catch(error => console.log(error));
  };

  const handleUpdateCorrectAnswer = (id, correctIndex) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correctIndex: correctIndex }),
    })
      .then((response) => response.json())
      .then((updatedQuestion) => {
        setQuestions(questions.map((question) =>
          question.id === id ? updatedQuestion : question
        ));
      })
      .catch(error => console.log(error));
  };

  return (
    <section>
      <h1>Quiz Questions</h1>
      <NewQuestionForm onAddQuestion={handleAddQuestion} />
      <ul>
        {questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            onDelete={handleDelete}
            onUpdateCorrectAnswer={handleUpdateCorrectAnswer}
          />
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;