import { test, expect } from '@jest/globals';
import { randomUUID } from "crypto";
import GetTicket from "../src/application/GetTicket";
import PurchaseTicket from "../src/application/PurchaseTicket";
import TicketMemoryRepository from "../src/infra/repository/TicketMemoryRepository";
import EventMemoryRepository from "../src/infra/repository/EventMemoryRepository";
import Event from "../src/domain/entity/Event";
import PaymentGateway from '../src/infra/gateway/PaymentGateway';
import AxiosAdapter from "../src/infra/gateway/AxiosAdapter";
import RabbitMQAdapter from "../src/infra/queue/RabbitMQAdapter";


test.skip("It must buy a ticket", async function() {
  const ticketRepository = new TicketMemoryRepository();
  const eventRepository = new EventMemoryRepository();
  const httpClient = new AxiosAdapter();
  const queue = new RabbitMQAdapter();

  eventRepository.save(new Event("SQXIUE21SF", "Super Event", 200));

  const paymentGateway = new PaymentGateway(httpClient);
  const purchaseTicket = new PurchaseTicket(ticketRepository, eventRepository, paymentGateway, queue);

  const ticketCode = randomUUID();

  const input = {
    ticketCode,
    participantName: "Peter",
    participantEmail: "peter@example.com",
    eventCode: "SQXIUE21SF",
    creditCardNumber: "32141231",
    creditCardCvv: "231",
    creditCardExpDate: "12/22"
  }
  
  await purchaseTicket.execute(input);

  const getTicket = new GetTicket(ticketRepository, eventRepository);

  const output = await getTicket.execute(ticketCode);

  expect(output.total).toBe(200);
})