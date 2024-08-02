const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('janet')
		.setDescription('Janet introduces herself'),
	async execute(interaction) {
		await interaction.reply('Hi, I\'m Janet!');
	},
};