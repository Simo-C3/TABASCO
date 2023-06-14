export const getTextByBody = () => {
  const body = document.body.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a');
  let str = '';
  for (const element of body) {
    if (element.textContent) {
      str += element.textContent + '\n';
    }
  }
  return str;
};
