export function GET() {
  return new Response('dh=YOUR_COPIED_DISCORD_CODE', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
