import { Flex, Text, Box } from "@chakra-ui/react";

const EmptyState = ({ message, subMessage }) => {
	return (
		<Flex 
			direction="column" 
			alignItems="center" 
			justifyContent="center" 
			py={20} 
			className="layout-border"
			mt={6}
		>
			<Box mb={6} opacity={0.8}>
				<svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="100" cy="100" r="80" fill="url(#paint0_linear)" fillOpacity="0.1"/>
					<path d="M70 120C70 120 85 140 100 140C115 140 130 120 130 120" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" color="#0ea5e9"/>
					<circle cx="75" cy="85" r="10" fill="#0ea5e9"/>
					<circle cx="125" cy="85" r="10" fill="#0ea5e9"/>
					<defs>
						<linearGradient id="paint0_linear" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
							<stop stopColor="#0ea5e9" />
							<stop offset="1" stopColor="#8b5cf6" />
						</linearGradient>
					</defs>
				</svg>
			</Box>
			<Text fontSize="2xl" fontWeight="bold" color="white" mb={2}>
				{message}
			</Text>
			<Text color="gray.400">{subMessage}</Text>
		</Flex>
	);
};

export default EmptyState;
