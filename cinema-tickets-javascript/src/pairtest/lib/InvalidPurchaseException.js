export default class InvalidPurchaseException extends Error {
  constructor(errors) {
    super("Invalid purchase"); // This message is not necessary but maintained for compatibility.
    console.log(errors.join(', \n'));
    this.errors = errors;
  }
}
