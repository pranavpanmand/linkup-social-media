import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	Input,
	InputGroup,
	InputLeftElement,
	Flex,
	Text,
	Avatar,
	useDisclosure,
	Box,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CommandPalette = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [searchText, setSearchText] = useState("");
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const handleKeyDown = (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				isOpen ? onClose() : onOpen();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onOpen, onClose]);

	useEffect(() => {
		const fetchUsers = async () => {
			if (!searchText.trim()) {
				setUsers([]);
				return;
			}
			setLoading(true);
			try {
				const res = await fetch(`/api/users/profile/${searchText}`);
				const data = await res.json();
				if (!data.error) {
					// The route returns a single user, or we can search all.
					// Currently the backend /api/users/profile/:query returns a user if found by username or ID.
					// Ideally we'd have a search route, but let's just show this single result for now if it exists.
					setUsers([data]);
				} else {
					setUsers([]);
				}
			} catch (error) {
				setUsers([]);
			} finally {
				setLoading(false);
			}
		};
		
		const timer = setTimeout(fetchUsers, 500);
		return () => clearTimeout(timer);
	}, [searchText]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="lg">
			<ModalOverlay bg="blackAlpha.700" backdropFilter="blur(5px)" />
			<ModalContent bg="gray.800" borderRadius="xl" overflow="hidden" mt="20vh" border="1px solid" borderColor="gray.700">
				<InputGroup size="lg">
					<InputLeftElement pointerEvents="none">
						<SearchIcon color="gray.400" />
					</InputLeftElement>
					<Input
						placeholder="Search users or jump to..."
						variant="unstyled"
						p={4}
						pl={12}
						fontSize="lg"
						autoFocus
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
				</InputGroup>
				<ModalBody p={0}>
					{users.length > 0 && (
						<Box borderTop="1px solid" borderColor="gray.700" p={2}>
							<Text fontSize="xs" color="gray.400" px={2} mb={2} textTransform="uppercase" fontWeight="bold">Users</Text>
							{users.map((user) => (
								<Flex
									key={user._id}
									alignItems="center"
									p={3}
									borderRadius="md"
									_hover={{ bg: "whiteAlpha.200", cursor: "pointer" }}
									onClick={() => {
										onClose();
										setSearchText("");
										navigate(`/${user.username}`);
									}}
								>
									<Avatar size="sm" src={user.profilePic} mr={3} />
									<Text fontWeight="bold">{user.username}</Text>
								</Flex>
							))}
						</Box>
					)}
					{searchText && !loading && users.length === 0 && (
						<Flex p={6} justifyContent="center">
							<Text color="gray.400">No results found for "{searchText}"</Text>
						</Flex>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default CommandPalette;
