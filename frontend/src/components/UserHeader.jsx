import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button, useToast } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }) => {
	const toast = useToast();
	const currentUser = useRecoilValue(userAtom); // logged in user
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

	const copyURL = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				title: "Success.",
				status: "success",
				description: "Profile link copied.",
				duration: 3000,
				isClosable: true,
			});
		});
	};

	return (
		<VStack gap={4} alignItems={"start"} w={"full"} p={4} mb={4}>
			<Flex justifyContent={"space-between"} w={"full"}>
				<Box>
					<Text fontSize={"3xl"} fontWeight={"extrabold"} color="white">
						{user.name}
					</Text>
					<Flex gap={2} alignItems={"center"} mt={1}>
						<Text fontSize={"md"} color="gray.300">@{user.username}</Text>
						<Text fontSize={"xs"} bg={"gray.800"} color={"brand.100"} p={1} px={2} borderRadius={"full"}>
							linkup.io
						</Text>
					</Flex>
				</Box>
				<Box>
					<Avatar
						name={user.name}
						src={user.profilePic || 'https://bit.ly/broken-link'}
						size={{ base: "xl", md: "2xl" }}
					/>
				</Box>
			</Flex>

			<Text fontSize={"md"} mt={2} color="gray.200">{user.bio}</Text>

			<Flex w="full" justifyContent="space-between" alignItems="center" mt={4}>
				{currentUser?._id === user._id && (
					<Button as={RouterLink} to='/update' size={"md"} bg="transparent" border="1px solid" borderColor="gray.600" color="white" _hover={{bg: "whiteAlpha.200"}} borderRadius="full">Update Profile</Button>
				)}
				{currentUser?._id !== user._id && (
					<Button size={"md"} bg="white" color="black" _hover={{bg: "gray.200"}} borderRadius="full" onClick={handleFollowUnfollow} isLoading={updating}>
						{following ? "Unfollow" : "Follow"}
					</Button>
				)}

				<Flex gap={4} alignItems={"center"}>
					<Text color={"gray.400"} fontWeight="semibold">{user.followers.length} followers</Text>
					<Box w='1' h='1' bg={"gray.500"} borderRadius={"full"}></Box>
					<Link color={"gray.400"}>linkup.io</Link>
				</Flex>
			</Flex>
			
			<Flex w={"full"} justifyContent={"flex-end"} mt={2}>
				<Flex gap={2}>
					<Box className='icon-container'>
						<BsInstagram size={24} cursor={"pointer"} />
					</Box>
					<Box className='icon-container'>
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"} />
							</MenuButton>
							<Portal>
								<MenuList bg={"gray.900"} borderColor="gray.700">
									<MenuItem bg={"gray.900"} _hover={{bg: "gray.800"}} onClick={copyURL}>
										Copy link
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>

		</VStack>
	);
};

export default UserHeader;
