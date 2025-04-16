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

  const handleDelete = (id) => {
    setQuestions(questions.filter((question) => question.id !== id));
  };

  return (
    <section>
      <h1>Quiz Questions</h1>
      <NewQuestionForm />
      <ul>
        {questions.map((question) => (
          <QuestionItem key={question.id} question={question} onDelete={handleDelete} />
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;
