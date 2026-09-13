import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	HStack,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { motion, AnimatePresence } from "framer-motion";

export default function SignupCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const [inputs, setInputs] = useState({
		name: "",
		username: "",
		email: "",
		password: "",
	});

	const showToast = useShowToast();
	const setUser = useSetRecoilState(userAtom);
	const [step, setStep] = useState(1);

	const handleNext = () => setStep(step + 1);
	const handleBack = () => setStep(step - 1);

	const handleSignup = async () => {
		try {
			const res = await fetch("/api/users/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			localStorage.setItem("user-threads", JSON.stringify(data));
			setUser(data);
		} catch (error) {
			showToast("Error", error, "error");
		}
	};

	return (
		<Flex align={"center"} justify={"center"}>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Sign up
					</Heading>
				</Stack>
				<Box rounded={"lg"} className="layout-border" p={8} overflow="hidden" position="relative" minH="350px">
					<AnimatePresence mode="wait">
						{step === 1 && (
							<motion.div
								key="step1"
								initial={{ opacity: 0, x: -50 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 50 }}
								transition={{ duration: 0.3 }}
							>
								<Stack spacing={4}>
									<HStack>
										<Box>
											<FormControl isRequired>
												<FormLabel>Full name</FormLabel>
												<Input
													type='text'
													onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
													value={inputs.name}
												/>
											</FormControl>
										</Box>
										<Box>
											<FormControl isRequired>
												<FormLabel>Username</FormLabel>
												<Input
													type='text'
													onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
													value={inputs.username}
												/>
											</FormControl>
										</Box>
									</HStack>
									<Stack spacing={10} pt={2}>
										<Button
											size='lg'
											bg="white"
											color="black"
											_hover={{ bg: "gray.200" }}
											onClick={handleNext}
											isDisabled={!inputs.name || !inputs.username}
											borderRadius="full"
										>
											Next
										</Button>
									</Stack>
									<Stack pt={6}>
										<Text align={"center"}>
											Already a user?{" "}
											<Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
												Login
											</Link>
										</Text>
									</Stack>
								</Stack>
							</motion.div>
						)}

						{step === 2 && (
							<motion.div
								key="step2"
								initial={{ opacity: 0, x: -50 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 50 }}
								transition={{ duration: 0.3 }}
							>
								<Stack spacing={4}>
									<FormControl isRequired>
										<FormLabel>Email address</FormLabel>
										<Input
											type='email'
											onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
											value={inputs.email}
										/>
									</FormControl>
									<FormControl isRequired>
										<FormLabel>Password</FormLabel>
										<InputGroup>
											<Input
												type={showPassword ? "text" : "password"}
												onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
												value={inputs.password}
											/>
											<InputRightElement h={"full"}>
												<Button
													variant={"ghost"}
													onClick={() => setShowPassword((showPassword) => !showPassword)}
												>
													{showPassword ? <ViewIcon /> : <ViewOffIcon />}
												</Button>
											</InputRightElement>
										</InputGroup>
									</FormControl>
									<Stack spacing={4} pt={2} direction="row">
										<Button
											size='lg'
											variant="outline"
											color="white"
											onClick={handleBack}
											borderRadius="full"
											flex={1}
										>
											Back
										</Button>
										<Button
											loadingText='Submitting'
											size='lg'
											bg="white"
											color="black"
											_hover={{ bg: "gray.200" }}
											onClick={handleSignup}
											isDisabled={!inputs.email || !inputs.password}
											borderRadius="full"
											flex={1}
										>
											Sign up
										</Button>
									</Stack>
								</Stack>
							</motion.div>
						)}
					</AnimatePresence>
				</Box>
			</Stack>
		</Flex>
	);
}
