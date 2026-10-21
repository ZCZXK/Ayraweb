export type CommandGroup = {
  title: string
  commands: string[]
}

// Kept aligned with the active slash-command registry in ZCZXK/ayrav4.
export const commandGroups: CommandGroup[] = [
  {
    title: 'Setup & help',
    commands: ['/help', '/support', '/prefix', '/setprefix', '/config'],
  },
  {
    title: 'Moderation',
    commands: [
      '/ban', '/kick', '/purge', '/mute', '/unmute', '/warn', '/warnings',
      '/clearwarnings', '/slowmode', '/lock', '/unlock', '/unban', '/nick',
      '/role', '/setautorole', '/setmodrole', '/tempban', '/softban', '/modlog',
      '/lockdown', '/note', '/massban', '/voicekick', '/hackban', '/nuke',
      '/dehoist', '/nsfw', '/snipe', '/tag',
    ],
  },
  {
    title: 'Protection',
    commands: [
      '/automod enable', '/automod disable', '/automod status', '/automod logs',
      '/automod reset', '/automod configure', '/antinuke enable',
      '/antinuke disable', '/antinuke status', '/antinuke setup',
      '/antinuke whitelist', '/antinuke module', '/reactionrole',
    ],
  },
  {
    title: 'Tickets & support',
    commands: [
      '/ticket setup', '/ticket status', '/report', '/dm',
    ],
  },
  {
    title: 'Invites',
    commands: [
      '/invite', '/invites', '/inviteleaderboard', '/invitereset',
      '/invitetracker', '/inviteset',
    ],
  },
  {
    title: 'Server tools',
    commands: [
      '/serverinfo', '/membercount', '/roles', '/roleinfo', '/channelinfo',
      '/channels', '/bots', '/newmembers', '/boosters',
      '/firstmessage', '/oldest', '/topic', '/created', '/rolecount',
      '/serverbanner', '/servericon', '/emoji', '/emojis', '/steal', '/mediaonly',
    ],
  },
  {
    title: 'Member profiles',
    commands: [
      '/avatar', '/profile', '/userinfo', '/whois', '/banner', '/id',
      '/joinpos', '/permissions', '/vip',
    ],
  },
  {
    title: 'Giveaways & community',
    commands: [
      '/giveaway start', '/giveaway end', '/giveaway reroll', '/poll', '/afk',
      '/announce',
    ],
  },
  {
    title: 'Fun & utilities',
    commands: [
      '/say', '/8ball', '/choose', '/math', '/color', '/remind', '/timestamp',
      '/rate', '/iq', '/pp', '/roast', '/luck', '/language',
    ],
  },
  {
    title: 'Ayra status',
    commands: ['/botinfo', '/uptime', '/ping', '/botinvite'],
  },
]

export const allCommands = commandGroups.flatMap(({ title, commands }) =>
  commands.map((name) => ({ name, category: title })),
)
