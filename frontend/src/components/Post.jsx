import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const Post = ({ post, postedBy }) => {
	const [user, setUser] = useState(null);
	const showToast = useShowToast();
	const currentUser = useRecoilValue(userAtom);
	const [posts, setPosts] = useRecoilState(postsAtom);
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [showHeart, setShowHeart] = useState(false);

	const handleDoubleClick = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		setShowHeart(true);
		setTimeout(() => setShowHeart(false), 800);
		
		if (!currentUser) return;
		try {
			const res = await fetch("/api/posts/like/" + post._id, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
			});
			const data = await res.json();
			if (!data.error) {
				const updatedPosts = posts.map((p) => {
					if (p._id === post._id) {
						const isLiked = p.likes.includes(currentUser._id);
						return { ...p, likes: isLiked ? p.likes.filter(id => id !== currentUser._id) : [...p.likes, currentUser._id] };
					}
					return p;
				});
				setPosts(updatedPosts);
			}
		} catch(err) {}
	};

	const renderTextWithMentionsAndHashtags = (text) => {
		if (!text) return null;
		const words = text.split(/(\s+)/);
		return words.map((word, index) => {
			if (word.startsWith("#") && word.length > 1) {
				return <Text as="span" key={index} color="blue.400" cursor="pointer" _hover={{textDecoration: "underline"}}>{word}</Text>;
			}
			if (word.startsWith("@") && word.length > 1) {
				return <Text as="span" key={index} color="brand.400" fontWeight="bold" cursor="pointer" _hover={{textDecoration: "underline"}} onClick={(e) => {
					e.preventDefault();
					navigate(`/${word.substring(1)}`);
				}}>{word}</Text>;
			}
			return word;
		});
	};

	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch("/api/users/profile/" + postedBy);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setUser(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setUser(null);
			}
		};

		getUser();
	}, [postedBy, showToast]);

	const handleDeletePost = async (e) => {
		try {
			e.preventDefault();
			if (!window.confirm("Are you sure you want to delete this post?")) return;

			const res = await fetch(`/api/posts/${post._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted", "success");
			setPosts(posts.filter((p) => p._id !== post._id));
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	if (!user) return null;
	return (
		<Link to={`/${user.username}/post/${post._id}`}>
			<Flex gap={3} mb={4} py={3} className="threads-card">
				<Flex flexDirection={"column"} alignItems={"center"}>
					<Avatar
						size='md'
						name={user.name}
						src={user?.profilePic}
						onClick={(e) => {
							e.preventDefault();
							navigate(`/${user.username}`);
						}}
					/>
					<Box w='1px' h={"full"} bg='gray.light' my={2}></Box>
					<Box position={"relative"} w={"full"}>
						{post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
						{post.replies[0] && (
							<Avatar
								size='xs'
								name='John doe'
								src={post.replies[0].userProfilePic}
								position={"absolute"}
								top={"0px"}
								left='15px'
								padding={"2px"}
							/>
						)}

						{post.replies[1] && (
							<Avatar
								size='xs'
								name='John doe'
								src={post.replies[1].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								right='-5px'
								padding={"2px"}
							/>
						)}

						{post.replies[2] && (
							<Avatar
								size='xs'
								name='John doe'
								src={post.replies[2].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								left='4px'
								padding={"2px"}
							/>
						)}
					</Box>
				</Flex>
				<Flex flex={1} flexDirection={"column"} gap={2}>
					<Flex justifyContent={"space-between"} w={"full"}>
						<Flex w={"full"} alignItems={"center"}>
							<Text
								fontSize={"sm"}
								fontWeight={"bold"}
								onClick={(e) => {
									e.preventDefault();
									navigate(`/${user.username}`);
								}}
							>
								{user?.username}
							</Text>
							<Image src='/verified.png' w={4} h={4} ml={1} />
						</Flex>
						<Flex gap={4} alignItems={"center"}>
							<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
								{formatDistanceToNow(new Date(post.createdAt))} ago
							</Text>

							{currentUser?._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost} />}
						</Flex>
					</Flex>

					<Text fontSize={"sm"}>{renderTextWithMentionsAndHashtags(post.text)}</Text>
					{post.img && (
						<Box 
							position="relative"
							borderRadius={6} 
							overflow={"hidden"} 
							border={"1px solid"} 
							borderColor={"gray.light"}
							onClick={(e) => {
								e.preventDefault();
								onOpen();
							}}
							onDoubleClick={handleDoubleClick}
							cursor="pointer"
						>
							<Image src={post.img} w={"full"} />
							<AnimatePresence>
								{showHeart && (
									<Flex 
										as={motion.div} 
										initial={{ opacity: 0, scale: 0.5 }} 
										animate={{ opacity: 1, scale: 1.2 }} 
										exit={{ opacity: 0, scale: 1 }} 
										transition={{ duration: 0.3 }}
										position="absolute" 
										top="0" left="0" w="full" h="full" 
										alignItems="center" justifyContent="center"
										pointerEvents="none"
									>
										<FaHeart size={80} color="red" style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))" }} />
									</Flex>
								)}
							</AnimatePresence>
						</Box>
					)}

					<Flex gap={3} my={1}>
						<Actions post={post} />
					</Flex>
				</Flex>
			</Flex>

			{/* Image Lightbox Modal */}
			{post.img && (
				<Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
					<ModalOverlay bg="blackAlpha.800" backdropFilter="blur(10px)" />
					<ModalContent bg="transparent" boxShadow="none">
						<ModalCloseButton color="white" />
						<ModalBody display="flex" justifyContent="center" alignItems="center" p={0} onClick={onClose}>
							<Image 
								src={post.img} 
								maxH="90vh" 
								maxW="90vw" 
								objectFit="contain" 
								borderRadius="md" 
								boxShadow="0 0 40px rgba(0,0,0,0.5)"
							/>
						</ModalBody>
					</ModalContent>
				</Modal>
			)}
		</Link>
	);
};

export default Post;
