import config from '../../config.js'

/**
 * Immutable Object.
 */

export default class TicketTypeRequest {
  #type;

  #noOfTickets;

  #Type = config.TYPES

  constructor(type, noOfTickets) {
    const { MAX_TICKETS } = config

    if (!this.#Type.includes(type)) {
      throw new TypeError(`type must be ${this.#Type.slice(0, -1).join(', ')}, or ${this.#Type.slice(-1)}`);
    }

    if (!Number.isInteger(noOfTickets)) {
      throw new TypeError('noOfTickets must be an integer');
    }

    if (noOfTickets === 0) {
      throw new TypeError('zero tickets requested')
    }

    if (noOfTickets < 0) {
      throw new TypeError('negative number of tickets requested')
    }

    if (noOfTickets > MAX_TICKETS) {
      throw new TypeError(`${noOfTickets} requested greater than max allowed (${MAX_TICKETS})`)
    }

    this.#type = type;
    this.#noOfTickets = noOfTickets;
  }

  getNoOfTickets() {
    return this.#noOfTickets;
  }

  getTicketType() {
    return this.#type;
  }
}
