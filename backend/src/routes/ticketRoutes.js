import express from "express";
import { 
  createTicket, 
  getTickets, 
  getTicketById, 
  updateTicket, 
  deleteTicket, 
  assignTicket,
  updateTicketStatus,
  getCustomerTickets,
  getTicketStats
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/", createTicket);
router.get("/", getTickets);
router.get("/stats", getTicketStats);  
router.get("/customer/:customerID", getCustomerTickets);
router.get("/:id", getTicketById);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);
router.patch("/:id/assign", assignTicket);
router.patch("/:id/status", updateTicketStatus);

export default router;
