import TicketService from './TicketService.js'
import TicketTypeRequest from './lib/TicketTypeRequest.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

try {
  const ticketPaymentService = new TicketPaymentService
  const seatReservationService = new SeatReservationService

  const ticketService = new TicketService(ticketPaymentService, seatReservationService)
  const adultTicketRequest = new TicketTypeRequest('ADULT', 2);
  const infantTicketRequest = new TicketTypeRequest('INFANT', 2);
  const childTicketRequest = new TicketTypeRequest('CHILD', 2);

  ticketService.purchaseTickets(1, adultTicketRequest, infantTicketRequest, childTicketRequest);
} catch(err) {
  throw err
}
