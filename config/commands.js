/**
 * Commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are commands. For instance, you can define the command 'whois'
 * here, then use it by typing /whois into Pokemon Showdown.
 *
 * A command can be in the form:
 *   ip: 'whois',
 * This is called an alias: it makes it so /ip does the same thing as
 * /whois.
 *
 * But to actually define a command, it's a function:
 *   birkal: function (target, room, user) {
 *     this.sendReply("It's not funny anymore.");
 *   },
 *
 * Commands are actually passed five parameters:
 *   function (target, room, user, connection, cmd, message)
 * Most of the time, you only need the first three, though.
 *
 * target = the part of the message after the command
 * room = the room object the message was sent to
 *   The room name is room.id
 * user = the user object that sent the message
 *   The user's name is user.name
 * connection = the connection that the message was sent from
 * cmd = the name of the command
 * message = the entire message sent by the user
 *
 * If a user types in "/msg zarel, hello"
 *   target = "zarel, hello"
 *   cmd = "msg"
 *   message = "/msg zarel, hello"
 *
 * Commands return the message the user should say. If they don't
 * return anything or return something falsy, the user won't say
 * anything.
 *
 * Commands have access to the following functions:
 *
 * this.sendReply(message)
 *   Sends a message back to the room the user typed the command into.
 *
 * this.sendReplyBox(html)
 *   Same as sendReply, but shows it in a box, and you can put HTML in
 *   it.
 *
 * this.popupReply(message)
 *   Shows a popup in the window the user typed the command into.
 *
 * this.add(message)
 *   Adds a message to the room so that everyone can see it.
 *   This is like this.sendReply, except everyone in the room gets it,
 *   instead of just the user that typed the command.
 *
 * this.send(message)
 *   Sends a message to the room so that everyone can see it.
 *   This is like this.add, except it's not logged, and users who join
 *   the room later won't see it in the log, and if it's a battle, it
 *   won't show up in saved replays.
 *   You USUALLY want to use this.add instead.
 *
 * this.logEntry(message)
 *   Log a message to the room's log without sending it to anyone. This
 *   is like this.add, except no one will see it.
 *
 * this.addModCommand(message)
 *   Like this.add, but also logs the message to the moderator log
 *   which can be seen with /modlog.
 *
 * this.logModCommand(message)
 *   Like this.addModCommand, except users in the room won't see it.
 *
 * this.can(permission)
 * this.can(permission, targetUser)
 *   Checks if the user has the permission to do something, or if a
 *   targetUser is passed, check if the user has permission to do
 *   it to that user. Will automatically give the user an "Access
 *   denied" message if the user doesn't have permission: use
 *   user.can() if you don't want that message.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.can('potd')) return false;
 *
 * this.canBroadcast()
 *   Signifies that a message can be broadcast, as long as the user
 *   has permission to. This will check to see if the user used
 *   "!command" instead of "/command". If so, it will check to see
 *   if the user has permission to broadcast (by default, voice+ can),
 *   and return false if not. Otherwise, it will set it up so that
 *   this.sendReply and this.sendReplyBox will broadcast to the room
 *   instead of just the user that used the command.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canBroadcast()) return false;
 *
 * this.canTalk()
 *   Checks to see if the user can speak in the room. Returns false
 *   if the user can't speak (is muted, the room has modchat on, etc),
 *   or true otherwise.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canTalk()) return false;
 *
 * this.canTalk(message)
 *   Checks to see if the user can say the message. In addition to
 *   running the checks from this.canTalk(), it also checks to see if
 *   the message has any banned words or is too long. Returns the
 *   filtered message, or a falsy value if the user can't speak.
 *
 *   Should usually be near the top of the command, like:
 *     target = this.canTalk(target);
 *     if (!target) return false;
 *
 * this.parse(message)
 *   Runs the message as if the user had typed it in.
 *
 *   Mostly useful for giving help messages, like for commands that
 *   require a target:
 *     if (!target) return this.parse('/help msg');
 *
 *   After 10 levels of recursion (calling this.parse from a command
 *   called by this.parse from a command called by this.parse etc)
 *   we will assume it's a bug in your command and error out.
 *
 * this.targetUserOrSelf(target)
 *   If target is blank, returns the user that sent the message.
 *   Otherwise, returns the user with the username in target, or
 *   a falsy value if no user with that username exists.
 *
 * this.splitTarget(target)
 *   Splits a target in the form "user, message" into its
 *   constituent parts. Returns message, and sets this.targetUser to
 *   the user, and this.targetUsername to the username.
 *
 *   Remember to check if this.targetUser exists before going further.
 *
 * Unless otherwise specified, these functions will return undefined,
 * so you can return this.sendReply or something to send a reply and
 * stop the command there.
 *
 * @license MIT license
 */

