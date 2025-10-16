import express from "express";
import { 
  addMessage, 
  getMessagesByTicketID, 
  updateMessage, 
  deleteMessage,
  markMessagesAsRead,
  getUnreadCount
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/:ticketID", addMessage);
router.get("/:ticketID", getMessagesByTicketID);
router.patch("/:ticketID/read", markMessagesAsRead);
router.get("/:ticketID/unread-count", getUnreadCount);
router.put("/:id", updateMessage);
router.delete("/:id", deleteMessage);

export default router;
