import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import config from '../config.js'
export default class TicketService {

  constructor(ticketPaymentService, seatReservationService) {
    this.ticketPaymentService = ticketPaymentService
    this.seatReservationService = seatReservationService
  }

  #getTicketTypesSummary = (ticketTypeRequests) => {
    let types = {}
    let seatsTotal = 0
    const { SEAT_ALLOCATION } = config

    //return ticketTypeRequests.reduce((summary, ticket) =>{
    ticketTypeRequests.forEach((ticketRequest) => {
      const ticketType = ticketRequest.getTicketType().toLowerCase();
      const noOfTickets = ticketRequest.getNoOfTickets();
      seatsTotal += SEAT_ALLOCATION[ticketType.toUpperCase()] * noOfTickets;

      if (types[ticketType]) {
        types[ticketType]+= noOfTickets
      } else {
        types[ticketType] = noOfTickets
      }
    })

    return {
      types, seatsTotal
    }
  }

  #validateRequests = (ticketTypeRequestsSummary) => {
    const { adult, infant } = ticketTypeRequestsSummary.types
    const { seatsTotal } = ticketTypeRequestsSummary
    const errors = []

    if (infant > (adult || 0))  {
      errors.push(new Error("Each infant required to sit on adults lap, but number of infants exceeds number of adults"))
    }

    if (seatsTotal > config.MAX_TICKETS ) {
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
  async purchaseTickets(accountId, ...ticketTypeRequests) {//async isn't needed, when makePayment and reserveSeat are in real world it likely will

    const ticketTypeRequestsSummary = this.#getTicketTypesSummary(ticketTypeRequests)

    try {
      this.#validateRequests(ticketTypeRequestsSummary)
      const { seatsTotal } = ticketTypeRequestsSummary
      const cost = this.#calculateCost(ticketTypeRequestsSummary.types, config.TICKET_PRICES)

      //spec says no changes to makePayment and reserveSeat, assume all working so wont await a response
      this.ticketPaymentService.makePayment(accountId, cost)
      this.seatReservationService.reserveSeat(accountId, seatsTotal)

      return true
    } catch (errors) {
      throw new InvalidPurchaseException(errors)
    }
  }
}
