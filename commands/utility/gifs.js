const { SlashCommandBuilder } = require('discord.js');
//Documentation for google sheets reader
//https://robkendal.co.uk/blog/reading-google-sheets-data-using-javascript-with-google-sheets-reader/
const reader = require('g-sheets-api');




module.exports = {
	data: new SlashCommandBuilder()
		.setName('jgif')
		.setDescription('Post a gif from our curated collection.')
        .addStringOption(option =>
            option.setName("gif_name")
                .setDescription("Which gif do you want?")
                .setRequired(true)),
	async execute(interaction) {
        const gifName = interaction.options.getString("gif_name");

        const readerOptions = {
            apiKey: 'AIzaSyBnMTNGHcx6p40sUKO136-TlXmzWRPEbLg',
            sheetId: '1GAgl3VNQAMRlCY2skEWvf7v-cO26sJ52NnS79JQ91DA',
            returnAllResults: false,
            filter: {
                'Call': gifName,
                },
            };
        
        var gifObject;
        await reader(readerOptions, (results) => {
            gifObject = results[0];
            });

        try{
            await interaction.reply(gifName+"\n"+gifObject.URL);
        } catch (error){
            await interaction.reply({content: "Something went wrong. Most likely, you tried to call a gif that isn't in the list. " +
                                              "\n<https://docs.google.com/spreadsheets/d/1GAgl3VNQAMRlCY2skEWvf7v-cO26sJ52NnS79JQ91DA/edit#gid=0>"});
        }
	},
};