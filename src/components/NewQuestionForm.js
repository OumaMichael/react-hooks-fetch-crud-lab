import React, { useState } from "react";

function NewQuestionForm({ onAddQuestion }) {
  const [prompt, setPrompt] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newQuestion = { prompt, answers, correctIndex };

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    })
      .then((response) => response.json())
      .then((data) => {
        onAddQuestion(data);
        setPrompt("");
        setAnswers(["", "", "", ""]);
        setCorrectIndex(0);
      })
      .catch((error) => console.log(error));
  };

  const handleAnswerChange = (event, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>New Question</h2>
      <label>
        Prompt:
        <input
          type="text"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
        />
      </label>
      <br />
      {answers.map((answer, index) => (
        <label key={index}>
          Answer {index + 1}:
          <input
            type="text"
            value={answer}
            onChange={(event) => handleAnswerChange(event, index)}
          />
        </label>
      ))}
      <br />
      <label>
        Correct Answer:
        <select
          value={correctIndex}
          onChange={(event) => setCorrectIndex(parseInt(event.target.value))}
        >
          {answers.map((answer, index) => (
            <option key={index} value={index}>
              {answer}
            </option>
          ))}
        </select>
      </label>
      <br />
      <button type="submit">Add Question</button>
    </form>
  );
}

export default NewQuestionForm;