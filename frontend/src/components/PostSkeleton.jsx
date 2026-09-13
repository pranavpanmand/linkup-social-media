import { Box, Flex, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const PostSkeleton = () => {
	return (
		<Flex gap={3} mb={4} py={3} className="threads-card">
			<Flex flexDirection={"column"} alignItems={"center"}>
				<SkeletonCircle size='10' />
				<Box w='1px' h={"full"} bg='gray.600' my={2}></Box>
			</Flex>
			<Flex flex={1} flexDirection={"column"} gap={2}>
				<Flex justifyContent={"space-between"} w={"full"}>
					<Flex w={"full"} alignItems={"center"} gap={2}>
						<Skeleton h='4' w='24' />
					</Flex>
					<Flex gap={4} alignItems={"center"}>
						<Skeleton h='3' w='12' />
					</Flex>
				</Flex>
				<SkeletonText mt='4' noOfLines={3} spacing='4' skeletonHeight='2' />
				<Skeleton h='200px' w='full' mt={4} borderRadius='md' />
			</Flex>
		</Flex>
	);
};

export default PostSkeleton;
