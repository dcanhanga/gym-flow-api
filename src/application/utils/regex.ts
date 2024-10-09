const leastOneNumber = /\d/;
const leastOneUppercase = /[A-Z]/;
const leastOneSpecialCharacter = /[ $*.\[\]{}()?!"@#%&/\\,><'":;|_~`=+-]/;
const phone = /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

export { leastOneNumber, leastOneSpecialCharacter, leastOneUppercase, phone };
