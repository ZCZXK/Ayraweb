import { gateway } from '@ai-sdk/gateway'
import { generateText } from 'ai'

const commandContext = `Ayra is a Discord community assistant created by cf7yce. Its command catalog includes:
Essentials: help, support, prefix, config, ping, stats, botinfo, uptime, invite.
Moderation: ban, unban, kick, mute, unmute, warn, warnings, clearwarnings, purge, slowmode, lock, unlock, lockdown, tempban, softban, massban, hackban, voicekick, nuke, modlog.
Server setup: setprefix, setautorole, setmodrole, language, announce, reportset, setchannel, mediaonly, reactionrole, nsfw, tag.
Community: giveaway, ticket, afk, profile, userinfo, avatar, banner, nick, role, roleinfo, permissions, report, note, remind.
Server tools: serverinfo, servericon, serverbanner, membercount, members, newmembers, roles, rolecount, channels, channelinfo, emojis, emoji, boosters, topic, created, joinpos, firstmessage, oldest.
Fun & utility: choose, math, calc, 8ball, rate, iq, pp, roast, luck, color, timestamp, id, whois, snipe, poll, say.
Advanced: invites, inviteleaderboard, invitelb, invitereset, invitetracker, inviteset, automod, antinuke, dm, dmbulk, steal, botstatus, botavatar, botbanner, setbio.
Use slash-command formatting. Explain that permissions and availability vary by server configuration. Never invent live server data.`

function localAnswer(question: string) {
  const text = question.toLowerCase()
  if (text.includes('config') || text.includes('setup')) return 'Use `/config` to view or update Ayra server settings. Start with the prefix, moderation role, log channel, and language. Ayra also needs the permissions required by the commands you enable.'
  if (text.includes('moderation') || text.includes('ban') || text.includes('mute')) return 'Moderation commands include `/ban`, `/unban`, `/kick`, `/mute`, `/unmute`, `/warn`, `/purge`, `/slowmode`, `/lock`, and `/unlock`. Availability depends on your permissions and server configuration.'
  if (text.includes('help') || text.includes('command')) return 'Use `/help` to browse commands. Essentials include `/config`, `/support`, `/prefix`, `/ping`, `/stats`, `/botinfo`, `/uptime`, and `/invite`. Ask me about any command for more details.'
  return 'I can explain Ayra commands, server setup, moderation, tickets, giveaways, and utility tools. Try asking about `/config`, `/help`, or moderation commands.'
}

export async function POST(request: Request) {
  let body: { message?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const message = typeof body.message === 'string' ? body.message.trim() : ''
  if (!message || message.length > 2000) return Response.json({ error: 'Please enter a question under 2,000 characters.' }, { status: 400 })

  try {
    const result = await generateText({
      model: gateway('google/gemini-2.5-flash'),
      system: `You are Ayra, a concise and friendly Discord bot guide. Answer only from this catalog and never claim to execute commands. ${commandContext}`,
      prompt: message,
      maxOutputTokens: 500,
    })
    return Response.json({ answer: result.text })
  } catch (error) {
    console.error('[v0] Ayra provider unavailable; using local answer:', error)
    return Response.json({ answer: localAnswer(message), fallback: true })
  }
}
