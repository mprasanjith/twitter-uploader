import { useEffect, useMemo, useState } from "react";
import {
  Text,
  Image,
  SimpleGrid,
  Flex,
  Textarea,
  Box,
  Button,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useClipboard } from "@mantine/hooks";

function Uploader() {
  const [loading, setLoading] = useState(false);
  const [tweet, setTweet] = useState<string>("The Twitter API still works!");
  const [file, setFile] = useState<FileWithPath | null>(null);
  const clipboard = useClipboard({ timeout: 500 });

  const imageUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  const selectFile = (files: FileWithPath[]) => {
    const file = files.length ? files[0] : null;
    setFile(file);
  };

  const upload = async () => {
    if (!tweet || !file) return null;
    setLoading(true);
    showNotification({
      id: "post-state",
      title: "Posting tweet...",
      message: "Please wait white the tweet is being posted",
      color: "blue",
      loading: true,
    });

    const formData = new FormData();
    formData.append("media", file);
    formData.append("content", tweet);
    const response = await fetch(`/api/upload`, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();

      clipboard.copy(data.url);
      updateNotification({
        id: "post-state",
        title: "Tweet live!",
        message: "The tweet URL has been copied to your clipboard.",
        color: "green",
        loading: false,
      });
    } else {
      updateNotification({
        id: "post-state",
        title: "Something went wrong.",
        message:
          "We ran into an error trying to post to Twitter. Please retry.",
        color: "red",
        loading: false,
      });
    }
    setLoading(false);
  };

  return (
    <Box mt={50}>
      <Textarea
        label="Enter tweet text"
        labelProps={{
          "text-align": "center",
        }}
        error={!tweet}
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
      />

      <Dropzone
        my={20}
        loading={loading}
        w="100%"
        h={200}
        maxFiles={1}
        multiple={false}
        accept={IMAGE_MIME_TYPE}
        onDrop={selectFile}
        styles={{
          inner: {
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Text align="center">Drop an image here to post</Text>
      </Dropzone>

      <Button fullWidth onClick={upload}>
        Tweet this out!
      </Button>

      <SimpleGrid cols={1} mt="xl" h={200}>
        {imageUrl && (
          <Image
            alt="Upload"
            height={200}
            fit="contain"
            src={imageUrl}
            imageProps={{
              onLoad: () => URL.revokeObjectURL(imageUrl),
            }}
          />
        )}
      </SimpleGrid>
    </Box>
  );
}

export default Uploader;
