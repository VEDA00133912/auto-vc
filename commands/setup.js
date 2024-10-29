const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('参加することで個別チャンネルを作成できるようにします')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels), 
    async execute(interaction) {
        const guild = interaction.guild;

        const botMember = guild.members.me;
        if (!botMember.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: 'チャンネルを管理する権限が有りません', ephemeral: true });
        }

        const existingChannel = guild.channels.cache.find(channel => channel.name === '➕️Create' && channel.type === ChannelType.GuildVoice);
        
        if (existingChannel) {
            return interaction.reply({ content: 'すでに存在します', ephemeral: true });
        }
     
        interaction.deferReply({ ephemeral: true });
      
        const channel = await guild.channels.create('➕️Create', {
            type: ChannelType.GuildVoice,
            permissionOverwrites: [
                {
                    id: guild.id, 
                    allow: [PermissonsFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak], 
                },
            ],
        });

        return interaction.editeply({ content: `チャンネルを作成しました\nここに参加することで個別チャンネルが作成されます` });
    },
};
