import { api } from "./api";
import { Question, Choice } from "common/models";
import { createButton, createQuestionContainer } from "./components";

const renderQuestionContainer = (questions: Question[], choices: Choice[], currentQuestionIndex: number, userAnswers: any) => {
    const questionContainer = document.getElementById("question-container");
    const progressBar = document.getElementById("quiz-progress") as HTMLProgressElement;

    if (questionContainer) {
        questionContainer.innerHTML = "";

        //render question   
        const questionText = questions[currentQuestionIndex].text;
        const questionElement = createQuestionContainer(questionText);
        
        //render choices
        const choicesElement = renderChoices(questions[currentQuestionIndex].choices, userAnswers);

        // Previous button
        const prevButton = createButton({
            text: "Previous",
            className: "btn btn-primary",
            onClick: async () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                renderProgressBar(progressBar, currentQuestionIndex, questions.length);
                const choices = questions[currentQuestionIndex].choices
                renderQuestionContainer(questions, choices, currentQuestionIndex, userAnswers);
            }
            },
        });

        // Next button
        const nextButton = createButton({
            text: "Next",
            className: "btn btn-primary",
            onClick: async () => {
            if (currentQuestionIndex < questions.length - 1) {
                // Get the selected radio button
                const userAnswer = (document.querySelector(`input[name="question-${questions[currentQuestionIndex].questionId}"]:checked`) as HTMLInputElement)?.value;
                if (userAnswer) {
                    console.log("User's answer:", userAnswer);
                    userAnswers[questions[currentQuestionIndex].questionId] = userAnswer;
                } else {
                    //TODO: User did not click answer, disable next button?
                    console.log("No answer selected");
                }
                
                currentQuestionIndex++;
                renderProgressBar(progressBar, currentQuestionIndex, questions.length);
                const choices = questions[currentQuestionIndex].choices
                renderQuestionContainer(questions, choices, currentQuestionIndex, userAnswers);
                
            } else {
                SPA.navigatePage("results");
                console.log("Quiz completed!");
            }
            },
        });

        const buttonGroup = document.createElement("section");
        buttonGroup.className = "quiz-btn-group ";
        // Only add prev button if not on the first question
        if (currentQuestionIndex > 0) {
            buttonGroup.appendChild(prevButton);
        }
        buttonGroup.appendChild(nextButton);

        questionContainer.appendChild(questionElement);
        questionContainer.appendChild(choicesElement);
        questionContainer.appendChild(buttonGroup);
    }
}

const renderChoices = (choices: Choice[], userAnswers: any) => {
    const container = document.createElement("div");
    container.className = "container";

    const ul = document.createElement("ul");
    ul.className = "list";

    choices.forEach((choice) => {
        const li = document.createElement("li");
        li.className = "list__item";

        const input = document.createElement("input");
        input.type = "radio";
        input.className = "radio-btn";
        input.name = `question-${choice.questionId}`;
        input.id = `choice-${choice.choiceId}`;

        //TODO:  store the choice id as the user's choice or the actual text of the choice
        input.value = choice.text;

         // Pre-select the answer if it exists in the userAnswers object
         if (userAnswers[choice.questionId] === choice.text.toString()) {
            input.checked = true;
        }

        const label = document.createElement("label");
        label.htmlFor = input.id;
        label.className = "label";
        label.textContent = choice.text;

        li.appendChild(input);
        li.appendChild(label);
        ul.appendChild(li);
    });

    container.appendChild(ul);
    return container;
}

const renderProgressBar = (progressBar: HTMLProgressElement, currentQuestionIndex: number, totalNrQuestions: number) => {
    if (progressBar) {
        progressBar.value = ((currentQuestionIndex) / totalNrQuestions) * 100;
    }
}

export const initQuiz = async () => {
    let userAnswers = {};
    let questions: Question[] = [];
    let choices: Choice[];
    let currentQuestionIndex = 0;
    questions = await api.getQuestions();
    choices = questions[currentQuestionIndex].choices;
    // Render the first question
    renderQuestionContainer(questions, choices, currentQuestionIndex, userAnswers);
}





 

