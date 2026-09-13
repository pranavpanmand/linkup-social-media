import { Box, Flex, Grid, Image, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Link } from "react-router-dom";
import { FaHeart, FaComment } from "react-icons/fa";

const ExplorePage = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const showToast = useShowToast();

	useEffect(() => {
		const getExplorePosts = async () => {
			try {
				const res = await fetch("/api/posts/explore");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				// Filter out posts without images to make the grid look like Instagram Explore
				const imagePosts = data.filter((post) => post.img);
				setPosts(imagePosts);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getExplorePosts();
	}, [showToast]);

	if (loading) {
		return (
			<Flex justifyContent="center" mt={20}>
				<Spinner size="xl" />
			</Flex>
		);
	}

	return (
		<Box w="full" px={4} pb={10}>
			<Text fontSize="3xl" fontWeight="bold" mb={6} color="white">
				Explore
			</Text>
			<Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={4}>
				{posts.map((post) => (
					<Link key={post._id} to={`/${post.postedBy.username}/post/${post._id}`}>
						<Box 
							position="relative" 
							overflow="hidden" 
							borderRadius="lg" 
							aspectRatio={1}
							role="group"
						>
							<Image 
								src={post.img} 
								w="full" 
								h="full" 
								objectFit="cover" 
								transition="transform 0.3s ease"
								_groupHover={{ transform: "scale(1.05)" }}
							/>
							<Flex 
								position="absolute" 
								top={0} 
								left={0} 
								w="full" 
								h="full" 
								bg="blackAlpha.600" 
								opacity={0}
								transition="opacity 0.3s ease"
								_groupHover={{ opacity: 1 }}
								justifyContent="center"
								alignItems="center"
								gap={6}
								color="white"
							>
								<Flex alignItems="center" gap={2}>
									<FaHeart size={20} />
									<Text fontWeight="bold">{post.likes.length}</Text>
								</Flex>
								<Flex alignItems="center" gap={2}>
									<FaComment size={20} />
									<Text fontWeight="bold">{post.replies.length}</Text>
								</Flex>
							</Flex>
						</Box>
					</Link>
				))}
			</Grid>
		</Box>
	);
};

export default ExplorePage;
