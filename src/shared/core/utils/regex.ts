export const emailRegex =
	/^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
export const leastOneNumber = /\d/;
export const leastOneUppercase = /[A-Z]/;
export const leastOneSpecialCharacter =
	/[ $*.\[\]{}()?!"@#%&/\\,><'":;|_~`=+-]/;
export const phone = /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
export const uuidRegex =
	/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;

export const nameRegex = /^[a-zA-Z]+( [a-zA-Z]+)+$/;
