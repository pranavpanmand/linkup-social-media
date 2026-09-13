import { Box, Flex, Text, Menu, MenuButton, MenuList, MenuItem, Avatar, Badge, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BellIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const NotificationMenu = () => {
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchNotifications = async () => {
		try {
			const res = await fetch("/api/notifications");
			const data = await res.json();
			if (data.error) throw new Error(data.error);
			setNotifications(data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNotifications();
	}, []);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const handleOpen = async () => {
		if (unreadCount > 0) {
			try {
				await fetch("/api/notifications/read", { method: "PUT" });
				setNotifications(notifications.map(n => ({ ...n, read: true })));
			} catch (error) {
				console.error(error);
			}
		}
	};

	return (
		<Menu onOpen={handleOpen}>
			<MenuButton position="relative">
				<BellIcon w={6} h={6} />
				{unreadCount > 0 && (
					<Badge 
						position="absolute" 
						top="-1" 
						right="-1" 
						colorScheme="red" 
						borderRadius="full" 
						fontSize="0.7em"
					>
						{unreadCount}
					</Badge>
				)}
			</MenuButton>
			<MenuList bg="gray.dark" borderColor="gray.700" maxH="400px" overflowY="auto" w="300px">
				{loading ? (
					<Flex justify="center" p={4}><Spinner /></Flex>
				) : notifications.length === 0 ? (
					<MenuItem bg="gray.dark">
						<Text>No notifications</Text>
					</MenuItem>
				) : (
					notifications.map((notif) => (
						<MenuItem 
							key={notif._id} 
							as={Link} 
							to={notif.type === "follow" ? `/${notif.sender.username}` : `/${notif.sender.username}/post/${notif.post?._id}`}
							bg={notif.read ? "gray.dark" : "gray.700"}
							_hover={{ bg: "gray.600" }}
							py={3}
							borderBottom="1px solid"
							borderColor="gray.800"
						>
							<Flex gap={3} align="center">
								<Avatar src={notif.sender.profilePic} size="sm" />
								<Box>
									<Text fontSize="sm" fontWeight={notif.read ? "normal" : "bold"}>
										{notif.sender.username} {notif.type === "like" ? "liked your post" : notif.type === "reply" ? "replied to your post" : notif.type === "follow" ? "started following you" : "reposted your post"}
									</Text>
								</Box>
							</Flex>
						</MenuItem>
					))
				)}
			</MenuList>
		</Menu>
	);
};

export default NotificationMenu;
