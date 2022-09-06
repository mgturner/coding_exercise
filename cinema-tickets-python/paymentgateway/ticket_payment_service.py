
class TicketPaymentService:

    def make_payment(self, account_id, total_amount_to_pay):

        if not isinstance(account_id, int):

            raise TypeError("account_id must be an integer")

        if not isinstance(total_amount_to_pay, int):

            raise TypeError("total_amount_to_pay must be an integer")
