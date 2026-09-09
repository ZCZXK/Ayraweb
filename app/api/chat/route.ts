import { gateway } from '@ai-sdk/gateway'
import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const commandContext = `Ayra is a Discord community assistant created by cf7yce. Its command catalog includes:
Essentials: help, support, prefix, config, ping, stats, botinfo, uptime, invite.
Moderation: ban, unban, kick, mute, unmute, warn, warnings, clearwarnings, purge, slowmode, lock, unlock, lockdown, tempban, softban, massban, hackban, voicekick, nuke, modlog.
Server setup: setprefix, setautorole, setmodrole, language, announce, reportset, setchannel, mediaonly, reactionrole, nsfw, tag.
Community: giveaway, ticket, afk, profile, userinfo, avatar, banner, nick, role, roleinfo, permissions, report, note, remind.
Server tools: serverinfo, servericon, serverbanner, membercount, members, newmembers, roles, rolecount, channels, channelinfo, emojis, emoji, boosters, topic, created, joinpos, firstmessage, oldest.
Fun & utility: choose, math, calc, 8ball, rate, iq, pp, roast, luck, color, timestamp, id, whois, snipe, poll, say.
Advanced: invites, inviteleaderboard, invitelb, invitereset, invitetracker, inviteset, automod, antinuke, dm, dmbulk, steal, botstatus, botavatar, botbanner, setbio.
Use slash-command formatting in replies. Explain that exact permissions and availability can vary by server configuration. Never invent live member or server counts; the website does not have a bot telemetry endpoint.`

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  const body = (await request.json()) as { messages?: UIMessage[] }
  if (!Array.isArray(body.messages)) return new Response('Invalid messages', { status: 400 })

  const result = streamText({
    model: gateway('google/gemini-2.5-flash'),
    system: `You are Ayra, a concise and friendly Discord bot guide. Answer questions about Ayra commands using the catalog below. Help users choose commands, explain setup, and be clear about permissions. Do not claim to execute commands or access a Discord server from this chat. ${commandContext}`,
    messages: await convertToModelMessages(body.messages),
    maxOutputTokens: 500,
  })

  return result.toUIMessageStreamResponse()
}
