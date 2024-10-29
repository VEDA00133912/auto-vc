const { Events, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const guild = newState.guild;

        if (newState.channel && newState.channel.name === '➕️Create') {
            const userId = newState.id; 

            const newChannel = await guild.channels.create(`vc-${userId}`, {
                type: ChannelType.GuildVoice, 
                parent: newState.channel.parentId, 
                permissionOverwrites: [
                    {
                        id: guild.id, 
                        allow: [PermissionFlagsBits.ViewChannel,PermissionFlagsBits.Connect, PermissionFlagsBits.Speak], 
                    },
                    {
                        id: userId, 
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
                    },
                ],
            });

            const parentChannel = newState.channel.parent;
            if (parentChannel) {
                await newChannel.setParent(parentChannel.id, { lockPermissions: false }); 
            }

            await newState.member.voice.setChannel(newChannel);
        }

        if (oldState.channel && oldState.channel.members.size === 0) {
            if (oldState.channel.name.startsWith('vc-')) {
                await oldState.channel.delete('チャンネルが空になったため削除されました。'); // チャンネルを削除
            }
        }
    },
};
