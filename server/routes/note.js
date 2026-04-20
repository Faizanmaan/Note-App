const express = require("express");
const Note = require("../models/Note");
const Notification = require("../models/Notification");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

const emitNotification = async (req, recipientId, senderId, noteId, message, action) => {
  const notif = new Notification({ recipient: recipientId, sender: senderId, noteId, message, action });
  await notif.save();
  
  const targetSocketId = req.connectedUsers.get(recipientId.toString());
  if (targetSocketId && req.io) {
    req.io.to(targetSocketId).emit("new_notification", notif);
  }
};

router.post("/create", verifyToken, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content) return res.status(400).json({ message: "Title and content required", isError: true });

    const newNote = new Note({
      title,
      content,
      creator: req.uid,
      tags: tags || []
    });

    await newNote.save();
    
    if (req.io) {
       const sockId = req.connectedUsers.get(req.uid);
       if (sockId) req.io.to(sockId).emit("note_updated", newNote);
    }

    return res.status(201).json({ message: "Note created", note: newNote, isError: false });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", isError: true });
  }
});

router.get("/my-notes", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ creator: req.uid }).populate("creator", "name email").populate("sharedWith.userId", "name email").sort({ updatedAt: -1 });
    return res.status(200).json({ notes, isError: false });
  } catch (error) {
    console.error("Fetch /my-notes error:", error);
    return res.status(500).json({ message: error.message || "Internal server error", debug: error.stack, isError: true });
  }
});

router.get("/shared", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ "sharedWith.userId": req.uid }).populate("creator", "name email").populate("sharedWith.userId", "name email").sort({ updatedAt: -1 });
    return res.status(200).json({ notes, isError: false });
  } catch (error) {
    console.error("Fetch /shared error:", error);
    return res.status(500).json({ message: error.message || "Internal server error", isError: true });
  }
});

router.patch("/update/:id", verifyToken, async (req, res) => {
  try {
    const noteId = req.params.id;
    const { title, content } = req.body;
    
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found", isError: true });
    
    const isOwner = note.creator.toString() === req.uid;
    const isSharedEditor = note.sharedWith.some(share => share.userId.toString() === req.uid && share.permission === "editor");
    
    if (!isOwner && !isSharedEditor) {
      return res.status(403).json({ message: "Permission denied", isError: true });
    }
    
    if (note.isLocked && !isOwner) {
       return res.status(403).json({ message: "Note is locked by owner", isError: true });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    note.lastEditedBy = req.uid;

    await note.save();
    
    if (req.io) {
       const affectedUsers = [note.creator.toString(), ...note.sharedWith.map(s => s.userId.toString())];
       affectedUsers.forEach(uId => {
          if (uId !== req.uid) {
              const sockId = req.connectedUsers.get(uId);
              if (sockId) req.io.to(sockId).emit("note_updated", note);
          }
       });
    }

    return res.status(200).json({ message: "Note updated", note, isError: false });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", isError: true });
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, creator: req.uid });
    if (!note) return res.status(404).json({ message: "Note not found or unauthorized", isError: true });
    
    if (req.io) {
       const affectedUsers = [note.creator.toString(), ...note.sharedWith.map(s => s.userId.toString())];
       affectedUsers.forEach(uId => {
          const sockId = req.connectedUsers.get(uId);
          if (sockId) req.io.to(sockId).emit("note_updated", note);
       });
    }

    return res.status(200).json({ message: "Note deleted", isError: false });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", isError: true });
  }
});

router.patch("/favorite/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found", isError: true });

    const isOwner = note.creator.toString() === req.uid;
    const isShared = note.sharedWith.some(share => share.userId.toString() === req.uid);
    if (!isOwner && !isShared) return res.status(403).json({ message: "Permission denied", isError: true });

    const favIndex = note.isFavoriteBy.findIndex(id => id.toString() === req.uid);
    if (favIndex > -1) {
      note.isFavoriteBy.splice(favIndex, 1);
    } else {
      note.isFavoriteBy.push(req.uid);
    }
    
    await note.save();

    if (req.io) {
       const affectedUsers = [note.creator.toString(), ...note.sharedWith.map(s => s.userId.toString())];
       affectedUsers.forEach(uId => {
          const sockId = req.connectedUsers.get(uId);
          if (sockId) req.io.to(sockId).emit("note_updated", note);
       });
    }

    return res.status(200).json({ message: "Favorite toggled", isError: false });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", isError: true });
  }
});

router.post("/share/:id", verifyToken, async (req, res) => {
  try {
    const { targetUserIds, permission } = req.body; // Expect array of user IDs
    if (!Array.isArray(targetUserIds)) return res.status(400).json({ message: "targetUserIds must be an array", isError: true });

    const note = await Note.findOne({ _id: req.params.id, creator: req.uid });
    if (!note) return res.status(404).json({ message: "Note not found or unauthorized", isError: true });
    
    for (const targetUserId of targetUserIds) {
       const existingShare = note.sharedWith.find(s => s.userId.toString() === targetUserId);
       if (existingShare) {
         existingShare.permission = permission || "viewer";
       } else {
         note.sharedWith.push({ userId: targetUserId, permission: permission || "viewer" });
       }
       await emitNotification(req, targetUserId, req.uid, note._id, `A note "${note.title}" has been shared with you`, "shared");
    }
    
    await note.save();
    
    if (req.io) {
       const affectedUsers = [note.creator.toString(), ...note.sharedWith.map(s => s.userId.toString())];
       affectedUsers.forEach(uId => {
          const sockId = req.connectedUsers.get(uId);
          if (sockId) req.io.to(sockId).emit("note_updated", note);
       });
    }

    return res.status(200).json({ message: "Note shared successfully", isError: false });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", isError: true });
  }
});

router.delete("/unshare/:id/:targetUserId", verifyToken, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, creator: req.uid });
    if (!note) return res.status(404).json({ message: "Note not found or unauthorized", isError: true });

    const initialShareCount = note.sharedWith.length;
    note.sharedWith = note.sharedWith.filter(s => s.userId.toString() !== req.params.targetUserId);

    if (note.sharedWith.length === initialShareCount) {
       return res.status(400).json({ message: "User not found in share list", isError: true });
    }

    await note.save();

    if (req.io) {
       const affectedUsers = [note.creator.toString(), ...note.sharedWith.map(s => s.userId.toString()), req.params.targetUserId];
       affectedUsers.forEach(uId => {
          const sockId = req.connectedUsers.get(uId);
          if (sockId) req.io.to(sockId).emit("note_updated", note);
       });
    }

    return res.status(200).json({ message: "Access revoked successfully", isError: false });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", isError: true });
  }
});

module.exports = router;
