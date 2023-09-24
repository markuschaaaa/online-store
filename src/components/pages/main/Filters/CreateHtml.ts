class CreateHtml {
  createElement(tag: string, className: string) {
    const element = document.createElement(tag);
    element.classList.add(className);
    return element;
  }
}

export default CreateHtml;
