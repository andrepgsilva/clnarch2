import EventMemoryRepository from "./infra/repository/EventMemoryRepository";
import TicketMemoryRepository from "./infra/repository/TicketMemoryRepository";
import Event from "./domain/entity/Event";
import PurchaseTicket from "./application/PurchaseTicket";
import GetTicket from "./application/GetTicket";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import MainController from "./infra/controller/MainController";
import PaymentGateway from "./infra/gateway/PaymentGateway";
import AxiosAdapter from "./infra/gateway/AxiosAdapter";
import RabbitMQAdapter from "./infra/queue/RabbitMQAdapter";
import TicketConsumer from "./infra/consumer/TicketConsumer";
import ConfirmTicket from "./application/ConfirmTicket";

async function init () {
  const httpServer = new ExpressAdapter();
  const httpClient = new AxiosAdapter();
  
  const ticketRepository = new TicketMemoryRepository();
  const eventRepository = new EventMemoryRepository();
  const paymentGateway = new PaymentGateway(httpClient);
  
  eventRepository.save(new Event("SQXIUE21SF", "Super Event", 200));
  const queue = new RabbitMQAdapter();
  await queue.connect();
  const purchaseTicket = new PurchaseTicket(
    ticketRepository, 
    eventRepository, 
    paymentGateway, 
    queue
  );
  const getTicket = new GetTicket(ticketRepository, eventRepository);
  
  new MainController(httpServer, purchaseTicket, getTicket, queue);
  const confirmTicket = new ConfirmTicket(ticketRepository);
  new TicketConsumer(queue, confirmTicket, purchaseTicket);
  
  httpServer.listen(3000);
}

init();