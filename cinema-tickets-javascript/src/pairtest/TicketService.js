import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

const CONFIG = {
  MAX_TICKETS : 20,
  SEAT_ALLOCATION : {
    ADULT: 1,
    CHILD: 1,
    INFANT: 0
  },
  TICKET_PRICES : {//would usually move this into its own file
    ADULT: 20.00,
    CHILD: 10.00,
    INFANT: 5.00
  }
}

export default class TicketService {

  #getTicketTypesSummary = (ticketTypeRequests) => {
    let types = {}
    let seatsTotal = 0
    const { SEAT_ALLOCATION } = CONFIG

    //return ticketTypeRequests.reduce((summary, ticket) =>{
    ticketTypeRequests.forEach((ticket) => {
      seatsTotal += SEAT_ALLOCATION[ticket]

      ticket = ticket.toLowerCase()
      if (types[ticket]) {
        types[ticket]++
      } else {
        types[ticket] = 1
      }

      return types
    })

    return {
      types, seatsTotal
    }
  }

  #validateRequests = (ticketTypeRequestsSummary) => {
    const { adult, infant } = ticketTypeRequestsSummary.types
    const { seatsTotal } = ticketTypeRequestsSummary
    const errors = []

    if (!adult) {
      errors.push(new Error("At least one adult ticket is required but none have been requested"))
    }

    if (infant > (adult || 0))  {
      errors.push(new Error("Each infant required to sit on adults lap, but number of infants exceeds number of adults"))
    }

    if (seatsTotal > CONFIG.MAX_TICKETS ) {
      errors.push(new Error("Max number of tickets exceeded"))
    }

    if (errors.length > 0) {
      throw errors
    }
  }

  #calculateCost = (types, TICKET_PRICES) => {
    let totalCost = 0
    Object.keys(types).forEach(key => {
      const cost = TICKET_PRICES[key.toUpperCase()]
      if (cost) {
        totalCost += cost * types[key]
      } else {
        throw new error(`unknown ticket ${ticketType}`)
      }
    })
    return totalCost
  }

   /**
   * Should only have private methods other than the one below.
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {

    const ticketTypeRequestsSummary = this.#getTicketTypesSummary(ticketTypeRequests)

    try {
      this.#validateRequests(ticketTypeRequestsSummary)
      const { seatsTotal } = ticketTypeRequestsSummary
      const cost = this.#calculateCost(ticketTypeRequestsSummary.types, CONFIG.TICKET_PRICES)

    } catch (errors) {
      throw new InvalidPurchaseException(errors)
    }

     /*
     Have used a try/catch above as typically dont want to assume the error should halt the program. In this case the...

    // throws InvalidPurchaseException

    that is already present in the code implies it should throw an error that is uncaught.  I assume the TicketService will be initialised using a try/catch, so any errors, are caught by this when they bubble up to ensure it doesnt stop the code running.
    */
  }
}

const ticketService = new TicketService

ticketService.purchaseTickets(1, 'INFANT','INFANT','ADULT','ADULT','ADULT', 'CHILD')
//ticketService.purchaseTickets(1, 'INFANT','INFANT', 'CHILD')
