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

const commandAnswers: Record<string, string> = {
  config: '`/config` opens Ayra’s server configuration. Use it to manage the prefix, language, moderation role, log channel, autorole, and announcement settings. You need Manage Server, and Ayra needs permission to update the selected channels and roles.',
  profile: '`/profile [user]` shows a member’s public Ayra profile. If no user is provided, it shows your own profile. It is a community command, so it should not require moderation permissions.',
  iq: '`/iq [user]` runs the IQ fun command for you or the selected member. It is only entertainment and does not measure real intelligence. Try `/iq @username`.',
  help: '`/help` lists available commands, usually grouped by category. Use `/help <command>` when supported for focused usage details. Commands can be hidden or unavailable depending on the server configuration and your permissions.',
  ping: '`/ping` checks whether Ayra is online and reports its response latency. It does not test Discord voice or your internet connection.',
  prefix: '`/prefix` shows the server prefix or lets an authorized moderator change it. Newer Ayra commands use slash-command formatting, such as `/help` and `/config`.',
  support: '`/support` gives the Ayra support link or support-server information. Use it for bug reports, account issues, or questions that require the bot owner.',
  avatar: '`/avatar [user]` displays the selected member’s Discord avatar. Without a user, it displays your own avatar.',
  userinfo: '`/userinfo [user]` displays basic Discord information about a member, such as their ID, account dates, roles, and join details when available.',
}

function localAnswer(question: string) {
  const text = question.toLowerCase().replace(/\s+/g, ' ')
  const command = text.match(/\/(\w+)/)?.[1] ?? Object.keys(commandAnswers).find((name) => new RegExp(`\\b${name}\\b`).test(text))
  if (command && commandAnswers[command]) return commandAnswers[command]
  if (text.includes('moderation') || text.includes('ban') || text.includes('mute')) return 'Moderation commands include `/ban`, `/unban`, `/kick`, `/mute`, `/unmute`, `/warn`, `/warnings`, `/purge`, `/slowmode`, `/lock`, and `/unlock`. Most require the matching Discord permission, and Ayra’s role must be above the target member’s role.'
  if (text.includes('setup') || text.includes('start')) return 'Start with `/config`, then set the moderation role and log channel. Confirm Ayra has View Channel, Send Messages, Embed Links, Manage Messages, and the moderation permissions your server needs. Use `/help` to discover the rest.'
  return 'I can give specific Ayra command help. Ask something like “What does `/profile` do?”, “How do I use `/iq`?”, or “What permissions does `/ban` need?”'
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