var commands = exports.commands = {

	ip: 'whois',
	rooms: 'whois',
	alt: 'whois',
	alts: 'whois',
	whois: function (target, room, user) {
		var targetUser = this.targetUserOrSelf(target, user.group === ' ');
		if (!targetUser) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}

		this.sendReply("User: " + targetUser.name);
		if (user.can('alts', targetUser)) {
			var alts = targetUser.getAlts();
			var output = Object.keys(targetUser.prevNames).join(", ");
			if (output) this.sendReply("Previous names: " + output);

			for (var j = 0; j < alts.length; ++j) {
				var targetAlt = Users.get(alts[j]);
				if (!targetAlt.named && !targetAlt.connected) continue;
				if (targetAlt.group === '~' && user.group !== '~') continue;

				this.sendReply("Alt: " + targetAlt.name);
				output = Object.keys(targetAlt.prevNames).join(", ");
				if (output) this.sendReply("Previous names: " + output);
			}
		}
		if (Config.groups[targetUser.group] && Config.groups[targetUser.group].name) {
			this.sendReply("Group: " + Config.groups[targetUser.group].name + " (" + targetUser.group + ")");
		}
		if (targetUser.isSysop) {
			this.sendReply("(Pok\xE9mon Showdown System Operator)");
		}
		if (!targetUser.authenticated) {
			this.sendReply("(Unregistered)");
		}
		if (!this.broadcasting && (user.can('ip', targetUser) || user === targetUser)) {
			var ips = Object.keys(targetUser.ips);
			this.sendReply("IP" + ((ips.length > 1) ? "s" : "") + ": " + ips.join(", "));
		}
		var output = "In rooms: ";
		var first = true;
		for (var i in targetUser.roomCount) {
			if (i === 'global' || Rooms.get(i).isPrivate) continue;
			if (!first) output += " | ";
			first = false;

			output += '<a href="/' + i + '" room="' + i + '">' + i + '</a>';
		}
		this.sendReply('|raw|' + output);
	},

	ipsearch: function (target, room, user) {
		if (!this.can('rangeban')) return;
		var atLeastOne = false;
		this.sendReply("Users with IP " + target + ":");
		for (var userid in Users.users) {
			var user = Users.users[userid];
			if (user.latestIp === target) {
				this.sendReply((user.connected ? " + " : "-") + " " + user.name);
				atLeastOne = true;
			}
		}
		if (!atLeastOne) this.sendReply("No results found.");
	},

	/*********************************************************
	 * Shortcuts
	 *********************************************************/

	invite: function (target, room, user) {
		target = this.splitTarget(target);
		if (!this.targetUser) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		var roomid = (target || room.id);
		if (!Rooms.get(roomid)) {
			return this.sendReply("Room " + roomid + " not found.");
		}
		return this.parse('/msg ' + this.targetUsername + ', /invite ' + roomid);
	},

	/*********************************************************
	 * Informational commands
	 *********************************************************/

	stats: 'data',
	dex: 'data',
	pokedex: 'data',
	data: function (target, room, user) {
		if (!this.canBroadcast()) return;

		var data = '';
		var targetId = toId(target);
		var newTargets = Tools.dataSearch(target);
		if (newTargets && newTargets.length) {
			for (var i = 0; i < newTargets.length; ++i) {
				if (newTargets[i].id !== targetId && !Tools.data.Aliases[targetId] && !i) {
					data = "No Pokemon, item, move or ability named '" + target + "' was found. Showing the data of '" + newTargets[0].name + "' instead.\n";
				}
				data += '|c|~|/data-' + newTargets[i].searchType + ' ' + newTargets[i].name + '\n';
				if (newTargets[i].searchType === 'pokemon') {
					var template = Tools.getTemplate(newTargets[i].species);
					data += '|html|<center><b>Tier: ' + template.tier + '</b></center>';
				}
			}
		} else {
			data = "No Pokemon, item, move or ability named '" + target + "' was found. (Check your spelling?)";
		}

		this.sendReply(data);
	},

	ds: 'dexsearch',
	dsearch: 'dexsearch',
	dexsearch: function (target, room, user) {
		if (!this.canBroadcast()) return;

		if (!target) return this.parse('/help dexsearch');
		var targets = target.split(',');
		var searches = {};
		var allTiers = {'uber':1, 'ou':1, 'uu':1, 'lc':1, 'cap':1, 'bl':1, 'bl2':1};
		var allColours = {'green':1, 'red':1, 'blue':1, 'white':1, 'brown':1, 'yellow':1, 'purple':1, 'pink':1, 'gray':1, 'black':1};
		var showAll = false;
		var megaSearch = null;
		var output = 10;

		for (var i in targets) {
			var isNotSearch = false;
			target = targets[i].trim().toLowerCase();
			if (target.slice(0, 1) === '!') {
				isNotSearch = true;
				target = target.slice(1);
			}

			var targetAbility = Tools.getAbility(targets[i]);
			if (targetAbility.exists) {
				if (!searches['ability']) searches['ability'] = {};
				if (Object.count(searches['ability'], true) === 1 && !isNotSearch) return this.sendReplyBox("Specify only one ability.");
				if ((searches['ability'][targetAbility.name] && isNotSearch) || (searches['ability'][targetAbility.name] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include an ability.");
				searches['ability'][targetAbility.name] = !isNotSearch;
				continue;
			}

			if (target in allTiers) {
				if (!searches['tier']) searches['tier'] = {};
				if ((searches['tier'][target] && isNotSearch) || (searches['tier'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a tier.');
				searches['tier'][target] = !isNotSearch;
				continue;
			}

			if (target in allColours) {
				if (!searches['color']) searches['color'] = {};
				if ((searches['color'][target] && isNotSearch) || (searches['color'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a color.');
				searches['color'][target] = !isNotSearch;
				continue;
			}

			var targetInt = parseInt(target);
			if (0 < targetInt && targetInt < 7) {
				if (!searches['gen']) searches['gen'] = {};
				if ((searches['gen'][target] && isNotSearch) || (searches['gen'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a generation.');
				searches['gen'][target] = !isNotSearch;
				continue;
			}

			if (target === 'all') {
				if (this.broadcasting) {
					return this.sendReplyBox("A search with the parameter 'all' cannot be broadcast.");
				}
				showAll = true;
				continue;
			}

			if (target === 'megas' || target === 'mega') {
				if ((megaSearch && isNotSearch) || (megaSearch === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include Mega Evolutions.');
				megaSearch = !isNotSearch;
				continue;
			}

			if (target.indexOf(' type') > -1) {
				target = target.charAt(0).toUpperCase() + target.slice(1, target.indexOf(' type'));
				if (target in Tools.data.TypeChart) {
					if (!searches['types']) searches['types'] = {};
					if (Object.count(searches['types'], true) === 2 && !isNotSearch) return this.sendReplyBox("Specify a maximum of two types.");
					if ((searches['types'][target] && isNotSearch) || (searches['types'][target] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include a type.");
					searches['types'][target] = !isNotSearch;
					continue;
				}
			}

			var targetMove = Tools.getMove(target);
			if (targetMove.exists) {
				if (!searches['moves']) searches['moves'] = {};
				if (Object.count(searches['moves'], true) === 4 && !isNotSearch) return this.sendReplyBox("Specify a maximum of 4 moves.");
				if ((searches['moves'][targetMove.name] && isNotSearch) || (searches['moves'][targetMove.name] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include a move.");
				searches['moves'][targetMove.name] = !isNotSearch;
				continue;
			} else {
				return this.sendReplyBox("'" + sanitize(target, true) + "' could not be found in any of the search categories.");
			}
		}

		if (showAll && Object.size(searches) === 0 && megaSearch === null) return this.sendReplyBox("No search parameters other than 'all' were found.\nTry '/help dexsearch' for more information on this command.");

		var dex = {};
		for (var pokemon in Tools.data.Pokedex) {
			var template = Tools.getTemplate(pokemon);
			if (template.tier !== 'Unreleased' && template.tier !== 'Illegal' && (template.tier !== 'CAP' || (searches['tier'] && searches['tier']['cap'])) &&
				(megaSearch === null || (megaSearch === true && template.isMega) || (megaSearch === false && !template.isMega))) {
				dex[pokemon] = template;
			}
		}

		for (var search in {'moves':1, 'types':1, 'ability':1, 'tier':1, 'gen':1, 'color':1}) {
			if (!searches[search]) continue;
			switch (search) {
				case 'types':
					for (var mon in dex) {
						if (Object.count(searches[search], true) === 2) {
							if (!(searches[search][dex[mon].types[0]]) || !(searches[search][dex[mon].types[1]])) delete dex[mon];
						} else {
							if (searches[search][dex[mon].types[0]] === false || searches[search][dex[mon].types[1]] === false || (Object.count(searches[search], true) > 0 &&
								(!(searches[search][dex[mon].types[0]]) && !(searches[search][dex[mon].types[1]])))) delete dex[mon];
						}
					}
					break;

				case 'tier':
					for (var mon in dex) {
						if ('lc' in searches[search]) {
							// some LC legal Pokemon are stored in other tiers (Ferroseed/Murkrow etc)
							// this checks for LC legality using the going criteria, instead of dex[mon].tier
							var isLC = (dex[mon].evos && dex[mon].evos.length > 0) && !dex[mon].prevo && Tools.data.Formats['lc'].banlist.indexOf(dex[mon].species) === -1;
							if ((searches[search]['lc'] && !isLC) || (!searches[search]['lc'] && isLC)) {
								delete dex[mon];
								continue;
							}
						}
						if (searches[search][String(dex[mon][search]).toLowerCase()] === false) {
							delete dex[mon];
						} else if (Object.count(searches[search], true) > 0 && !searches[search][String(dex[mon][search]).toLowerCase()]) delete dex[mon];
					}
					break;

				case 'gen':
				case 'color':
					for (var mon in dex) {
						if (searches[search][String(dex[mon][search]).toLowerCase()] === false) {
							delete dex[mon];
						} else if (Object.count(searches[search], true) > 0 && !searches[search][String(dex[mon][search]).toLowerCase()]) delete dex[mon];					}
					break;

				case 'ability':
					for (var mon in dex) {
						for (var ability in searches[search]) {
							var needsAbility = searches[search][ability];
							var hasAbility = Object.count(dex[mon].abilities, ability) > 0;
							if (hasAbility !== needsAbility) {
								delete dex[mon];
								break;
							}
						}
					}
					break;

				case 'moves':
					for (var mon in dex) {
						var template = Tools.getTemplate(dex[mon].id);
						if (!template.learnset) template = Tools.getTemplate(template.baseSpecies);
						if (!template.learnset) continue;
						for (var i in searches[search]) {
							var move = Tools.getMove(i);
							if (!move.exists) return this.sendReplyBox("'" + move + "' is not a known move.");
							var prevoTemp = Tools.getTemplate(template.id);
							while (prevoTemp.prevo && prevoTemp.learnset && !(prevoTemp.learnset[move.id])) {
								prevoTemp = Tools.getTemplate(prevoTemp.prevo);
							}
							var canLearn = (prevoTemp.learnset.sketch && !(move.id in {'chatter':1, 'struggle':1, 'magikarpsrevenge':1})) || prevoTemp.learnset[move.id];
							if ((!canLearn && searches[search][i]) || (searches[search][i] === false && canLearn)) delete dex[mon];
						}
					}
					break;

				default:
					return this.sendReplyBox("Something broke! PM TalkTakesTime here or on the Smogon forums with the command you tried.");
			}
		}

		var results = Object.keys(dex).map(function (speciesid) {return dex[speciesid].species;});
		var resultsStr = "";
		if (results.length > 0) {
			if (showAll || results.length <= output) {
				results.sort();
				resultsStr = results.join(", ");
			} else {
				results.randomize()
				resultsStr = results.slice(0, 10).join(", ") + ", and " + string(results.length - output) + " more. Redo the search with 'all' as a search parameter to show all results.";
			}
		} else {
			resultsStr = "No PokÃ©mon found.";
		}
		return this.sendReplyBox(resultsStr);
	},

	learnset: 'learn',
	learnall: 'learn',
	learn5: 'learn',
	g6learn: 'learn',
	learn: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help learn');

		if (!this.canBroadcast()) return;

		var lsetData = {set:{}};
		var targets = target.split(',');
		var template = Tools.getTemplate(targets[0]);
		var move = {};
		var problem;
		var all = (cmd === 'learnall');
		if (cmd === 'learn5') lsetData.set.level = 5;
		if (cmd === 'g6learn') lsetData.format = {noPokebank: true};

		if (!template.exists) {
			return this.sendReply("Pokemon '" + template.id + "' not found.");
		}

		if (targets.length < 2) {
			return this.sendReply("You must specify at least one move.");
		}

		for (var i = 1, len = targets.length; i < len; ++i) {
			move = Tools.getMove(targets[i]);
			if (!move.exists) {
				return this.sendReply("Move '" + move.id + "' not found.");
			}
			problem = TeamValidator.checkLearnsetSync(null, move, template, lsetData);
			if (problem) break;
		}
		var buffer = template.name + (problem ? " <span class=\"message-learn-cannotlearn\">can't</span> learn " : " <span class=\"message-learn-canlearn\">can</span> learn ") + (targets.length > 2 ? "these moves" : move.name);
		if (!problem) {
			var sourceNames = {E:"egg", S:"event", D:"dream world"};
			if (lsetData.sources || lsetData.sourcesBefore) buffer += " only when obtained from:<ul class=\"message-learn-list\">";
			if (lsetData.sources) {
				var sources = lsetData.sources.sort();
				var prevSource;
				var prevSourceType;
				for (var i = 0, len = sources.length; i < len; ++i) {
					var source = sources[i];
					if (source.substr(0, 2) === prevSourceType) {
						if (prevSourceCount < 0) buffer += ": " + source.substr(2);
						else if (all || prevSourceCount < 3) buffer += ", " + source.substr(2);
						else if (prevSourceCount === 3) buffer += ", ...";
						++prevSourceCount;
						continue;
					}
					prevSourceType = source.substr(0, 2);
					prevSourceCount = source.substr(2) ? 0 : -1;
					buffer += "<li>gen " + source.substr(0, 1) + " " + sourceNames[source.substr(1, 1)];
					if (prevSourceType === '5E' && template.maleOnlyHidden) buffer += " (cannot have hidden ability)";
					if (source.substr(2)) buffer += ": " + source.substr(2);
				}
			}
			if (lsetData.sourcesBefore) buffer += "<li>any generation before " + (lsetData.sourcesBefore + 1);
			buffer += "</ul>";
		}
		this.sendReplyBox(buffer);
	},

	weak: 'weakness',
	weakness: function (target, room, user){
		if (!this.canBroadcast()) return;
		var targets = target.split(/[ ,\/]/);

		var pokemon = Tools.getTemplate(target);
		var type1 = Tools.getType(targets[0]);
		var type2 = Tools.getType(targets[1]);

		if (pokemon.exists) {
			target = pokemon.species;
		} else if (type1.exists && type2.exists) {
			pokemon = {types: [type1.id, type2.id]};
			target = type1.id + "/" + type2.id;
		} else if (type1.exists) {
			pokemon = {types: [type1.id]};
			target = type1.id;
		} else {
			return this.sendReplyBox("" + sanitize(target) + " isn't a recognized type or pokemon.");
		}

		var weaknesses = [];
		Object.keys(Tools.data.TypeChart).forEach(function (type) {
			var notImmune = Tools.getImmunity(type, pokemon);
			if (notImmune) {
				var typeMod = Tools.getEffectiveness(type, pokemon);
				if (typeMod === 1) weaknesses.push(type);
				if (typeMod === 2) weaknesses.push("<b>" + type + "</b>");
			}
		});

		if (!weaknesses.length) {
			this.sendReplyBox("" + target + " has no weaknesses.");
		} else {
			this.sendReplyBox("" + target + " is weak to: " + weaknesses.join(", ") + " (not counting abilities).");
		}
	},

	eff: 'effectiveness',
	type: 'effectiveness',
	matchup: 'effectiveness',
	effectiveness: function (target, room, user) {
		var targets = target.split(/[,/]/).slice(0, 2);
		if (targets.length !== 2) return this.sendReply("Attacker and defender must be separated with a comma.");

		var searchMethods = {'getType':1, 'getMove':1, 'getTemplate':1};
		var sourceMethods = {'getType':1, 'getMove':1};
		var targetMethods = {'getType':1, 'getTemplate':1};
		var source;
		var defender;
		var foundData;
		var atkName;
		var defName;
		for (var i = 0; i < 2; ++i) {
			for (var method in searchMethods) {
				foundData = Tools[method](targets[i]);
				if (foundData.exists) break;
			}
			if (!foundData.exists) return this.parse('/help effectiveness');
			if (!source && method in sourceMethods) {
				if (foundData.type) {
					source = foundData;
					atkName = foundData.name;
				} else {
					source = foundData.id;
					atkName = foundData.id;
				}
				searchMethods = targetMethods;
			} else if (!defender && method in targetMethods) {
				if (foundData.types) {
					defender = foundData;
					defName = foundData.species + " (not counting abilities)";
				} else {
					defender = {types: [foundData.id]};
					defName = foundData.id;
				}
				searchMethods = sourceMethods;
			}
		}

		if (!this.canBroadcast()) return;

		var factor = 0;
		if (Tools.getImmunity(source.type || source, defender)) {
			if (source.effectType !== 'Move' || source.basePower || source.basePowerCallback) {
				factor = Math.pow(2, Tools.getEffectiveness(source, defender));
			} else {
				factor = 1;
			}
		}

		this.sendReplyBox("" + atkName + " is " + factor + "x effective against " + defName + ".");
	},

	uptime: function (target, room, user) {
		if (!this.canBroadcast()) return;
		var uptime = process.uptime();
		var uptimeText;
		if (uptime > 24 * 60 * 60) {
			var uptimeDays = Math.floor(uptime / (24 * 60 * 60));
			uptimeText = uptimeDays + " " + (uptimeDays === 1 ? "day" : "days");
			var uptimeHours = Math.floor(uptime / (60 * 60)) - uptimeDays * 24;
			if (uptimeHours) uptimeText += ", " + uptimeHours + " " + (uptimeHours === 1 ? "hour" : "hours");
		} else {
			uptimeText = uptime.seconds().duration();
		}
		this.sendReplyBox("Uptime: <b>" + uptimeText + "</b>");
	},

	groups: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('+ <b>Career</b> - They can use ! commands like !groups, and talk during moderated chat<br />' +
			'% <b>PeaceKeeper</b> - The above, and they can mute. Global % can also lock users and check for alts<br />' +
			'@ <b>Head PeaceKeeper</b> - The above, and they can ban users<br />' +
			'&amp; <b>Game Maker</b> - The above, and they can promote moderators and force ties<br />'+
			'~ <b>President</b> - They can do anything, like change what this message says<br />'+
			'â—ˆ <b>Gym Leader</b> - They are Voice but they have access to /announce<br />'+
			'âœ¸ <b>Elite Four</b> - They are basically Driver<br />'+
			'âœ¯ <b>Champion</b> - They are Driver with the ability to /declare');
	},

	opensource: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Pokemon Showdown is open source:<br />" +
			"- Language: JavaScript (Node.js)<br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown/commits/master\">What's new?</a><br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown\">Server source code</a><br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown-Client\">Client source code</a>"
		);
	},

	avatars: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox("Your avatar can be changed using the Options menu (it looks like a gear) in the upper right of Pokemon Showdown. Custom avatars are only obtainable by staff.");
	},

	introduction: 'intro',
	intro: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"New to competitive pokemon?<br />" +
			"- <a href=\"http://www.smogon.com/sim/ps_guide\">Beginner's Guide to PokÃ©mon Showdown</a><br />" +
			"- <a href=\"http://www.smogon.com/dp/articles/intro_comp_pokemon\">An introduction to competitive PokÃ©mon</a><br />" +
			"- <a href=\"http://www.smogon.com/bw/articles/bw_tiers\">What do 'OU', 'UU', etc mean?</a><br />" +
			"- <a href=\"http://www.smogon.com/xyhub/tiers\">What are the rules for each format? What is 'Sleep Clause'?</a>"
		);
	},
	mentoring: 'smogintro',
	smogonintro: 'smogintro',
	smogintro: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Welcome to Smogon's Official PokÃ©mon Showdown server! The Mentoring room can be found <a href=\"http://play.pokemonshowdown.com/communitymentoring\">here</a> or by using /join communitymentoring.<br /><br />" +
			"Here are some useful links to Smogon\'s Mentorship Program to help you get integrated into the community:<br />" +
			"- <a href=\"http://www.smogon.com/mentorship/primer\">Smogon Primer: A brief introduction to Smogon's subcommunities</a><br />" +
			"- <a href=\"http://www.smogon.com/mentorship/introductions\">Introduce yourself to Smogon!</a><br />" +
			"- <a href=\"http://www.smogon.com/mentorship/profiles\">Profiles of current Smogon Mentors</a><br />" +
			"- <a href=\"http://mibbit.com/#mentor@irc.synirc.net\">#mentor: the Smogon Mentorship IRC channel</a><br />" +
			"All of these links and more can be found at the <a href=\"http://www.smogon.com/mentorship/\">Smogon Mentorship Program's hub</a>."
		);
	},

	calculator: 'calc',
	calc: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Pokemon Showdown! damage calculator. (Courtesy of Honko)<br />" +
			"- <a href=\"http://pokemonshowdown.com/damagecalc/\">Damage Calculator</a>"
		);
	},

	cap: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"An introduction to the Create-A-Pokemon project:<br />" +
			"- <a href=\"http://www.smogon.com/cap/\">CAP project website and description</a><br />" +
			"- <a href=\"http://www.smogon.com/forums/showthread.php?t=48782\">What Pokemon have been made?</a><br />" +
			"- <a href=\"http://www.smogon.com/forums/showthread.php?t=3464513\">Talk about the metagame here</a><br />" +
			"- <a href=\"http://www.smogon.com/forums/showthread.php?t=3466826\">Practice BW CAP teams</a>"
		);
	},

	gennext: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"NEXT (also called Gen-NEXT) is a mod that makes changes to the game:<br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown/blob/master/mods/gennext/README.md\">README: overview of NEXT</a><br />" +
			"Example replays:<br />" +
			"- <a href=\"http://replay.pokemonshowdown.com/gennextou-37815908\">roseyraid vs Zarel</a><br />" +
			"- <a href=\"http://replay.pokemonshowdown.com/gennextou-37900768\">QwietQwilfish vs pickdenis</a>"
		);
	},

	om: 'othermetas',
	othermetas: function (target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = "";
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/forums/206/\">Information on the Other Metagames</a><br />";
		}
		if (target === 'all' || target === 'hackmons') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3475624/\">Hackmons</a><br />";
		}
		if (target === 'all' || target === 'balancedhackmons' || target === 'bh') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3463764/\">Balanced Hackmons</a><br />";
			if (target !== 'all') {
				buffer += "- <a href=\"http://www.smogon.com/forums/threads/3499973/\">Balanced Hackmons Mentoring Program</a><br />";
			}
		}
		if (target === 'all' || target === 'glitchmons') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3467120/\">Glitchmons</a><br />";
		}
		if (target === 'all' || target === 'tiershift' || target === 'ts') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3479358/\">Tier Shift</a><br />";
		}
		if (target === 'all' || target === 'stabmons') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3484106/\">STABmons</a><br />";
		}
		if (target === 'all' || target === 'omotm' || target === 'omofthemonth' || target === 'month') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3481155/\">OM of the Month</a><br />";
		}
		if (target === 'all' || target === 'skybattles') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3493601/\">Sky Battles</a><br />";
		}
		if (target === 'all' || target === 'inversebattle' || target === 'inverse') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3492433/\">Inverse Battle</a><br />";
		}
		if (target === 'all' || target === 'middlecup' || target === 'mc') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3494887/\">Middle Cup</a><br />";
		}
		if (target === 'all' || target === 'outheorymon' || target === 'theorymon') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/3499219/\">OU Theorymon</a><br />";
		}
		if (target === 'all' || target === 'index') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/other-metagames-index.3472405/\">OM Index</a><br />";
		}
		if (!matched) {
			return this.sendReply("The Other Metas entry '" + target + "' was not found. Try /othermetas or /om for general help.");
		}
		this.sendReplyBox(buffer);
	},

	roomhelp: function (target, room, user) {
		if (room.id === 'lobby') return this.sendReply("This command is too spammy for lobby.");
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Room drivers (%) can use:<br />" +
			"- /warn OR /k <em>username</em>: warn a user and show the Pokemon Showdown rules<br />" +
			"- /mute OR /m <em>username</em>: 7 minute mute<br />" +
			"- /hourmute OR /hm <em>username</em>: 60 minute mute<br />" +
			"- /unmute <em>username</em>: unmute<br />" +
			"- /announce OR /wall <em>message</em>: make an announcement<br />" +
			"- /modlog <em>username</em>: search the moderator log of the room<br />" +
			"<br />" +
			"Room moderators (@) can also use:<br />" +
			"- /roomban OR /rb <em>username</em>: bans user from the room<br />" +
			"- /roomunban <em>username</em>: unbans user from the room<br />" +
			"- /roomvoice <em>username</em>: appoint a room voice<br />" +
			"- /roomdevoice <em>username</em>: remove a room voice<br />" +
			"- /modchat <em>[off/autoconfirmed/+]</em>: set modchat level<br />" +
			"<br />" +
			"Room owners (#) can also use:<br />" +
			"- /roomdesc <em>description</em>: set the room description on the room join page<br />" +
			"- /rules <em>rules link</em>: set the room rules link seen when using /rules<br />" +
			"- /roommod, /roomdriver <em>username</em>: appoint a room moderator/driver<br />" +
			"- /roomdemod, /roomdedriver <em>username</em>: remove a room moderator/driver<br />" +
			"- /modchat <em>[%/@/#]</em>: set modchat level<br />" +
			"- /declare <em>message</em>: make a large blue declaration to the room<br />" +
			"</div>"
		);
	},

	restarthelp: function (target, room, user) {
		if (room.id === 'lobby' && !this.can('lockdown')) return false;
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"The server is restarting. Things to know:<br />" +
			"- We wait a few minutes before restarting so people can finish up their battles<br />" +
			"- The restart itself will take around 0.6 seconds<br />" +
			"- Your ladder ranking and teams will not change<br />" +
			"- We are restarting to update PokÃ©mon Showdown to a newer version"
		);
	},

	rule: 'rules',
	rules: function (target, room, user) {
		if (!target) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox("Please follow the rules:<br />" +
				(room.rulesLink ? "- <a href=\"" + sanitize(room.rulesLink) + "\">" + sanitize(room.title) + " room rules</a><br />" : "") +
				"- <a href=\"http://pokemonshowdown.com/rules\">" + (room.rulesLink ? "Global rules" : "Rules") + "</a>");
			return;
		}
		if (!this.can('roommod', null, room)) return;
		if (target.length > 80) {
			return this.sendReply("Error: Room rules link is too long (must be under 80 characters). You can use a URL shortener to shorten the link.");
		}

		room.rulesLink = target.trim();
		this.sendReply("(The room rules link is now: " + target + ")");

		if (room.chatRoomData) {
			room.chatRoomData.rulesLink = room.rulesLink;
			Rooms.global.writeChatRoomData();
		}
	},

	faq: function (target, room, user) {
		if (!this.canBroadcast()) return;
		target = target.toLowerCase();
		var buffer = "";
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += "<a href=\"http://www.smogon.com/sim/faq\">Frequently Asked Questions</a><br />";
		}
		if (target === 'all' || target === 'deviation') {
			matched = true;
			buffer += "<a href=\"http://www.smogon.com/sim/faq#deviation\">Why did this user gain or lose so many points?</a><br />";
		}
		if (target === 'all' || target === 'doubles' || target === 'triples' || target === 'rotation') {
			matched = true;
			buffer += "<a href=\"http://www.smogon.com/sim/faq#doubles\">Can I play doubles/triples/rotation battles here?</a><br />";
		}
		if (target === 'all' || target === 'randomcap') {
			matched = true;
			buffer += "<a href=\"http://www.smogon.com/sim/faq#randomcap\">What is this fakemon and what is it doing in my random battle?</a><br />";
		}
		if (target === 'all' || target === 'restarts') {
			matched = true;
			buffer += "<a href=\"http://www.smogon.com/sim/faq#restarts\">Why is the server restarting?</a><br />";
		}
		if (target === 'all' || target === 'staff') {
			matched = true;
			buffer += "<a href=\"http://www.smogon.com/sim/staff_faq\">Staff FAQ</a><br />";
		}
		if (target === 'all' || target === 'autoconfirmed' || target === 'ac') {
			matched = true;
			buffer += "A user is autoconfirmed when they have won at least one rated battle and have been registered for a week or longer.<br />";
		}
		if (!matched) {
			return this.sendReply("The FAQ entry '" + target + "' was not found. Try /faq for general help.");
		}
		this.sendReplyBox(buffer);
	},

	banlists: 'tiers',
	tier: 'tiers',
	tiers: function (target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = "";
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/tiers/\">Smogon Tiers</a><br />";
			buffer += "- <a href=\"http://www.smogon.com/forums/threads/tiering-faq.3498332/\">Tiering FAQ</a><br />";
			buffer += "- <a href=\"http://www.smogon.com/xyhub/tiers\">The banlists for each tier</a><br />";
		}
		if (target === 'all' || target === 'ubers' || target === 'uber') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/bw/tiers/uber\">Uber Pokemon</a><br />";
		}
		if (target === 'all' || target === 'overused' || target === 'ou') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/bw/tiers/ou\">Overused Pokemon</a><br />";
		}
		if (target === 'all' || target === 'underused' || target === 'uu') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/bw/tiers/uu\">Underused Pokemon</a><br />";
		}
		if (target === 'all' || target === 'rarelyused' || target === 'ru') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/bw/tiers/ru\">Rarelyused Pokemon</a><br />";
		}
		if (target === 'all' || target === 'neverused' || target === 'nu') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/bw/tiers/nu\">Neverused Pokemon</a><br />";
		}
		if (target === 'all' || target === 'littlecup' || target === 'lc') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/bw/tiers/lc\">Little Cup Pokemon</a><br />";
		}
		if (target === 'all' || target === 'doubles') {
			matched = true;
			buffer += "- <a href=\"http://www.smogon.com/bw/metagames/doubles\">Doubles</a><br />";
		}
		if (!matched) {
			return this.sendReply("The Tiers entry '" + target + "' was not found. Try /tiers for general help.");
		}
		this.sendReplyBox(buffer);
	},

	analysis: 'smogdex',
	strategy: 'smogdex',
	smogdex: function (target, room, user) {
		if (!this.canBroadcast()) return;

		var targets = target.split(',');
		if (toId(targets[0]) === 'previews') return this.sendReplyBox("<a href=\"http://www.smogon.com/forums/threads/sixth-generation-pokemon-analyses-index.3494918/\">Generation 6 Analyses Index</a>, brought to you by <a href=\"http://www.smogon.com\">Smogon University</a>");
		var pokemon = Tools.getTemplate(targets[0]);
		var item = Tools.getItem(targets[0]);
		var move = Tools.getMove(targets[0]);
		var ability = Tools.getAbility(targets[0]);
		var atLeastOne = false;
		var generation = (targets[1] || 'bw').trim().toLowerCase();
		var genNumber = 5;
		var doublesFormats = {'vgc2012':1, 'vgc2013':1, 'doubles':1};
		var doublesFormat = (!targets[2] && generation in doublesFormats)? generation : (targets[2] || '').trim().toLowerCase();
		var doublesText = '';
		if (generation === 'bw' || generation === 'bw2' || generation === '5' || generation === 'five') {
			generation = 'bw';
		} else if (generation === 'dp' || generation === 'dpp' || generation === '4' || generation === 'four') {
			generation = 'dp';
			genNumber = 4;
		} else if (generation === 'adv' || generation === 'rse' || generation === 'rs' || generation === '3' || generation === 'three') {
			generation = 'rs';
			genNumber = 3;
		} else if (generation === 'gsc' || generation === 'gs' || generation === '2' || generation === 'two') {
			generation = 'gs';
			genNumber = 2;
		} else if(generation === 'rby' || generation === 'rb' || generation === '1' || generation === 'one') {
			generation = 'rb';
			genNumber = 1;
		} else {
			generation = 'bw';
		}
		if (doublesFormat !== '') {
			// Smogon only has doubles formats analysis from gen 5 onwards.
			if (!(generation in {'bw':1, 'xy':1}) || !(doublesFormat in doublesFormats)) {
				doublesFormat = '';
			} else {
				doublesText = {'vgc2012':"VGC 2012", 'vgc2013':"VGC 2013", 'doubles':"Doubles"}[doublesFormat];
				doublesFormat = '/' + doublesFormat;
			}
		}

		// Pokemon
		if (pokemon.exists) {
			atLeastOne = true;
			if (genNumber < pokemon.gen) {
				return this.sendReplyBox("" + pokemon.name + " did not exist in " + generation.toUpperCase() + "!");
			}
			if (pokemon.tier === 'G4CAP' || pokemon.tier === 'G5CAP') {
				generation = 'cap';
			}

			var poke = pokemon.name.toLowerCase();
			if (poke === 'nidoranm') poke = 'nidoran-m';
			if (poke === 'nidoranf') poke = 'nidoran-f';
			if (poke === 'farfetch\'d') poke = 'farfetchd';
			if (poke === 'mr. mime') poke = 'mr_mime';
			if (poke === 'mime jr.') poke = 'mime_jr';
			if (poke === 'deoxys-attack' || poke === 'deoxys-defense' || poke === 'deoxys-speed' || poke === 'kyurem-black' || poke === 'kyurem-white') poke = poke.substr(0, 8);
			if (poke === 'wormadam-trash') poke = 'wormadam-s';
			if (poke === 'wormadam-sandy') poke = 'wormadam-g';
			if (poke === 'rotom-wash' || poke === 'rotom-frost' || poke === 'rotom-heat') poke = poke.substr(0, 7);
			if (poke === 'rotom-mow') poke = 'rotom-c';
			if (poke === 'rotom-fan') poke = 'rotom-s';
			if (poke === 'giratina-origin' || poke === 'tornadus-therian' || poke === 'landorus-therian') poke = poke.substr(0, 10);
			if (poke === 'shaymin-sky') poke = 'shaymin-s';
			if (poke === 'arceus') poke = 'arceus-normal';
			if (poke === 'thundurus-therian') poke = 'thundurus-t';

			this.sendReplyBox("<a href=\"http://www.smogon.com/" + generation + "/pokemon/" + poke + doublesFormat + "\">" + generation.toUpperCase() + " " + doublesText + " " + pokemon.name + " analysis</a>, brought to you by <a href=\"http://www.smogon.com\">Smogon University</a>");
		}

		// Item
		if (item.exists && genNumber > 1 && item.gen <= genNumber) {
			atLeastOne = true;
			var itemName = item.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox("<a href=\"http://www.smogon.com/" + generation + "/items/" + itemName + "\">" + generation.toUpperCase() + " " + item.name + " item analysis</a>, brought to you by <a href=\"http://www.smogon.com\">Smogon University</a>");
		}

		// Ability
		if (ability.exists && genNumber > 2 && ability.gen <= genNumber) {
			atLeastOne = true;
			var abilityName = ability.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox("<a href=\"http://www.smogon.com/" + generation + "/abilities/" + abilityName + "\">" + generation.toUpperCase() + " " + ability.name + " ability analysis</a>, brought to you by <a href=\"http://www.smogon.com\">Smogon University</a>");
		}

		// Move
		if (move.exists && move.gen <= genNumber) {
			atLeastOne = true;
			var moveName = move.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox("<a href=\"http://www.smogon.com/" + generation + "/moves/" + moveName + "\">" + generation.toUpperCase() + " " + move.name + " move analysis</a>, brought to you by <a href=\"http://www.smogon.com\">Smogon University</a>");
		}

		if (!atLeastOne) {
			return this.sendReplyBox("Pokemon, item, move, or ability not found for generation " + generation.toUpperCase() + ".");
		}
	},

	/*********************************************************
	 * Miscellaneous commands
	 *********************************************************/

	secret: function(target, room, user) {
		this.sendReply("Once suxaphones");
	},

	potd: function(target, room, user) {
		if (!this.can('potd')) return false;

		Config.potd = target;
		Simulator.SimulatorProcess.eval('Config.potd = \'' + toId(target) + '\'');
		if (target) {
			if (Rooms.lobby) Rooms.lobby.addRaw("<div class=\"broadcast-blue\"><b>The Pokemon of the Day is now " + target + "!</b><br />This Pokemon will be guaranteed to show up in random battles.</div>");
			this.logModCommand("The Pokemon of the Day was changed to " + target + " by " + user.name + ".");
		} else {
			if (Rooms.lobby) Rooms.lobby.addRaw("<div class=\"broadcast-blue\"><b>The Pokemon of the Day was removed!</b><br />No pokemon will be guaranteed in random battles.</div>");
			this.logModCommand("The Pokemon of the Day was removed by " + user.name + ".");
		}
	},

	roll: 'dice',
	dice: function (target, room, user) {
		if (!this.canBroadcast()) return;
		var d = target.indexOf("d");
		if (d != -1) {
			var num = parseInt(target.substring(0, d));
			var faces;
			if (target.length > d) faces = parseInt(target.substring(d + 1));
			if (isNaN(num)) num = 1;
			if (isNaN(faces)) return this.sendReply("The number of faces must be a valid integer.");
			if (faces < 1 || faces > 1000) return this.sendReply("The number of faces must be between 1 and 1000");
			if (num < 1 || num > 20) return this.sendReply("The number of dice must be between 1 and 20");
			var rolls = [];
			var total = 0;
			for (var i = 0; i < num; ++i) {
				rolls[i] = (Math.floor(faces * Math.random()) + 1);
				total += rolls[i];
			}
			return this.sendReplyBox("Random number " + num + "x(1 - " + faces + "): " + rolls.join(", ") + "<br />Total: " + total);
		}
		if (target && isNaN(target) || target.length > 21) return this.sendReply("The max roll must be a number under 21 digits.");
		var maxRoll = (target)? target : 6;
		var rand = Math.floor(maxRoll * Math.random()) + 1;
		return this.sendReplyBox("Random number (1 - " + maxRoll + "): " + rand);
	},

	register: function () {
		if (!this.canBroadcast()) return;
		this.sendReply("You must win a rated battle to register.");
	},

	lobbychat: function (target, room, user, connection) {
		if (!Rooms.lobby) return this.popupReply("This server doesn't have a lobby.");
		target = toId(target);
		if (target === 'off') {
			user.leaveRoom(Rooms.lobby, connection.socket);
			connection.send('|users|');
			this.sendReply("You are now blocking lobby chat.");
		} else {
			user.joinRoom(Rooms.lobby, connection);
			this.sendReply("You are now receiving lobby chat.");
		}
	},

	showimage: function (target, room, user) {
		if (!target) return this.parse('/help showimage');
		if (!this.can('declare', null, room)) return false;
		if (!this.canBroadcast()) return;

		targets = target.split(',');
		if (targets.length != 3) {
			return this.parse('/help showimage');
		}

		this.sendReply('|raw|<img src="' + sanitize(targets[0]) + '" alt="" width="' + toId(targets[1]) + '" height="' + toId(targets[2]) + '" />');
	},

	htmlbox: function (target, room, user) {
		if (!target) return this.parse('/help htmlbox');
		if (!user.can('gdeclare', null, room) && (!user.can('declare', null, room) || !user.can('announce'))) {
			return this.sendReply("/htmlbox - Access denied.");
		}
		if (!this.canBroadcast('!htmlbox')) return;

		this.sendReplyBox(target);
	},

	a: function (target, room, user) {
		if (!this.can('rawpacket')) return false;
		// secret sysop command
		room.add(target);
	},

	hide: 'hideauth',
	hideauth: function(target, room, user){
		if(!user.can('hideauth'))
			return this.sendReply( '/hideauth - access denied.');

		var tar = ' ';
		if(target){
			target = target.trim();
			if(config.groupsranking.indexOf(target) > -1){
				if( config.groupsranking.indexOf(target) <= config.groupsranking.indexOf(user.group)){
					tar = target;
				}else{
					this.sendReply('The group symbol you have tried to use is of a higher authority than you have access to. Defaulting to \' \' instead.');
				}
			}else{
				this.sendReply('You have tried to use an invalid character as your auth symbol. Defaulting to \' \' instead.');
			}
		}

		user.getIdentity = function(){
			if(this.muted)
				return '!' + this.name;
			if(this.locked)
				return '#' + this.name;
			return tar + this.name;
		};
		user.updateIdentity();
		this.sendReply( 'You are now hiding your auth symbol as \''+tar+ '\'.');
		return this.logModCommand(user.name + ' is hiding auth symbol as \''+ tar + '\'');
	},

	showauth: function(target, room, user){
		if(!user.can('hideauth'))
			return	this.sendReply( '/showauth - access denied.');

		delete user.getIdentity;
		user.updateIdentity();
		this.sendReply('You have now revealed your auth symbol.');
		return this.logModCommand(user.name + ' has revealed their auth symbol.');
	},

	/*********************************************************
	 * Help commands
	 *********************************************************/

	commands: 'help',
	h: 'help',
	'?': 'help',
	help: function (target, room, user) {
		target = target.toLowerCase();
		var matched = false;
		if (target === 'all' || target === 'msg' || target === 'pm' || target === 'whisper' || target === 'w') {
			matched = true;
			this.sendReply("/msg OR /whisper OR /w [username], [message] - Send a private message.");
		}
		if (target === 'all' || target === 'r' || target === 'reply') {
			matched = true;
			this.sendReply("/reply OR /r [message] - Send a private message to the last person you received a message from, or sent a message to.");
		}
		if (target === 'all' || target === 'rating' || target === 'ranking' || target === 'rank' || target === 'ladder') {
			matched = true;
			this.sendReply("/rating - Get your own rating.");
			this.sendReply("/rating [username] - Get user's rating.");
		}
		if (target === 'all' || target === 'nick') {
			matched = true;
			this.sendReply("/nick [new username] - Change your username.");
		}
		if (target === 'all' || target === 'avatar') {
			matched = true;
			this.sendReply("/avatar [new avatar number] - Change your trainer sprite.");
		}
		if (target === 'all' || target === 'whois' || target === 'alts' || target === 'ip' || target === 'rooms') {
			matched = true;
			this.sendReply("/whois - Get details on yourself: alts, group, IP address, and rooms.");
			this.sendReply("/whois [username] - Get details on a username: alts (Requires: % @ & ~), group, IP address (Requires: @ & ~), and rooms.");
		}
		if (target === 'all' || target === 'data') {
			matched = true;
			this.sendReply("/data [pokemon/item/move/ability] - Get details on this pokemon/item/move/ability.");
			this.sendReply("!data [pokemon/item/move/ability] - Show everyone these details. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'analysis') {
			matched = true;
			this.sendReply("/analysis [pokemon], [generation] - Links to the Smogon University analysis for this Pokemon in the given generation.");
			this.sendReply("!analysis [pokemon], [generation] - Shows everyone this link. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'groups') {
			matched = true;
			this.sendReply("/groups - Explains what the + % @ & next to people's names mean.");
			this.sendReply("!groups - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'opensource') {
			matched = true;
			this.sendReply("/opensource - Links to PS's source code repository.");
			this.sendReply("!opensource - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'avatars') {
			matched = true;
			this.sendReply("/avatars - Explains how to change avatars.");
			this.sendReply("!avatars - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'intro') {
			matched = true;
			this.sendReply("/intro - Provides an introduction to competitive pokemon.");
			this.sendReply("!intro - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'cap') {
			matched = true;
			this.sendReply("/cap - Provides an introduction to the Create-A-Pokemon project.");
			this.sendReply("!cap - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'om') {
			matched = true;
			this.sendReply("/om - Provides links to information on the Other Metagames.");
			this.sendReply("!om - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'learn' || target === 'learnset' || target === 'learnall') {
			matched = true;
			this.sendReply("/learn [pokemon], [move, move, ...] - Displays how a Pokemon can learn the given moves, if it can at all.");
			this.sendReply("!learn [pokemon], [move, move, ...] - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'calc' || target === 'caclulator') {
			matched = true;
			this.sendReply("/calc - Provides a link to a damage calculator");
			this.sendReply("!calc - Shows everyone a link to a damage calculator. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'blockchallenges' || target === 'away' || target === 'idle') {
			matched = true;
			this.sendReply("/away - Blocks challenges so no one can challenge you. Deactivate it with /back.");
		}
		if (target === 'all' || target === 'allowchallenges' || target === 'back') {
			matched = true;
			this.sendReply("/back - Unlocks challenges so you can be challenged again. Deactivate it with /away.");
		}
		if (target === 'all' || target === 'faq') {
			matched = true;
			this.sendReply("/faq [theme] - Provides a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them.");
			this.sendReply("!faq [theme] - Shows everyone a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'highlight') {
			matched = true;
			this.sendReply("Set up highlights:");
			this.sendReply("/highlight add, word - add a new word to the highlight list.");
			this.sendReply("/highlight list - list all words that currently highlight you.");
			this.sendReply("/highlight delete, word - delete a word from the highlight list.");
			this.sendReply("/highlight delete - clear the highlight list");
		}
		if (target === 'all' || target === 'timestamps') {
			matched = true;
			this.sendReply("Set your timestamps preference:");
			this.sendReply("/timestamps [all|lobby|pms], [minutes|seconds|off]");
			this.sendReply("all - change all timestamps preferences, lobby - change only lobby chat preferences, pms - change only PM preferences");
			this.sendReply("off - set timestamps off, minutes - show timestamps of the form [hh:mm], seconds - show timestamps of the form [hh:mm:ss]");
		}
		if (target === 'all' || target === 'effectiveness' || target === 'matchup' || target === 'eff' || target === 'type') {
			matched = true;
			this.sendReply("/effectiveness OR /matchup OR /eff OR /type [attack], [defender] - Provides the effectiveness of a move or type on another type or a PokÃ©mon.");
			this.sendReply("!effectiveness OR /matchup OR !eff OR !type [attack], [defender] - Shows everyone the effectiveness of a move or type on another type or a PokÃ©mon.");
		}
		if (target === 'all' || target === 'dexsearch' || target === 'dsearch') {
			matched = true;
			this.sendReply("/dexsearch [type], [move], [move], ... - Searches for Pokemon that fulfill the selected criteria.");
			this.sendReply("Search categories are: type, tier, color, moves, ability, gen.");
			this.sendReply("Valid colors are: green, red, blue, white, brown, yellow, purple, pink, gray and black.");
			this.sendReply("Valid tiers are: Uber/OU/BL/LC/CAP.");
			this.sendReply("Types must be followed by ' type', e.g., 'dragon type'.");
			this.sendReply("Parameters can be excluded through the use of '!', e.g., '!water type' excludes all water types.");
			this.sendReply("The parameter 'mega' can be added to search for Mega Evolutions only.");
			this.sendReply("The order of the parameters does not matter.");
		}
		if (target === 'all' || target === 'dice' || target === 'roll') {
			matched = true;
			this.sendReply("/dice [optional max number] - Randomly picks a number between 1 and 6, or between 1 and the number you choose.");
			this.sendReply("/dice [number of dice]d[number of sides] - Simulates rolling a number of dice, e.g., /dice 2d4 simulates rolling two 4-sided dice.");
		}
		if (target === 'all' || target === 'join') {
			matched = true;
			this.sendReply("/join [roomname] - Attempts to join the room [roomname].");
		}
		if (target === 'all' || target === 'ignore') {
			matched = true;
			this.sendReply("/ignore [user] - Ignores all messages from the user [user].");
			this.sendReply("Note that staff messages cannot be ignored.");
		}
		if (target === 'all' || target === 'invite') {
			matched = true;
			this.sendReply("/invite [username], [roomname] - Invites the player [username] to join the room [roomname].");
		}
		if (target === '%' || target === 'lock' || target === 'l') {
			matched = true;
			this.sendReply("/lock OR /l [username], [reason] - Locks the user from talking in all chats. Requires: % @ & ~");
		}
		if (target === '%' || target === 'unlock') {
			matched = true;
			this.sendReply("/unlock [username] - Unlocks the user. Requires: % @ & ~");
		}
		if (target === '%' || target === 'redirect' || target === 'redir') {
			matched = true;
			this.sendReply("/redirect OR /redir [username], [roomname] - Attempts to redirect the user [username] to the room [roomname]. Requires: % @ & ~");
		}
		if (target === '%' || target === 'modnote') {
			matched = true;
			this.sendReply("/modnote [note] - Adds a moderator note that can be read through modlog. Requires: % @ & ~");
		}
		if (target === '%' || target === 'forcerename' || target === 'fr') {
			matched = true;
			this.sendReply("/forcerename OR /fr [username], [reason] - Forcibly change a user's name and shows them the [reason]. Requires: % @ & ~");
		}
		if (target === '@' || target === 'roomban' || target === 'rb') {
			matched = true;
			this.sendReply("/roomban [username] - Bans the user from the room you are in. Requires: @ & ~");
		}
		if (target === '@' || target === 'roomunban') {
			matched = true;
			this.sendReply("/roomunban [username] - Unbans the user from the room you are in. Requires: @ & ~");
		}
		if (target === '@' || target === 'ban' || target === 'b') {
			matched = true;
			this.sendReply("/ban OR /b [username], [reason] - Kick user from all rooms and ban user's IP address with reason. Requires: @ & ~");
		}
		if (target === '&' || target === 'banip') {
			matched = true;
			this.sendReply("/banip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: & ~");
		}
		if (target === '@' || target === 'unban') {
			matched = true;
			this.sendReply("/unban [username] - Unban a user. Requires: @ & ~");
		}
		if (target === '&' || target === 'unbanall') {
			matched = true;
			this.sendReply("/unbanall - Unban all IP addresses. Requires: & ~");
		}
		if (target === '%' || target === 'modlog') {
			matched = true;
			this.sendReply("/modlog [roomid|all], [n] - Roomid defaults to current room. If n is a number or omitted, display the last n lines of the moderator log. Defaults to 15. If n is not a number, search the moderator log for 'n' on room's log [roomid]. If you set [all] as [roomid], searches for 'n' on all rooms's logs. Requires: % @ & ~");
		}
		if (target === "%" || target === 'kickbattle ') {
			matched = true;
			this.sendReply("/kickbattle [username], [reason] - Kicks an user from a battle with reason. Requires: % @ & ~");
		}
		if (target === "%" || target === 'warn' || target === 'k') {
			matched = true;
			this.sendReply("/warn OR /k [username], [reason] - Warns a user showing them the Pokemon Showdown Rules and [reason] in an overlay. Requires: % @ & ~");
		}
		if (target === '%' || target === 'mute' || target === 'm') {
			matched = true;
			this.sendReply("/mute OR /m [username], [reason] - Mutes a user with reason for 7 minutes. Requires: % @ & ~");
		}
		if (target === '%' || target === 'hourmute' || target === 'hm') {
			matched = true;
			this.sendReply("/hourmute OR /hm [username], [reason] - Mutes a user with reason for an hour. Requires: % @ & ~");
		}
		if (target === '%' || target === 'unmute' || target === 'um') {
			matched = true;
			this.sendReply("/unmute [username] - Removes mute from user. Requires: % @ & ~");
		}
		if (target === '&' || target === 'promote') {
			matched = true;
			this.sendReply("/promote [username], [group] - Promotes the user to the specified group or next ranked group. Requires: & ~");
		}
		if (target === '&' || target === 'demote') {
			matched = true;
			this.sendReply("/demote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: & ~");
		}
		if (target === '&' || target === 'forcetie') {
			matched = true;
			this.sendReply("/forcetie - Forces the current match to tie. Requires: & ~");
		}
		if (target === '&' || target === 'showimage') {
			matched = true;
			this.sendReply("/showimage [url], [width], [height] - Show an image. Requires: & ~");
		}
		if (target === '&' || target === 'declare') {
			matched = true;
			this.sendReply("/declare [message] - Anonymously announces a message. Requires: & ~");
		}
		if (target === '~' || target === 'chatdeclare' || target === 'cdeclare') {
			matched = true;
			this.sendReply("/cdeclare [message] - Anonymously announces a message to all chatrooms on the server. Requires: ~");
		}
		if (target === '~' || target === 'globaldeclare' || target === 'gdeclare') {
			matched = true;
			this.sendReply("/globaldeclare [message] - Anonymously announces a message to every room on the server. Requires: ~");
		}
		if (target === '%' || target === 'announce' || target === 'wall') {
			matched = true;
			this.sendReply("/announce OR /wall [message] - Makes an announcement. Requires: % @ & ~");
		}
		if (target === '@' || target === 'modchat') {
			matched = true;
			this.sendReply("/modchat [off/autoconfirmed/+/%/@/&/~] - Set the level of moderated chat. Requires: @ for off/autoconfirmed/+ options, & ~ for all the options");
		}
		if (target === '~' || target === 'hotpatch') {
			matched = true;
			this.sendReply("Hot-patching the game engine allows you to update parts of Showdown without interrupting currently-running battles. Requires: ~");
			this.sendReply("Hot-patching has greater memory requirements than restarting.");
			this.sendReply("/hotpatch chat - reload chat-commands.js");
			this.sendReply("/hotpatch battles - spawn new simulator processes");
			this.sendReply("/hotpatch formats - reload the tools.js tree, rebuild and rebroad the formats list, and also spawn new simulator processes");
		}
		if (target === '~' || target === 'lockdown') {
			matched = true;
			this.sendReply("/lockdown - locks down the server, which prevents new battles from starting so that the server can eventually be restarted. Requires: ~");
		}
		if (target === '~' || target === 'kill') {
			matched = true;
			this.sendReply("/kill - kills the server. Can't be done unless the server is in lockdown state. Requires: ~");
		}
		if (target === '~' || target === 'loadbanlist') {
			matched = true;
			this.sendReply("/loadbanlist - Loads the bans located at ipbans.txt. The command is executed automatically at startup. Requires: ~");
		}
		if (target === '~' || target === 'makechatroom') {
			matched = true;
			this.sendReply("/makechatroom [roomname] - Creates a new room named [roomname]. Requires: ~");
		}
		if (target === '~' || target === 'deregisterchatroom') {
			matched = true;
			this.sendReply("/deregisterchatroom [roomname] - Deletes room [roomname] after the next server restart. Requires: ~");
		}
		if (target === '~' || target === 'roomowner') {
			matched = true;
			this.sendReply("/roomowner [username] - Appoints [username] as a room owner. Removes official status. Requires: ~");
		}
		if (target === '~' || target === 'roomdeowner') {
			matched = true;
			this.sendReply("/roomdeowner [username] - Removes [username]'s status as a room owner. Requires: ~");
		}
		if (target === '~' || target === 'privateroom') {
			matched = true;
			this.sendReply("/privateroom [on/off] - Makes or unmakes a room private. Requires: ~");
		}
		if (target === 'all' || target === 'help' || target === 'h' || target === '?' || target === 'commands') {
			matched = true;
			this.sendReply("/help OR /h OR /? - Gives you help.");
		}
		if (target === 'all' || target === 'image') {
			matched = true;
			this.sendReply("/image returns the image with a specified width and height.");
		}
		if (!target) {
			this.sendReply("COMMANDS: /nick, /avatar, /rating, /whois, /msg, /reply, /ignore, /away, /back, /timestamps, /highlight");
			this.sendReply("INFORMATIONAL COMMANDS: /data, /dexsearch, /groups, /opensource, /avatars, /faq, /rules, /intro, /tiers, /othermetas, /learn, /analysis, /calc (replace / with ! to broadcast. (Requires: + % @ & ~))");
			this.sendReply("For details on all room commands, use /roomhelp");
			this.sendReply("For details on all commands, use /help all");
			if (user.group !== Config.groupsranking[0]) {
				this.sendReply("DRIVER COMMANDS: /warn, /mute, /unmute, /alts, /forcerename, /modlog, /lock, /unlock, /announce, /redirect");
				this.sendReply("MODERATOR COMMANDS: /ban, /unban, /ip");
				this.sendReply("LEADER COMMANDS: /declare, /forcetie, /forcewin, /promote, /demote, /banip, /unbanall");
				this.sendReply("For details on all moderator commands, use /help @");
			}
			this.sendReply("For details of a specific command, use something like: /help data");
		} else if (!matched) {
			this.sendReply("The command '" + target + "' was not found. Try /help for general help");
		}
	},



	/*********************************************************
	 * PokemonDb custom commands
	 *********************************************************/
	DBUserPSnames: 'dbusernames',
	dbusernames: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Need to know who is who?<br />' +
			'- <a href="http://pokemondb.net/pokebase/meta/2785/what-is-your-pokemon-online-showdown-username?">Database and DB Server Usernames</a><br />');
	},
	
	dbinfo: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			' <b>Welcome to the Pokemon Database Showdown server!</b> Pokemon Database is a popular Pokemon fansite. ' +
			' Most of the users on this Showdown server are from our Q&amp;A community PokeBase, but all are welcome here!<br><br>' +
			' <a href="http://pokemondb.net">Pokemon Database homepage</a><br>' +
			' <a href="http://pokemondb.net/pokebase/">Pokebase Q&amp;A</a><br>' +
			' Twitter: <a href="https://twitter.com/pokemondb">@pokemon</a><br>' +
			' Facebook: <a href="https://www.facebook.com/PokemonDb">PokemonDb</a><br>'
		);
	},


	pickrandom: function (target, room, user) {
		if (!target)
			return this.sendReply('/pickrandom [option 1], [option 2], ... - Randomly chooses one of the given options.');
		if (!this.canBroadcast())
			return;

		var targets;
		if (target.indexOf(',') === -1)
			targets = target.split(' ');
		else
			targets = target.split(',');

		var result = Math.floor(Math.random() * targets.length);
		return this.sendReplyBox(targets[result].trim());
	},

	customavatar: function(target, room, user, connection) {
		if (!this.can('customavatars'))
			return false;
		if (!target)
			return connection.sendTo(room, 'Usage: /customavatar URL, filename');
		var http = require('http-get');
		target = target.split(", ");
		http.get(target[0], 'config/avatars/' + target[1], function (error, result) {
			if (error)
				connection.sendTo(room, '/customavatar - You supplied an invalid URL or file name!');
			else
				connection.sendTo(room, 'File saved to: ' + result.file);
		});
	},

	smited: function (target, room, user) {
		if (user.userid != 'scizornician,nindzya,cobblewobble')
			return false;

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser)
			return this.sendReply('User ' + this.targetUsername + ' not found.');
		if (!this.can('smite', targetUser))
			return false;

		if (Users.checkBanned(targetUser.latestIp) && !target && !targetUser.connected) {
			var problem = ' but was already smited';
			return this.privateModCommand('(' + targetUser.name + ' would be smited by ' + user.name+problem + '.)');
		}

		targetUser.popup(user.name + ' has permanently banned you.');
		this.addModCommand('I smite thee ' + targetUser.name);
		this.addModCommand(targetUser.name + ' was smited by ' + user.name + '.');
		targetUser.ban();
		ipbans.write('\n' + targetUser.latestIp);
	},

	showbadges: function(target, room, user, connection) {
		if (!this.canBroadcast()) return;

		if (!target) {
			var data = fs.readFileSync('config/badges.csv','utf8')
			var match = false;
			var numBadges = 0;
			var stuff = (''+data).split("\n");
			for (var i = stuff.length; i > -1; i--) {
				if (!stuff[i])
					continue;
				var row = stuff[i].split(",");
				var userid = toUserid(row[0]);
				if (user.userid == userid) {
					var x = Number(row[1]);
					var numBadges = x;
					match = true;
					break;
				}
			}
			if (match === true) {
				this.sendReplyBox(user.name + ' has ' + numBadges + ' DB badge(s).');
			}
			if (match === false) {
				connection.sendTo(room, 'You have no DB badges.');
			}
			user.badges = numBadges;
		}
		else {
			var data = fs.readFileSync('config/badges.csv','utf8')
			target = this.splitTarget(target);
			var targetUser = this.targetUser;
			if (!targetUser) {
				return this.sendReply('User '+this.targetUsername+' not found.');
			}
			var match = false;
			var numBadges = 0;
			var stuff = (''+data).split("\n");

			for (var i = stuff.length; i > -1; i--) {
				if (!stuff[i])
					continue;
				var row = stuff[i].split(",");
				var userid = toUserid(row[0]);
				if (targetUser.userid == userid || target == userid) {
					var x = Number(row[1]);
					var numBadges = x;
					match = true;
					break;
				}
			}

			if (match === true) {
				this.sendReplyBox(targetUser.name + ' has ' + numBadges + ' badge(s).');
			}
			if (match === false) {
				connection.sendTo(room, '' + targetUser.name + ' has no badges.');
			}
			Users.get(targetUser.userid).badges = numBadges;
		}
	},

	givebadge: function(target, room, user, connection) {
		if (ougymleaders.indexOf(user.userid) != -1 || admins.indexOf(user.userid) != -1) {
			if (!target) {
				var data = fs.readFileSync('config/badges.csv','utf8')
				var match = false;
				var numBadges = 0;
				var stuff = (''+data).split("\n");
				var line = '';

				for (var i = stuff.length; i > -1; i--) {
					if (!stuff[i])
						continue;
					var row = stuff[i].split(",");
					var userid = toUserid(row[0]);
					if (user.userid == userid) {
						var x = Number(row[1]);
						var numBadges = x;
						match = true;
						line = line + stuff[i];
						break;
					}
				}
				user.badges = numBadges;
				user.badges = user.badges + 1;

				if (match === true) {
					var re = new RegExp(line,"g");
					fs.readFile('config/badges.csv', 'utf8', function (err,data) {
						if (err) return console.log(err);
						var result = data.replace(re, user.userid+','+user.badges);
						fs.writeFile('config/badges.csv', result, 'utf8', function (err) {
							if (err) return console.log(err);
						});
					});
				}
				else {
					var log = fs.createWriteStream('config/badges.csv', {'flags': 'a'});
					log.write("\n"+user.userid+','+user.badges);
				}
				return this.sendReply('You were given a DB badge. You now have ' + user.badges + ' DB badges.');
			}
			else {
				if (target.indexOf(',') === -1) {
					var data = fs.readFileSync('config/badges.csv','utf8')
					target = this.splitTarget(target);
					var targetUser = this.targetUser;
					if (!targetUser) {
						return this.sendReply('User '+this.targetUsername+' not found.');
					}
					var match = false;
					var numBadges = 0;
					var stuff = (''+data).split("\n");
					var line = '';

					for (var i = stuff.length; i > -1; i--) {
						if (!stuff[i]) continue;
						var row = stuff[i].split(",");
						var userid = toUserid(row[0]);
						if (targetUser.userid == userid) {
							var x = Number(row[1]);
							var numBadges = x;
							match = true;
							line = line + stuff[i];
							break;
						}
					}

					Users.get(targetUser.userid).badges = numBadges;
					Users.get(targetUser.userid).badges = Users.get(targetUser.userid).badges + 1;
					if (match === true) {
						var re = new RegExp(line,"g");
						fs.readFile('config/badges.csv', 'utf8', function (err,data) {
							if (err) return console.log(err);
							var result = data.replace(re, targetUser.userid+','+Users.get(targetUser.userid).badges);
							fs.writeFile('config/badges.csv', result, 'utf8', function (err) {
								if (err) return console.log(err);
							});
						});
					}
					else {
						var log = fs.createWriteStream('config/badges.csv', {'flags': 'a'});
						log.write("\n"+targetUser.userid+','+Users.get(targetUser.userid).badges);
					}

					return this.sendReply(targetUser + ' was given a DB badge.');
				}
			}
		}
		else {
			return this.sendReply('Access Denied.');
		}

		if (admins.indexOf(user.userid) != -1) {
			if (target.indexOf(',') != -1) {
				var parts = target.split(',');
				parts[0] = this.splitTarget(parts[0]);
				var targetUser = this.targetUser;
				if (!targetUser)
					return this.sendReply('User '+this.targetUsername+' not found.');

				if (isNaN(parts[1])) {
					return this.sendReply('Please use a realistic value.');
				}
				var data = fs.readFileSync('config/badges.csv','utf8')
				var match = false;
				var numBadges = 0;
				var stuff = (''+data).split("\n");
				var line = '';

				for (var i = stuff.length; i > -1; i--) {
					if (!stuff[i]) continue;
					var row = stuff[i].split(",");
					var userid = toUserid(row[0]);
					if (targetUser.userid == userid) {
						var x = Number(row[1]);
						var numBadges = x;
						match = true;
						line = line + stuff[i];
						break;
					}
				}

				Users.get(targetUser.userid).badges = numBadges;
				var asdf = parts[1].trim();
				var yay = Number(parts[1]);
				Users.get(targetUser.userid).badges = Users.get(targetUser.userid).badges + yay;

				if (match === true) {
					var re = new RegExp(line,"g");
					fs.readFile('config/badges.csv', 'utf8', function (err,data) {
						if (err) return console.log(err);
						var result = data.replace(re, targetUser.userid+','+Users.get(targetUser.userid).badges);
						fs.writeFile('config/badges.csv', result, 'utf8', function (err) {
							if (err) return console.log(err);
						});
					});
				}
				else {
					var log = fs.createWriteStream('config/badges.csv', {'flags': 'a'});
					log.write("\n"+targetUser.userid+','+Users.get(targetUser.userid).badges);
				}

				return this.sendReply(targetUser + ' was given ' + parts[1] + ' DB badges. ' + targetUser + ' now has ' + Users.get(targetUser.userid).badges + ' badges.');
			}
		}
		else {
			return this.sendReply('No.');
		}
	},

	badgesystem: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			'<b><font size = 3>The Badge System</font></b><br>' +
			'The badge system is in place to keep track of how many badges a user has. ' +
			'It can easily show whether you have the 8 required badges needed to prgress to the E4. ' +
			'At the moment, this system is for the DB League but in the fututre we hope to use it fro the arcade. ' +
				'Any DB Gym Leader can use the /givebadge command to give a user a badge. ' +
			'Users can use /showbadges to view their badges. ' +
			'Gym leaders can also give multiple badges, a way to implement users onto this new database. ' +
			'For instance, if a user has 6 badges, someone can do /givebadge [user], 6 to give them 6 badges. ' +
			'PM Administration with any questions you have about this system and we\'ll attempt to answer them.'
		);
	},


	gymleaders: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			'<b><font size = 3>Introducing DB Server Gym Leaders!</font></b><br>' +
			'<img src ="http://pokestadium.com/pokemon/sprites/trainers/5/blackwhite2/010.gif"><br>' +
				'<b>Leader Flareykinz</b> Gym Leader for OU Monotype!<br>' +
			'<img src ="http://sprites.pokecheck.org/t/032.gif"><br>' +
			'<b>Leader Flafpert</b> Gym Leader for UU!<br>' +
			'<img src ="http://sprites.pokecheck.org/t/116.gif"><br>' +
			'<b>Leader Cakey</b> Gym Leader for OU!<br>' +
			'<img src ="http://cdn.bulbagarden.net/upload/e/e6/Spr_E_Brendan.png"><br>' +
			'<b>Leader Fizz</b> Gym Leader for Ubers!<br>' +
			'<img src ="http://img.pokemondb.net/sprites/trainers/heartgold-soulsilver/will.png"><br>' +
			'<b>Leader Lenub</b> Gym Leader for OU (2)!<br>' +
			'<img src ="http://mob1005.photobucket.com/albums/af180/Twilightwolf4/th_cyrus.gif"><br>' +
			'<b>Leader Demon</b> Gym Leader for VGC Doubles!<br>' +
			'<img src ="http://play.pokemonshowdown.com/sprites/trainers/167.png"><br>' +
			'<b>To be considered</b> This Gym Leader is being considered as we speak!<br>' +
			'<img src ="http://sprites.pokecheck.org/t/115.gif"><br>' +
			'<b>Leader Flame</b> Gym Leader for UU (2)!<br>'
		);
	},

	elite4: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			'<b><font size = 3>Introducing the DB Server Elite 4!</font></b><br>' +
			'<img src ="http://sprites.pokecheck.org/t/127.gif"><br>' +
				'<b>Elite 4 Ravens!</b> OU Elite 4 member!<br>' +
			'<img src ="http://sprites.pokecheck.org/t/137.gif"><br>' +
			'<b>Elite 4 Pokenubz</b> OU Monotype Elite 4 member!<br>' +
			'<img src ="http://sprites.pokecheck.org/t/112.gif"><br>' +
			'<b>Elite 4 Hex</b> Ubers Elite 4 memeber!<br>' +
			'<img src ="http://sprites.pokecheck.org/t/079.gif"><br>' +
			'<b>Elite 4 Blob</b> UU Elite 4 member!<br>'
		);
	},

	champion: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			'<b><font size = 3>Behold, the DB Server Champion!</font></b><br>' +
			'<img src ="http://sprites.pokecheck.org/t/155.gif"><br>' +
			'<b>Champion Mew!</b> Skilled in all aspects of comeptitive battling!<br>'
		);
	},

	picktier: 'tierpick',
	tierpick: function(target, room, user){
		return this.parse('/poll Vote for the next Tournament Tier,randombattle,ou,ubers,uu,ru,nu,lc,cap,cc1v1,oumonotype,1v1,smogondoubles,vgcdoubles');
	},

	 tourcommands: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<b><font size =2>Tournaments can be run by Voice (+) or higher using the commands below:</font></b><br \>' +
		'/tour [tier], [size] - Starts a tournament with a competitor limitation<br \>' +
				'/tour [tier], [x minutes] - Starts a tournament with a sign-up phase timer<br \>' +
		'/endtour - Ends the current tournament<br \>' +
		'/fj [username] - Forces a user to join a tournament<br \>' +
		'/fl [username] - Force a user to leave a tournament<br \>' +
		'/toursize [size] - Changes the size of a currently running tournament<br \>' +
		'/tourtime [number] - Changes the timer of a current tournaments sign-up phase<br \>' +
		'/replace [username], [username] - Replaces user in a tournament with the second user');
	},

	impersonate:'imp',
	imp: function(target, room, user) {
		if (!user.can('declare')) return this.sendReply('/imp - Access denied.');
		if (!this.canTalk()) return;
		if (!target) return this.parse('/help imp');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!target)
			return this.sendReply('You cannot make the user say nothing.');
		if (target.indexOf('/announce') == 0 || target.indexOf('/warn') == 0 || target.indexOf('/data')==0)
			return this.sendReply('You cannot use this to make a user announce/data/warn in imp.');

		room.add('|c|'+targetUser.getIdentity()+'|'+ target);
		this.logModCommand(user.name+' impersonated '+targetUser.name+' and said:' + target);
	},

	afk: function(target, room, user, connection) {
		if (!this.canTalk()) return false;
		if (!this.can('warn')) return false;
		if (!user.isAfk) {
			user.realName = user.name
			var afkName = user.name + ' - afk';
			delete Users.get(afkName);
			user.forceRename(afkName, undefined, true);
			this.send('|html|<b>'+user.realName+'</b> is now Away ('+target+').');
			user.isAfk = true;
			user.blockChallenges = true;
		}
		else {
			return this.sendReply('You are already AFK, type /unafk');
		}
		user.updateIdentity();
	},

	unafk: function(target, room, user, connection) {
		if (!user.isAfk) {
			return this.sendReply('You are not AFK.');
		}
		else {
			if (user.name.slice(-6) !== ' - afk') {
				user.isAfk = false;
				return this.sendReply('You are no longer AFK!');
			}
			var newName = user.realName;
			delete Users.get(newName);
			user.forceRename(newName, undefined, true);
			user.authenticated = true;
			this.send('|html|<b>' + newName + '</b> is back');
			user.isAfk = false;
			user.blockChallenges = false;
		}
		user.updateIdentity();
	},
	
	tournaments: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			'<b><font size = 3>The Tournament Room</font></b><br>' +
			'The tournament room is there so that you can join organised tournaments and win points.<br>' +
			'You can only win points from a tournament in the Tournament Room.<br>' +
			'This prevents Room Voice / Mods / Owners hosting small tournaments to gain points.<br>' +
			'You can start tournaments in other rooms but they <b>won\'t</b> reward points.<br>' +
			'<b>Enjoy!</b>'
		);
	},
	
	scizornician: 'sciz',
	sciz: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><font color="#A80000" size ="3"><b>Scizornician</b></font><br />' +
                  '<center><b>Rank:</b> Administrator<br />' +
                  '<center><b>Role:</b> I am one of the Admins on this server, my role being to develop this server.</font><br />' +
                  '<center><b>Help me out:</b> If you find any bugs just PM me and I\'ll fix it.<br />' +
                  '<center><img src="http://showdown.pokemondb.net:8000/avatars/scizornician.png">');
	},
	
		nindzya: 'ninja',
	ninja: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><font color="#000052" size ="3"><b>Ninja / Nindzya</b></font><br />' +
                  '<center><b>Rank:</b> Administrator<br />' +
                  '<center><b>Role:</b> Oh hey, I\'m kind of running things here! With a few others of course.</font><br />' +
                  '<center><b>Help me out:</b> If you have any concerns, head over to my wall <a href="http://pokemondb.net/pokebase/meta/user/Ninja">here.</a><br />' +
                  '<center><img src="http://showdown.pokemondb.net:8000/avatars/ninja.png">');
	},
	
	d: 'poof',
	cpoof: 'poof',
	poof: (function () {
		var messages = [
			"was sat on by Alpha Draconis!",
			"visited Sciz's lab and was mutated!",
			"used Explosion!",
			"fell into the void.",
			"was KO'd by Mewderator's Play Rough!",
			"angered a Crawdaunt!",
			"was Bullet Punched by Scizornician!",
			"has left the building.",
			"was judged by the Amlighty Pokemaster!",
			"was petrified by Once.",
			"disagreed with Scizbot!",
			"was hit by Magikarp's Revenge!",
			"was sucked into a whirlpool!",
			"was banned because of COPPA!",
			"is phat!",
			"got eaten by a bunch of Igglybuff!",
			"got lost on the internet!",
			"A large Galvantula descended from the sky and picked up {{user}}.",
			"fleed!",
			"got their sausage smoked by Charmanderp!",
			"fell into a worm whole!",
			"took an arrow to the knee... and then one to the face.",
			"peered through the hole on Shedinja's back",
			"saw a creep pasta!",
			"used Final Gambit and missed!",
			"pissed off a the server!",
			"got CobbleWobbled!",
			"was told to leave by Goodragoodragoo!",
			"Scizbot help up it\s red card to {{user}}.",
			"was unfortunate and didn't get a cool message.",
			"Psychic x accidently banned {{user}} from the server!",
			"was given the look by Once!",
			"Aeternis showed {{user}} the door!",
			"was shoved in a Blendtec Blender!",
			"the community voted to skip {{user}}!",
			"was bitten by a rabid Wolfie!",
			"was kicked from server!",
			"recieved capital punishment!"
		];

		return function(target, room, user) {
			if (config.poofOff) return this.sendReply("Poof is currently disabled.");
			if (target && !this.can('broadcast')) return false;
			if (room.id !== 'lobby') return false;
			var message = target || messages[Math.floor(Math.random() * messages.length)];
			if (message.indexOf('{{user}}') < 0)
				message = '{{user}} ' + message;
			message = message.replace(/{{user}}/g, user.name);
			if (!this.canTalk(message)) return false;

			var colour = '#' + [1, 1, 1].map(function () {
				var part = Math.floor(Math.random() * 0xaa);
				return (part < 0x10 ? '0' : '') + part.toString(16);
			}).join('');

			room.addRaw('<center><strong><font color="' + colour + '">~~ ' + sanitize(message) + ' ~~</font></strong></center>');
			user.disconnectAll();
		};
	})(),

	poofoff: 'nopoof',
	nopoof: function() {
		if (!this.can('poofoff')) return false;
		config.poofOff = true;
		return this.sendReply("Poof is now disabled.");
	},

	poofon: function() {
		if (!this.can('poofoff')) return false;
		config.poofOff = false;
		return this.sendReply("Poof is now enabled.");
	},
	
	survey: 'poll',
        poll: function (target, room, user) {
                if (!tour.lowauth(user, room)) return this.sendReply('You do not have enough authority to use this command.');
                if (!tour[room.id]) tour.reset(room.id);
                if (tour[room.id].question) return this.sendReply('There is currently a poll going on already.');
                var separacion = "&nbsp;&nbsp;";
                var answers = tour.splint(target);
                if (answers.length < 3) return this.sendReply('Correct syntax for this command is /poll question, option, option...');
                var question = answers[0];
                answers.splice(0, 1);
                var answers = answers.join(',').toLowerCase().split(',');
                tour[room.id].question = question;
                tour[room.id].answerList = answers;
                room.addRaw('<div class="infobox"><h2>' + tour[room.id].question + separacion + '<font size=2 color = "#939393"><small>/vote OPTION<br /><i><font size=1>Poll started by '+user.name+'</font size></i></small></font></h2><hr />' + separacion + separacion + " &bull; " + tour[room.id].answerList.join(' &bull; ') + '</div>');
        },

        vote: function(target, room, user) {
                var ips = JSON.stringify(user.ips);
                if (!tour[room.id].question) return this.sendReply('There is no poll currently going on in this room.');
                if (tour[room.id].answerList.indexOf(target.toLowerCase()) == -1) return this.sendReply('\'' + target + '\' is not an option for the current poll.');
                tour[room.id].answers[ips] = target.toLowerCase();
                return this.sendReply('You are now voting for ' + target + '.');
        },

        votes: function(target, room, user) {
                if (!this.canBroadcast()) return;
                this.sendReply('NUMBER OF VOTES: ' + Object.keys(tour[room.id].answers).length);
        },

        endsurvey: 'endpoll',
        ep: 'endpoll',
        endpoll: function (target, room, user) {
                if (!tour.lowauth(user, room)) return this.sendReply('You do not have enough authority to use this command.');
                if (!tour[room.id] || !tour[room.id].question) return this.sendReply('There is no poll to end in this room.');
                var votes = Object.keys(tour[room.id].answers).length;
                if (votes == 0) return room.addRaw("<h3>The poll was canceled because of lack of voters.</h3>");
                var options = new Object();
                var obj = tour[room.id];
                for (var i in obj.answerList) options[obj.answerList[i]] = 0;
                for (var i in obj.answers) options[obj.answers[i]]++;
                var sortable = new Array();
                for (var i in options) sortable.push([i, options[i]]);
                sortable.sort(function (a, b) {
                        return a[1] - b[1]
                });
                var html = "";
                for (var i = sortable.length - 1; i > -1; i--) {
                        console.log(i);
                        var option = sortable[i][0];
                        var value = sortable[i][1];
                        html += "&bull; " + option + " - " + Math.floor(value / votes * 100) + "% (" + value + ")<br />";
                }
                room.addRaw('<div class="infobox"><h2>Results to "' + obj.question + '"<br /><i><font size=1>Poll ended by '+user.name+'</font size></i></h2><hr />' + html + '</div>');
                tour[room.id].question = undefined;
                tour[room.id].answerList = new Array();
                tour[room.id].answers = new Object();
        },

        pollremind: 'pr',
        pr: function(target, room, user) {
                var separacion = "&nbsp;&nbsp;";
                if (!tour[room.id].question) return this.sendReply('There is currently no poll going on.');
                if (!this.canBroadcast()) return;
                this.sendReply('|raw|<div class="infobox"><h2>' + tour[room.id].question + separacion + '<font class="closebutton" size=1><small>/vote OPTION</small></font></h2><hr />' + separacion + separacion + " &bull; " + tour[room.id].answerList.join(' &bull; ') + '</div>');
        },
        
        useravy: function(target, room, user) {
		if (!this.canBroadcast()) return;
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReplyBox('The user '+this.targetUsername+' is not online.');
		}
		return this.sendReplyBox('<hr><center><img src="http://play.pokemonshowdown.com/sprites/trainers/'+targetUser.avatar+'.png"></center><hr>');
	},
        
	image: function(target, room, user) {
		if (!target) return this.parse('/help image');
		if (!this.can('declare', null, room)) return false;

		if (!this.canTalk()) return;

		targets = target.split(', ');
		if (targets.length != 3) {
			return this.parse('/help image');
		}

		this.add('|raw|'+sanitize(user.name)+' shows:<br /><img src="'+sanitize(targets[0])+'" alt="" width="'+toId(targets[1])+'" height="'+toId(targets[2])+'" />');
	},
     

      /***************************************
	* Trainer Cards                        *
	***************************************/

	freddycakes: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://24.media.tumblr.com/tumblr_mb1gpbUJJ61qaven0o1_500.gif" weight="150" height="200">' +
