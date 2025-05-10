import { ButtonOptions } from "common/models";

export function createButton({
    text,
    onClick,
    className = "",
    backgroundColor,
    textColor,
    type = "button",
  }: ButtonOptions): HTMLButtonElement {
    const button = document.createElement("button");
    button.textContent = text;
    button.type = type;
    button.className = className;
  
    if (backgroundColor) {
      button.style.backgroundColor = backgroundColor;
    }
  
    if (textColor) {
      button.style.color = textColor;
    }
    button.addEventListener("click", onClick);
    return button;
}

export function createQuestionContainer(
    questionText: string,
): HTMLElement {
    const article = document.createElement("section");

    const questionTextElement = document.createElement("h3");
    questionTextElement.textContent = questionText;
    article.appendChild(questionTextElement);
    return article;
}


export function createDetail({
  summaryText = '',
  content = '',
  open = false,
  className = ''
} = {}) {
  const details = document.createElement('details');
  if (open) details.setAttribute('open', '');
  if (className) details.className = className;

  const summary = document.createElement('summary');
  summary.textContent = summaryText;
  details.appendChild(summary);

  const paragraph = document.createElement('p');
  paragraph.innerHTML = content
    .split('\n')
    .map(line => line.trim() ? line : '&nbsp;') // preserve empty lines
    .map(line => `${line}<br>`)
    .join('');
  details.appendChild(paragraph);

  return details;
}
