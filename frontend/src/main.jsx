import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/theme-utils";
import { ColorModeScript } from "@chakra-ui/color-mode";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { SocketContextProvider } from "./context/SocketContext.jsx";

import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const styles = {
	global: (props) => ({
		body: {
			color: mode("gray.800", "whiteAlpha.900")(props),
			bg: mode("gray.50", "#0a0a0a")(props), // darker pure black/gray background
			fontFamily: "Inter, sans-serif",
		},
	}),
};

const config = {
	initialColorMode: "dark",
	useSystemColorMode: true,
};

const colors = {
	gray: {
		light: "#616161",
		dark: "#1e1e1e",
	},
	brand: {
		100: "#e0f2fe",
		500: "#0ea5e9", // vibrant sky blue accent
		900: "#082f49",
	}
};

const fonts = {
	heading: "Inter, sans-serif",
	body: "Inter, sans-serif",
};

const theme = extendTheme({ config, styles, colors, fonts });

ReactDOM.createRoot(document.getElementById("root")).render(
	// React.StrictMode renders every component twice (in the initial render), only in development.
	<React.StrictMode>
		<RecoilRoot>
			<BrowserRouter>
				<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
					<ChakraProvider theme={theme}>
						<ColorModeScript initialColorMode={theme.config.initialColorMode} />
						<SocketContextProvider>
							<App />
						</SocketContextProvider>
					</ChakraProvider>
				</GoogleOAuthProvider>
			</BrowserRouter>
		</RecoilRoot>
	</React.StrictMode>
);
