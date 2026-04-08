export async function readStream(
  stream: ReadableStream,
  onToken: (t: string) => void
) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    if (chunk) onToken(chunk);
  }
}
