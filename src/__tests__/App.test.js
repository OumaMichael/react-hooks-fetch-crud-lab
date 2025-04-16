import React from "react";
import "whatwg-fetch";
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";

import App from "../components/App";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
  render(<App />);

  fireEvent.click(screen.getByText(/View Questions/i));

  expect(await screen.findByText(/lorem testum 1/i)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/i)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  // wait for first render of list (otherwise we get a React state warning)
  fireEvent.click(screen.getByText(/View Questions/i));
  await screen.findByText(/lorem testum 1/i);

  // click form page
  fireEvent.click(screen.getByText(/New Question/i));

  // fill out form
  fireEvent.change(screen.getByLabelText(/Prompt/i), {
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 1/i), {
    target: { value: "Test Answer 1" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 2/i), {
    target: { value: "Test Answer 2" },
  });
  fireEvent.change(screen.getByLabelText(/Correct Answer/i), {
    target: { value: "1" },
  });

  // submit form
  fireEvent.submit(screen.getByText(/Add Question/i));

  // view questions
  fireEvent.click(screen.getByText(/View Questions/i));

  expect(await screen.findByText(/Test Prompt/i)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 1/i)).toBeInTheDocument();
});

test("deletes the question when the delete button is clicked", async () => {
  const { rerender } = render(<App />);

  fireEvent.click(screen.getByText(/View Questions/i));

  await screen.findByText(/lorem testum 1/i);

  fireEvent.click(screen.getAllByText(/Delete Question/i)[0]);

  await waitForElementToBeRemoved(() => screen.getByText(/lorem testum 1/i));

  rerender(<App />);

  await screen.findByText(/lorem testum 2/i);

  expect(screen.queryByText(/lorem testum 1/i)).not.toBeInTheDocument();
});

test("updates the answer when the dropdown is changed", async () => {
  const { rerender } = render(<App />);

  fireEvent.click(screen.getByText(/View Questions/i));

  await screen.findByText(/lorem testum 2/i);

  fireEvent.change(screen.getAllByLabelText(/Correct Answer/i)[1], {
    target: { value: "3" },
  });

  expect(screen.getAllByLabelText(/Correct Answer/i)[1].value).toBe("3");

  rerender(<App />);

  expect(screen.getAllByLabelText(/Correct Answer/i)[1].value).toBe("3");
});