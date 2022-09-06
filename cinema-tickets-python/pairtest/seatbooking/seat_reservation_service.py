
class SeatReservationService:

    def reserve_seat(self, account_id, total_seats_to_allocate):

        if not isinstance(account_id, int):

            raise TypeError("account_id must be an integer")

        if not isinstance(total_seats_to_allocate, int):

            raise TypeError("total_seats_to_allocate must be an integer")
