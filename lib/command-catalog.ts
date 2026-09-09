export const commandGroups = [
  { name: 'Essentials', description: 'Core commands for everyday server management.', commands: ['help', 'support', 'prefix', 'config', 'ping', 'stats', 'botinfo', 'uptime', 'invite'] },
  { name: 'Moderation', description: 'Keep conversations safe, clear, and organized.', commands: ['ban', 'unban', 'kick', 'mute', 'unmute', 'warn', 'warnings', 'clearwarnings', 'purge', 'slowmode', 'lock', 'unlock', 'lockdown', 'tempban', 'softban', 'massban', 'hackban', 'voicekick', 'nuke', 'modlog'] },
  { name: 'Server setup', description: 'Configure Ayra around the way your server works.', commands: ['setprefix', 'setautorole', 'setmodrole', 'language', 'announce', 'reportset', 'setchannel', 'mediaonly', 'reactionrole', 'nsfw', 'tag'] },
  { name: 'Community', description: 'Give members useful ways to participate.', commands: ['giveaway', 'ticket', 'afk', 'profile', 'userinfo', 'avatar', 'banner', 'nick', 'role', 'roleinfo', 'permissions', 'report', 'note', 'remind'] },
  { name: 'Server tools', description: 'Inspect the structure and activity of your server.', commands: ['serverinfo', 'servericon', 'serverbanner', 'membercount', 'members', 'newmembers', 'roles', 'rolecount', 'channels', 'channelinfo', 'emojis', 'emoji', 'boosters', 'topic', 'created', 'joinpos', 'firstmessage', 'oldest'] },
  { name: 'Fun & utility', description: 'Lightweight tools and social commands.', commands: ['choose', 'math', 'calc', '8ball', 'rate', 'iq', 'pp', 'roast', 'luck', 'color', 'timestamp', 'id', 'whois', 'snipe', 'poll', 'say'] },
  { name: 'Advanced', description: 'Power tools for owners and experienced moderators.', commands: ['invites', 'inviteleaderboard', 'invitelb', 'invitereset', 'invitetracker', 'inviteset', 'automod', 'antinuke', 'dm', 'dmbulk', 'steal', 'botstatus', 'botavatar', 'botbanner', 'setbio'] },
]

export const totalCommands = commandGroups.reduce((total, group) => total + group.commands.length, 0)

