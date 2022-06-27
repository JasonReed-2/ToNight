import 'reflect-metadata'
import {Client, Intents, Collection} from 'discord.js'
import { token } from './config.json'
import fs from 'fs'
import path from 'path'

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.set(command.data.name, command)
}

client.once('ready', async () => {
	console.log('Ready!');
	const commands = await client.application?.commands.fetch()
	commands?.each((val) => {
		console.log(val)
	})
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return
	
	const command: any = commands.get(interaction.commandName)
	await command.execute(interaction)
})

client.login(token);