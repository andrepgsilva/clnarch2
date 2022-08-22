import { test, expect } from '@jest/globals';
import axios from "axios";
import { randomUUID } from 'crypto';

test("It must execute a payment by API", async function() {
  const ticketCode = randomUUID();
  
  const response = await axios({
    url: "http://localhost:3001/transactions",
    method: "post",
    data: {
      ticketCode,
      creditCardNumber: "32141231",
      creditCardCvv: "231",
      creditCardExpDate: "12/22",
      total: 200
    }
  });

  const output = response.data;
  expect(output.success).toBe(true);
});