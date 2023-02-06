import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: "light",
      }}
    >
      <NotificationsProvider position="bottom-right">
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}