'<b> </b> <br />' + 
'<b>Name:</b> Freddycakes<br />' +
'<b>Ace:</b> Meloetta<br />' +
'<b>Location:</b> America<br />' +
'<b>Age:</b> 14<br />' +
'<b>Gender:</b> Female<br />' +
'<b>Rank:</b> Server Owner<br />' +
'<b>Coolness Points</b> 10000<br />' +
'<b>Coolness:</b> 10<br />' );
                
    	},
     shadow: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://yggdrasilleague.weebly.com/uploads/2/2/8/2/22825324/1399793512.png" weight="150" height="100">' +
                '<b> </b> <br />' + 
                '<b>Name:</b> Elite F?ur Shadow<br />' +
                '<b>Ace:</b> Mega Charizard-X<br />' +
                '<b>Location:</b> America<br />' +
                '<b>Age:</b> 17<br />' +
                '<b>Gender:</b> Male<br />' +
                '<b>Rank:</b> Admin<br />' +
                '<b>Coolness:</b> 9.9<br />' );
                
    	},
     ntgm: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://play.pokemonshowdown.com/sprites/trainers/209.png" weight="150" height="100">' +
                '<b> </b> <br />' + 
                '<b>Name:</b> NewTetrisGuy_MP<br />' +
                '<b>Favorite Pokemon:</b> Terrakion<br />' +
                '<b>Location:</b> Morocco<br />' +
                '<b>Age:</b> 15<br />' +
                '<b>Gender:</b> Male<br />' +
                '<b>Rank:</b> Regular User Bum<br />' +
                '<b>Coolness:</b> 8.9<br />' );
                
    	},
      latioss: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://media.giphy.com/media/6T5tfHNXRqCze/giphy.gif">' +
                '<b> </b> <br />' + 
                '<b>Name:</b> Latioss<br />' +
                '<b>Ace:</b> Celebi<br />' +
                '<b>Location:</b> Philippines<br />' +
                '<b>Age:</b> 13<br />' +
                '<b>Gender:</b> Male<br />' +
                '<b>Rank:</b> Admin<br />' +
                '<b>Coolness:</b> 9.9<br />' );

    	},
      pcf: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://play.pokemonshowdown.com/sprites/trainers/170.png">' +
                '<b> </b> <br />' + 
                '<b>Name:</b> PotatoChargeFTW<br />' +
                '<b>Ace:</b> Articuno<br />' +
                '<b>Location:</b> Singapore<br />' +
                '<b>Age:</b> 13<br />' +
                '<b>Gender:</b> Male<br />' +
                '<b>Rank:</b> Admin<br />' +
                '<b>Coolness:</b> 9.5<br />' );
                
    	},
     sandchez: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTkj_Al6NwOBEYiw7JvrqjD0j-hd4AgWjk6_I0EgErEuz-FU03wqA">' +
                '<b> </b> <br />' + 
                '<b>Name:</b>Sandchez<br />' +
                '<b>Ace:</b> Charizard Mega-X<br />' +
                '<b>Location:</b> America<br />' +
                '<b>Age:</b> 15<br />' +
                '<b>Gender:</b> Male<br />' +
                '<b>Rank:</b> Regular User Bum<br />' +
                '<b>Coolness:</b> 7.5<br />' );
                
    	},
       llllex123: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://media.giphy.com/media/r98lRazY6EdXy/giphy.gif">' +
                '<b> </b> <br />' + 
                '<b>Name:</b>llllex123<br />' +
                '<b>Ace:</b> Charizard Mega-Y<br />' +
                '<b>Location:</b> New Zealand<br />' +
                '<b>Age:</b> 13<br />' +
                '<b>Gender:</b> Male<br />' +
                '<b>Rank:</b> Server owner<br />' +
                '<b>Coolness:</b> 10<br />' );
                
    	}, iyan: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://localhost:8000/avatars/greninja.png" weight="100" height="150">' +
                '<b> </b> <br />' + 
                '<b>Name:</b>Iyan Maker<br />' +
                '<b>Ace:</b> Greninja<br />' +
                '<b>Location:</b> United Kingdom<br />' +
                '<b>Age:</b> 13<br />' +
                '<b>Gender:</b> Female<br />' +
                '<b>Rank:</b> Moderator<br />' +
                '<b>Coolness:</b> 8.8<br />' );
                
      },
        talon: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://media.pldh.net/pokemon/gen5/blackwhite_animated_front/398.gif">' +
                '<b> </b> <br />' + 
                '<b>Name:</b>TalonUsesBraveBird<br />' +
                '<b>Ace:</b> Staraptor<br />' +
                '<b>Location:</b> Alberta<br />' +
                '<b>Age:</b> Not born Yet<br />' +
                '<b>Gender:</b> Male<br />' +
                '<b>Rank:</b> Moderator<br />' +
                '<b>Coolness:</b> 8.9.6<br />' );
                
      },
        marp: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://play.pokemonshowdown.com/sprites/trainers/2.png">' +
                '<b> </b> <br />' + 
                '<b>Name:</b>Marpilicous<br />' +
                '<b>Ace:</b> Ninetales<br />' +
                '<b>Location:</b> America<br />' +
                '<b>Age:</b> Not born Yet<br />' +
                '<b>Gender:</b> Female<br />' +
                '<b>Rank:</b> Driver<br />' +
                '<b>Coolness:</b>9.7<br />' );
                
      }, 
        swampert: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://play.pokemonshowdown.com/sprites/trainers/169.png">' +
                '<b> </b> <br />' + 
                '<b>Name:</b>Sir-Swampert<br />' +
                '<b>Ace:</b> Swampert<br />' +
                '<b>Location:</b> America<br />' +
                '<b>Age:</b> 14<br />' +
                '<b>Gender:</b> Male<br />' +
                '<b>Rank:</b> Voice<br />' +
                '<b>Coolness:</b>7.8<br />' );
                
      },
       snoop: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://img3.wikia.nocookie.net/__cb20120417225012/yuyuhakusho/images/7/74/Yusuke%27s_Spirit_Gun_op3.gif">' +
                '<b>Name:</b>Snoop Pingus<br />' +
                '<b>Ace:</b>Azumaill <br />' +
                '<b>Location:</b> Planet Namek<br />' +
                '<b>Age:</b> 15<br />' +
                '<b>Gender:</b> Male<br />' +
                '<b>Rank:</b> Modergator<br />' +
                '<b>Coolness:</b>7.2<br />' );
                
      },
        
       edjim: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://play.pokemonshowdown.com/sprites/trainers/274.png">' +
                '<b>Name:</b>Edjim<br />' +
                '<b>Ace:</b>Mega Gengar <br />' +
                '<b>Location:</b> America<br />' +
                '<b>Age:</b> 14<br />' +
                '<b>Gender:</b> Male<br />' +
                '<b>Rank:</b> Driver<br />' +
                '<b>Coolness:</b>7.6<br />' );
                
      },
        suicune: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://pokemonshowdown.com/interstice?uri=http%3A%2F%2Fpldh.net%2Fmedia%2Fdreamworld%2F245.png">' +
                '<b>Name:</b>StormingSuicune<br />' +
                '<b>Ace:</b>Suicune <br />' +
                '<b>Location:</b> johto<br />' +
                '<b>Age:</b> 16<br />' +
                '<b>Gender:</b> Male<br />' +
                '<b>Rank:</b> Driver<br />' +
                '<b>Coolness:</b>7.7<br />' );
                
      },
        hinata: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://pokemonshowdown.com/interstice?uri=http%3A%2F%2F24.media.tumblr.com%2F0c090b8532f8ad7309857e38b31323b7%2Ftumblr_mw6pmzYud61rd5xl7o1_500.gif">' +
                '<b> </b> <br />' +
                '<b>Name:</b>Hinata Kun<br />' +
                '<b>Ace:</b>Missingno <br />' +
                '<b>Location:</b> New York<br />' +
                '<b>Age:</b>Not born yet<br />' +
                '<b>Gender:</b> Female<br />' +
                '<b>Rank:</b> Driver<br />' +
                '<b>Coolness:</b>8.9<br />' );
                
      },
        poison: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://localhost:8000/avatars/crobat.gif">' +
                '<b>Name:</b>ThePoisonMirage<br />' +
                '<b>Ace:</b>Crobat <br />' +
                '<b>Location:</b> Tennesee<br />' +
                '<b>Age:</b>13<br />' +
                '<b>Gender:</b> Male<br />' +
                '<b>Rank:</b> Admin/part server owner<br />' +
                '<b>Coolness:</b>9.9<br />' );
                
      },andoconda: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://localhost:8000/avatars/crobat.gif">' +
                '<b>Name:</b>Andoconda<br />' +
                '<b>Ace:</b>Noivern <br />' +
                '<b>Location:</b> America<br />' +
                '<b>Age:</b>13<br />' +
                '<b>Gender:</b> Male<br />' +
                '<b>Rank:</b> Regular user bum<br />' +
                '<b>Coolness:</b>6.5<br />' );
                
      },sir: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://play.pokemonshowdown.com/sprites/trainers/278.png">' +
                '<b>Name:</b>SirVictini<br />' +
                '<b>Ace:</b>Mega Ampharos<br />' +
                '<b>Location:</b> Caicos Islands<br />' +
                '<b>Age:</b>13<br />' +
                '<b>Gender:</b> Male<br />' +
                '<b>Rank:</b> Driver<br />' +
                '<b>Coolness:</b>7.9<br />' );
                
      },chaos: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://play.pokemonshowdown.com/sprites/trainers/274.png">' +
                '<b>Name:</b>GymLeadr ChaosG<br />' +
                '<b>Ace:</b>Honchkrow <br />' +
                '<b>Location:</b> Dominican Republic<br />' +
                '<b>Age:</b>20br />' +
                '<b>Gender:</b> Male<br />' +
                '<b>Rank:</b> Voice<br />' +
                '<b>Coolness:</b>9.8<br />' );
                
      },magnus: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://play.pokemonshowdown.com/sprites/trainers/163.png">' +
                '<b>Name:</b>Magnus42<br />' +
                '<b>Ace:</b> ferrothorn<br />' +
                '<b>Location:</b> America<br />' +
                '<b>Age:</b>14<br />' +
                '<b>Gender:</b> Male<br />' +
                '<b>Rank:</b> Voice<br />' +
                '<b>Coolness:</b>7.8<br />' );
                
      },


};

	
