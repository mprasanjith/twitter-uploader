import Head from "next/head";
import LoginButton from "@/components/LoginButton";
import { Container, Flex } from "@mantine/core";
import { useSession } from "next-auth/react";
import Uploader from "@/components/Uploader";

export default function Home() {
  const { data } = useSession();

  return (
    <>
      <Head>
        <title>Twitter Uploader</title>
        <meta name="description" content="Simple Twitter Uploader" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Flex
          mih="100vh"
          gap="md"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <LoginButton />

          {data && <Uploader />}
        </Flex>
      </Container>
    </>
  );
}
