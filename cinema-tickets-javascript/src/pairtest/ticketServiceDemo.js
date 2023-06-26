import TicketService from './TicketService.js'
import TicketTypeRequest from './lib/TicketTypeRequest.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';


const demo = (async () => {
  const ticketPaymentService = new TicketPaymentService
  const seatReservationService = new SeatReservationService

  const ticketService = new TicketService(ticketPaymentService, seatReservationService)
  const adultTicketRequest = new TicketTypeRequest('ADULT', 2);
  const infantTicketRequest = new TicketTypeRequest('INFANT', 2);
  const childTicketRequest = new TicketTypeRequest('CHILD', 2);

  //the 'await' below, and also setting this up as a async function is totally unnecessary, just in real world it would likely require this
  await ticketService.purchaseTickets(1, adultTicketRequest, infantTicketRequest, childTicketRequest);
  console.log('Tickets reserved')
})()
