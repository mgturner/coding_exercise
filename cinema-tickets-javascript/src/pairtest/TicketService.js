import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import config from '../config.js'
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {

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

    if (!adult) {
      errors.push(new Error("At least one adult ticket is required but none have been requested"))
    }

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
  purchaseTickets(accountId, ...ticketTypeRequests) {

    const ticketTypeRequestsSummary = this.#getTicketTypesSummary(ticketTypeRequests)

    try {
      this.#validateRequests(ticketTypeRequestsSummary)
      const { seatsTotal } = ticketTypeRequestsSummary


      const cost = this.#calculateCost(ticketTypeRequestsSummary.types, config.TICKET_PRICES)

      const ticketPaymentService = new TicketPaymentService
      ticketPaymentService.makePayment(accountId, cost)

      const seatReservationService = new SeatReservationService
      seatReservationService.reserveSeat(accountId, seatsTotal)
      debugger



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
