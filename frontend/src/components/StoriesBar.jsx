import { Avatar, Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Link } from "react-router-dom";

const StoriesBar = () => {
	const [suggestedUsers, setSuggestedUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const showToast = useShowToast();
	const borderColor = useColorModeValue("gray.300", "gray.700");

	useEffect(() => {
		const getSuggestedUsers = async () => {
			try {
				const res = await fetch("/api/users/suggested");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setSuggestedUsers(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getSuggestedUsers();
	}, [showToast]);

	if (loading || suggestedUsers.length === 0) return null;

	return (
		<Box w="full" overflowX="auto" pb={4} mb={6} css={{ "&::-webkit-scrollbar": { display: "none" } }}>
			<Flex gap={4}>
				{/* "Your Story" Placeholder */}
				<Flex direction="column" alignItems="center" cursor="pointer" flexShrink={0}>
					<Box 
						p={1} 
						borderRadius="full" 
						bgGradient="linear(to-tr, yellow.400, pink.500, purple.500)"
					>
						<Box bg={useColorModeValue("white", "gray.dark")} p={"2px"} borderRadius="full">
							<Avatar size="lg" src="" />
						</Box>
					</Box>
					<Text fontSize="xs" mt={1} fontWeight="bold">Your Story</Text>
				</Flex>

				{suggestedUsers.map((user) => (
					<Link key={user._id} to={`/${user.username}`}>
						<Flex direction="column" alignItems="center" cursor="pointer" flexShrink={0}>
							<Box 
								p={1} 
								borderRadius="full" 
								bgGradient="linear(to-tr, brand.400, blue.500, cyan.400)"
							>
								<Box bg={useColorModeValue("white", "gray.dark")} p={"2px"} borderRadius="full">
									<Avatar size="lg" src={user.profilePic} />
								</Box>
							</Box>
							<Text fontSize="xs" mt={1}>{user.username.substring(0, 10)}</Text>
						</Flex>
					</Link>
				))}
			</Flex>
		</Box>
	);
};

export default StoriesBar;
