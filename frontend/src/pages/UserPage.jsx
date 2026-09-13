import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Tabs, TabList, TabPanels, Tab, TabPanel, Text, Box } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import { MdOutlineGridOn, MdBookmarkBorder } from "react-icons/md";
import EmptyState from "../components/EmptyState";

const UserPage = () => {
	const { user, loading } = useGetUserProfile();
	const { username } = useParams();
	const showToast = useShowToast();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [savedPosts, setSavedPosts] = useState([]);
	const [fetchingPosts, setFetchingPosts] = useState(true);
	const [fetchingSaved, setFetchingSaved] = useState(false);
	const currentUser = useRecoilValue(userAtom);

	useEffect(() => {
		const getPosts = async () => {
			if (!user) return;
			setFetchingPosts(true);
			try {
				const res = await fetch(`/api/posts/user/${username}`);
				const data = await res.json();
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				setFetchingPosts(false);
			}
		};

		const getSavedPosts = async () => {
			if (!user || currentUser?._id !== user._id) return;
			setFetchingSaved(true);
			try {
				const res = await fetch("/api/posts/saved");
				const data = await res.json();
				setSavedPosts(data);
			} catch(error) {
				showToast("Error", error.message, "error");
				setSavedPosts([]);
			} finally {
				setFetchingSaved(false);
			}
		};

		getPosts();
		if (currentUser?._id === user?._id) {
			getSavedPosts();
		}
	}, [username, showToast, setPosts, user, currentUser?._id]);

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!user && !loading) return <h1>User not found</h1>;

	return (
		<>
			<UserHeader user={user} />

			{currentUser?._id === user._id ? (
				<Tabs isFitted variant="enclosed" mt={4}>
					<TabList mb="1em">
						<Tab fontWeight="bold" _selected={{ color: "white", borderColor: "white", borderBottom: "none" }}>
							<Flex alignItems="center" gap={2}><MdOutlineGridOn /> Posts</Flex>
						</Tab>
						<Tab fontWeight="bold" _selected={{ color: "white", borderColor: "white", borderBottom: "none" }}>
							<Flex alignItems="center" gap={2}><MdBookmarkBorder /> Saved</Flex>
						</Tab>
					</TabList>
					<TabPanels>
						<TabPanel p={0}>
							{!fetchingPosts && posts.length === 0 && <EmptyState message="No Posts Yet" subMessage="This user hasn't posted anything." />}
							{fetchingPosts && (
								<Flex justifyContent={"center"} my={12}>
									<Spinner size={"xl"} />
								</Flex>
							)}
							{posts.map((post) => (
								<Post key={post._id} post={post} postedBy={post.postedBy} />
							))}
						</TabPanel>
						<TabPanel p={0}>
							{!fetchingSaved && savedPosts.length === 0 && <EmptyState message="No Saved Posts" subMessage="You haven't saved any posts yet." />}
							{fetchingSaved && (
								<Flex justifyContent={"center"} my={12}>
									<Spinner size={"xl"} />
								</Flex>
							)}
							{savedPosts.map((post) => (
								<Post key={post._id} post={post} postedBy={post.postedBy} />
							))}
						</TabPanel>
					</TabPanels>
				</Tabs>
			) : (
				<Box mt={4}>
					{!fetchingPosts && posts.length === 0 && <EmptyState message="No Posts Yet" subMessage="This user hasn't posted anything." />}
					{fetchingPosts && (
						<Flex justifyContent={"center"} my={12}>
							<Spinner size={"xl"} />
						</Flex>
					)}
					{posts.map((post) => (
						<Post key={post._id} post={post} postedBy={post.postedBy} />
					))}
				</Box>
			)}
		</>
	);
};

export default UserPage;
