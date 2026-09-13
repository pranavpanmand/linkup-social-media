import Notification from "../models/notificationModel.js";

const getNotifications = async (req, res) => {
	try {
		const notifications = await Notification.find({ recipient: req.user._id })
			.sort({ createdAt: -1 })
			.populate("sender", "username profilePic")
			.populate("post", "text img");

		res.status(200).json(notifications);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const markAsRead = async (req, res) => {
	try {
		await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
		res.status(200).json({ message: "Notifications marked as read" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export { getNotifications, markAsRead };
