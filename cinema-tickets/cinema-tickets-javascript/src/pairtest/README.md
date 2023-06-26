# Cinema Tickets

Coding exercise

## Getting Started

npm run demo

## Usage

Change the values in ticketServiceDemo.js for different combinations

```javascript
const adultTicketRequest = new TicketTypeRequest('ADULT', 2);
const infantTicketRequest = new TicketTypeRequest('INFANT', 2);
const childTicketRequest = new TicketTypeRequest('CHILD', 2);
```

e.g. have it fail for too many tickets and less adults than infants...
```javascript
const adultTicketRequest = new TicketTypeRequest('ADULT', 11);
const infantTicketRequest = new TicketTypeRequest('INFANT', 12);
const childTicketRequest = new TicketTypeRequest('CHILD', 11);
```

If the ticket request for an individual type is invalid, it throws an error at that point.  If Each of the individual TicketTypeRequest are ok, but the combination of them is bad, it fails listing all the issues.

## Notes

Errors are thrown rather than handled gracefully, this is to be expected with the supplied code, marked as not to be changed for the exercise.

References async/await, totally unnecessary, just to show how would work in real world scenario.

## Still To-Do

- [ ] Add unit tests
- [ ] Validation code to one shared file

