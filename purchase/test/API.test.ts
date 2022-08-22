import { test, expect } from '@jest/globals';
import axios from "axios";
import { randomUUID } from 'crypto';

function sleep(timeout: number) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(true);
    }, timeout);
  })
}

test("It must buy a ticket by API", async function() {
  const ticketCode = randomUUID();
  
  await axios({
    url: "http://localhost:3000/purchases",
    method: "post",
    data: {
      ticketCode,
      participantName: "Peter",
      participantEmail: "peter@example.com",
      eventCode: "SQXIUE21SF",
      creditCardNumber: "32141231",
      creditCardCvv: "231",
      creditCardExpDate: "12/22"
    }
  })

  await sleep(500);

  const response = await axios({
    url: `http://localhost:3000/tickets/${ticketCode}`,
    method: "get",
  })

  const output = response.data;
  expect(output.total).toBe(200);
  expect(output.status).toBe("confirmed");
});