import TicketService from './TicketService.js'
import TicketTypeRequest from './lib/TicketTypeRequest.js';

try {
  const ticketService = new TicketService
  const adultTicketRequest = new TicketTypeRequest('ADULT', 2);
  const infantTicketRequest = new TicketTypeRequest('INFANT', 2);
  const childTicketRequest = new TicketTypeRequest('CHILD', 2);

  ticketService.purchaseTickets(1, adultTicketRequest, infantTicketRequest, childTicketRequest);
} catch(err) {
  throw err
}
