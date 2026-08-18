export default function sleep(duration: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}