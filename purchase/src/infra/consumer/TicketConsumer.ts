import ConfirmTicket from "../../application/ConfirmTicket";
import PurchaseTicket from "../../application/PurchaseTicket";
import Queue from "../queue/Queue";

export default class TicketConsumer {
  constructor (
    readonly queue: Queue, 
    readonly confirmTicket: ConfirmTicket,
    readonly purchaseTicket: PurchaseTicket,
  ) {
    queue.consume("transactionApproved", async function (msg: any) {
      try {
        await confirmTicket.execute(msg.externalCode);
      } catch (error) {
        console.log(error);
      }
    });

    queue.consume("purchaseTicket", async (message:any) => {
      await purchaseTicket.execute(message);
    });
  }
}