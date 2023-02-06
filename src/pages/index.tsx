import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import LoginButton from "@/components/LoginButton";
import { Container, Flex } from "@mantine/core";
import { useSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

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

          {data && <div>Uploader</div>}
        </Flex>
      </Container>
    </>
  );
}
