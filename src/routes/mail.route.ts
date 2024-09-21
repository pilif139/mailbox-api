import express from 'express';
import { getMails, createMail, getMail, updateMail, deleteMail, patchMail } from '../controllers/mail.controller';

const router = express.Router();

router.get("/mails", getMails);
router.post("/mail", createMail);
router.get("/mail/:id", getMail);
router.put("/mail/:id", updateMail);
router.delete("/mail/:id", deleteMail);
router.patch("/mail/:id", patchMail);

export default router;