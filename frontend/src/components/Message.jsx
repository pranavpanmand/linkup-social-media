import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsTrash } from "react-icons/bs";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

const Message = ({ ownMessage, message, setMessages }) => {
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const user = useRecoilValue(userAtom);
	const [imgLoaded, setImgLoaded] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const showToast = useShowToast();

	const handleDelete = async () => {
		if (isDeleting) return;
		setIsDeleting(true);
		try {
			const res = await fetch(`/api/messages/${message._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Message deleted", "success");
			if (setMessages) {
				setMessages((messages) => messages.filter((m) => m._id !== message._id));
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			{ownMessage ? (
				<Flex gap={2} alignSelf={"flex-end"} align="center" _hover={{ "& .delete-icon": { opacity: 1 } }}>
					<Box
						className="delete-icon"
						opacity={0}
						transition="opacity 0.2s"
						cursor="pointer"
						color="red.500"
						onClick={handleDelete}
					>
						<BsTrash size={16} />
					</Box>
					{message.text && (
						<Flex bg={"gray.700"} maxW={"350px"} p={3} borderRadius={"xl"} borderBottomRightRadius="sm">
							<Text color={"white"} fontSize="md">{message.text}</Text>
							<Box
								alignSelf={"flex-end"}
								ml={2}
								color={message.seen ? "white" : "whiteAlpha.600"}
								fontWeight={"bold"}
							>
								<BsCheck2All size={16} />
							</Box>
						</Flex>
					)}
					{message.img && !imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image
								src={message.img}
								hidden
								onLoad={() => setImgLoaded(true)}
								alt='Message image'
								borderRadius={4}
							/>
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

					{message.img && imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image src={message.img} alt='Message image' borderRadius={4} />
							<Box
								alignSelf={"flex-end"}
								ml={1}
								color={message.seen ? "blue.400" : ""}
								fontWeight={"bold"}
							>
								<BsCheck2All size={16} />
							</Box>
						</Flex>
					)}

					<Avatar src={user.profilePic} w='7' h={7} />
				</Flex>
			) : (
				<Flex gap={2}>
					<Avatar src={selectedConversation.userProfilePic} w='7' h={7} />

					{message.text && (
						<Text maxW={"350px"} bg={"gray.800"} p={3} borderRadius={"xl"} borderBottomLeftRadius="sm" color={"white"} fontSize="md" boxShadow="sm">
							{message.text}
						</Text>
					)}
					{message.img && !imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image
								src={message.img}
								hidden
								onLoad={() => setImgLoaded(true)}
								alt='Message image'
								borderRadius={4}
							/>
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

					{message.img && imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image src={message.img} alt='Message image' borderRadius={4} />
						</Flex>
					)}
				</Flex>
			)}
		</>
	);
};

export default Message;
