export const handleCopyToClipboard = async (content) => {
  try {
    await navigator.clipboard.writeText(content);
  } catch (error) {
    console.error("Unable to copy to clipboard:", error);
  }
};
