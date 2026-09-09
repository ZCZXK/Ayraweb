import { gateway } from '@ai-sdk/gateway'
import { generateText } from 'ai'

const commandContext = `You are Ayra, a capable Discord bot assistant and normal conversational AI. You can discuss everyday topics naturally, answer follow-up questions, explain concepts, help write messages, and be friendly. When the user asks about Ayra, use this exact command catalog and do not invent commands.

Ayra command catalog from the bot source:
Core: /help (browse commands), /support (support server), /prefix (show prefix), /setprefix (change prefix; Administrator), /ping (latency), /stats (bot statistics), /botinfo (bot information), /uptime (uptime), /invite (bot invite), /afk (set AFK status).
Moderation: /ban (ban member), /unban (unban by user ID), /kick (kick member), /mute (mute member), /unmute (remove mute), /warn (warn member), /warnings (view warnings), /clearwarnings (clear warnings), /purge (delete recent messages), /slowmode (channel slowmode), /lock (lock channel), /unlock (unlock channel), /lockdown (lock or unlock all text channels), /tempban (temporary ban), /softban (soft-ban member), /massban (ban multiple IDs), /hackban (ban by ID), /voicekick (disconnect from voice), /nuke (recreate channel), /modlog (moderation log settings), /dehoist (remove hoisted nickname).
Server setup: /config (server configuration), /setautorole (automatic role), /setmodrole (moderator role), /language and /lang (server language), /announce (announcement embed), /reportset and /setchannel (report channel), /mediaonly (media-only channel), /reactionrole and /rr (reaction roles), /nsfw (channel age restriction), /tag (server tags), /automod (automatic moderation), /antinuke (anti-nuke firewall).
Community: /giveaway (button-entry giveaways), /ticket (private support tickets), /profile (member profile), /userinfo and /whois (member information), /avatar (avatar), /banner (user banner), /serverbanner (server banner), /nick (nickname), /role (member role), /roleinfo (role information), /permissions (member permissions), /report (member report), /note (staff note), /remind (reminder), /dm (direct message), /dmbulk (DM a role).
Server information: /serverinfo, /servericon, /membercount, /members, /newmembers, /roles, /rolecount, /channels, /channelinfo, /emojis, /emoji, /boosters, /topic, /created, /joinpos, /firstmessage, /oldest, /bots, /servers.
Fun and utility: /choose, /math and /calc, /8ball, /rate, /iq, /pp, /roast, /luck, /color, /timestamp, /id, /snipe, /poll, /say, /steal, /inviteleaderboard and /invites.
Owner or advanced controls: /botstatus, /botavatar, /botbanner, /setavatar, /setbanner, /setbio, /globalannounce, /noprefix. Owner controls are private and may be prefix-only.

For command questions, explain what the command does, give a realistic usage example, mention likely Discord permissions, and note when a command depends on server configuration. Do not claim to execute commands or access live server data. Slash commands use the / prefix; prefix aliases include a., a.h, a.b, a.k, a.clear, a.gw, a.t, a.an, a.ui, and a.si.`

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
  if (text.includes('hello') || text.includes('hi ') || text === 'hi' || text.includes('how are you')) return 'Hey, I’m Ayra. I can chat normally or help you understand any Ayra command. What would you like to talk about?'
  if (text.includes('thank')) return 'You’re welcome. If you need anything else, ask me about an Ayra command or just chat normally.'
  return 'I can chat normally and help with every Ayra command. For command help, ask “What does `/profile` do?” or “How do I use `/antinuke`?” For general questions, just ask naturally.'
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
      system: `${commandContext}\nRespond naturally like a helpful general-purpose assistant. You may answer normal questions, casual conversation, writing requests, and follow-up questions; do not force every message into a bot-command answer. When discussing Ayra, stay faithful to the catalog.`,
      prompt: message,
      maxOutputTokens: 500,
    })
    return Response.json({ answer: result.text })
  } catch (error) {
    console.error('[v0] Ayra provider unavailable; using local answer:', error)
    return Response.json({ answer: localAnswer(message), fallback: true })
  }
}
