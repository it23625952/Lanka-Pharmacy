import express from "express";
import { 
  getChatMessages, 
  getChatHistory, 
  sendChatMessage, 
  deleteChatMessage,
  markMessagesAsRead
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/:ticketID", getChatMessages);
router.get("/history/:ticketID", getChatHistory);
router.post("/send", sendChatMessage);
router.patch("/:ticketID/read", markMessagesAsRead);
router.delete("/:messageId", deleteChatMessage);

export default router;
