/**
 * System commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are system commands - commands required for Pokemon Showdown
 * to run. A lot of these are sent by the client.
 *
 * If you'd like to modify commands, please go to config/commands.js,
 * which also teaches you how to use commands.
 *
 * @license MIT license
 */

var crypto = require('crypto');
var fs = require('fs');

//shop
var inShop = ['symbol', 'custom', 'animated', 'room', 'trainer', 'fix', 'declare'];
var closeShop = false;
var closedShop = 0;

const MAX_REASON_LENGTH = 300;

var commands = exports.commands = {

	version: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox("Server version: <b>" + CommandParser.package.version + "</b>");
	},
	
	//roulette
	roulette: 'roul',
	startroulette: 'roul',
	roul: function (target, room, user) {

		if (!user.can('receivemutedpms')) {
			return this.sendReply('Access Denied');
		}
		if (!room.rouletteon == false) {
			return this.sendReply('the roullet script is currently in use.');
		} else {
			room.rouletteon = true;
			room.roulusers = [];
			var part1 = '<h3><font size="2"><font color="green">A roulette has been started by</font><font size="2"><font color="black"> ' + user.name + '</font></h3><br />';
			var part2 = 'To play do /bet then one of the following colors: red, yellow, green , black , orange<br />';
			var part3 = 'black = 1000 BP<br />yellow & red = 100 BP<br /> green & orange = 300 BP';
			room.addRaw(part1 + part2 + part3);
		}
	},

	bet: function (target, room, user) {

		if (!room.rouletteon) return this.sendReply('There is no roulette game running in this room.');
		var colors = ['red', 'yellow', 'green', 'black', 'orange'];
		targets = target.split(',');
		target = toId(targets[0]);
		if (colors.indexOf(target) === -1) return this.sendReply(target + ' is not a valid color.');
		if (targets[1]) {
			var times = parseInt(toId(targets[1]));
			if (!isNaN(times) && times > 0) {
				if (user.tickets < times) return this.sendReply('You do not have enough tickets!')
				user.bets += times;
				user.tickets -= times;
				user.bet = target;
			} else {
				return this.sendReply('That is an invalid amount of bets!');
			}
		} else {
			if (user.tickets < 1) return this.sendReply('You do not have a ticket!');
			user.bets++;
			user.tickets--;
			user.bet = target;
		}
		if (room.roulusers.indexOf(user.userid) === -1) room.roulusers.push(user.userid);
		return this.sendReply('You are currently betting ' + user.bets + ' times to ' + target);

	},
	
	//break

			profile: 'pr',
pr: function(target, room, user, connection) {
if (!this.canBroadcast()) return;
var aMatch = false;
        var fc = 'N/A';
        var total = '';
 var data = fs.readFileSync('config/fc.csv','utf8')
                target = this.splitTarget(target);
                var targetUser = this.targetUser;
                if (!targetUser) {
                        return this.sendReply('User '+this.targetUsername+' not found');
                }
                var fc = 'N/A';
                var row = (''+data).split("\n");
                for (var i = row.length; i > -1; i--) {
                        if (!row[i]) continue;
                        var parts = row[i].split(",");
                        var userid = toUserid(parts[0]);
                        if (targetUser.userid == userid || target == userid) {
                        var x = Number(parts[1]);
                        var fc = x;
						if (fc == 'NaN') {
						fc = 'N/A';
						}
                        aMatch = true;
                        if (aMatch === true) {
                                break;
                        }
                        }
                }
                if (aMatch === true) {
						 var s = fc;
						 fc = String(fc).substring(0,4)+'-'+String(fc).substring(4,8)+'-'+String(fc).substring(8,12);
						if (s == 0) {
					    fc = 'N/A';
						}
			    if (aMatch === false) {
				fc = 'N/A';
				}
				}
				
				var bMatch = false;
        var gender = 'Hidden';
        var total = '';
 var data = fs.readFileSync('config/gender.csv','utf8')
                var gender = 'Hidden';
                var row = (''+data).split("\n");
                for (var i = row.length; i > -1; i--) {
                        if (!row[i]) continue;
                        var parts = row[i].split(",");
                        var userid = toUserid(parts[0]);
                        if (targetUser.userid == userid || target == userid) {
                        var x = Number(parts[1]);
                        var gender = x;
                        bMatch = true;
                        if (bMatch === true) {
                                break;
                        }
                        }
                }
				if (bMatch === true) {
				var g = gender;
						 if (x == 1) {
						 g = 'Male';
						 }
						 if (x == 2) {
						 g = 'Female';
						 }
						 if (!x) {
						 g = 'Hidden';
						 }
			}
			if (bMatch === false) {
			g = 'Hidden';
			}
		var cMatch = false;
        var location = 'Hidden';
        var total = '';
 var data = fs.readFileSync('config/location.csv','utf8')
                var location = 'Hidden';
                var row = (''+data).split("\n");
                for (var i = row.length; i > -1; i--) {
                        if (!row[i]) continue;
                        var parts = row[i].split(",");
                        var userid = toUserid(parts[0]);
                        if (targetUser.userid == userid || target == userid) {
                        var x = parts[1];
                        var location = x;
                        cMatch = true;
                        if (cMatch === true) {
                                break;
                        }
                        }
                }
                
				if (cMatch === true) {
						 var l = location;
						 }
						 if (cMatch === false) {
						 l = 'Hidden';
						 }
						 
        var mMatch = false;
        var money = 0;
        
        var total = '';
        if (!target) {
        var data = fs.readFileSync('config/cash.csv','utf8')
                var row = (''+data).split("\n");
                for (var i = row.length; i > -1; i--) {
                        if (!row[i]) continue;
                        var parts = row[i].split(",");
                        var userid = toUserid(parts[0]);
                        if (targetUser.userid == userid) {
                        var x = Number(parts[1]);
                        var money = x;
                        mMatch = true;
                        if (mMatch === true) {
                                break;
                        }
                        }
                }
				if (mMatch === false) {
			 var money = 0;
						} 
						}
								var dMatch = false;
        var fav = 'Unknown';
        var total = '';
 var data = fs.readFileSync('config/favpokes.csv','utf8')
                var fav = 'Unknown';
                var row = (''+data).split("\n");
                for (var i = row.length; i > -1; i--) {
                        if (!row[i]) continue;
                        var parts = row[i].split(",");
                        var userid = toUserid(parts[0]);
                        if (targetUser.userid == userid || target == userid) {
                        var x = parts[1];
                        var fav = x;
                        dMatch = true;
                        if (dMatch === true) {
                                break;
                        }
                        }
                }
			if (dMatch === false) {
			f = 'Unknown';
			
			}
			var avy = 'play.pokemonshowdown.com/sprites/trainers/'+targetUser.avatar+'.png'
if (targetUser.avatar.length >= 3) {
var avy = 'thearchonleague.no-ip.org:8000/avatars/'+targetUser.avatar+''
}

                target = target.replace(/\s+/g, '');
                var util = require("util"),
           http = require("http");

                var options = {
                    host: "www.pokemonshowdown.com",
                    port: 80,
                    path: "/forum/~"+target
                };

                var content = "";   
                var self = this;
                var req = http.request(options, function(res) {
                        
                    res.setEncoding("utf8");
                    res.on("data", function (chunk) {
                content += chunk;
                    });
                    res.on("end", function () {
                        content = content.split("<em");
                        if (content[1]) {
                                content = content[1].split("</p>");
                                if (content[0]) {
                                        content = content[0].split("</em>");
                                        if (content[1]) {
                                               self.sendReplyBox('<font size = 2><center><b><u>'+targetUser.name+'\'s Profile</u></font></b></center>' +
						'<hr>' +
'<img src="//'+avy+'" alt="" width="80" height="80" align="left"><br />' +
'<b>Money</b>: '+money+'<br />'+
'<b>Registered:</b> '+content[1]+'<br />'+
                       '<b>Gender</b>: '+g+'<br />' +
					   '<b>Location</b>: '+l+'<br />' +
					   '<b>Favorite Pokemon</b>: '+fav+'<br />'+
					   '<b>X/Y Friend Code</b>: '+fc);
                                        }
                                }
                        }
                   else {
				   self.sendReplyBox('<font size = 2><center><b><u>'+targetUser.name+'\'s Profile</u></font></b></center>' +
						'<hr>' +
'<img src="//'+avy+'" alt="" width="80" height="80" align="left"><br />' +
'<b>Money</b>: '+money+'<br />'+
'<b>Registered:</b> Unregistered<br />'+
                       '<b>Gender</b>: '+g+'<br />' +
					   '<b>Location</b>: '+l+'<br />' +
					   '<b>Favorite Pokemon</b>: '+fav+'<br />'+
					   '<b>X/Y Friend Code</b>: '+fc);
						}
                        room.update();
                    });
                });
                req.end();
        },				
		
	
	permaban: function(target, room, user) {
		if (!target)
			return this.parse('/help permaban');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser)
			return this.sendReply('User '+this.targetUsername+' not found.');
		if (!this.can('permaban', targetUser))
			return false;
		if (Users.checkBanned(targetUser.latestIp) && !target && !targetUser.connected) {
			var problem = ' but was already banned';
			return this.privateModCommand('('+targetUser.name+' would be banned by '+user.name+problem+'.)');
		}

		targetUser.popup(user.name+" has permanently banned you.");
		this.addModCommand(targetUser.name+" was permanently banned by "+user.name+".");
		targetUser.ban();
		fs.writeFile('logs/ipbans.txt',+'\n'+targetUser.latestIp);
	},

	spin: function (target, room, user) {

		if (!user.can('receivemutedpms')) return this.sendReply('You are not authorized to do that.');
		if (!room.rouletteon) return this.sendReply('There is no roulette game currently.');
		if (room.roulusers.length === 0) return this.sendReply('Nobody has made bets in this game');
		var landon = Math.random();
		var color = '';
		var winners = [];
		var totalwin = [];

		if (landon < 0.3) {
			color = 'red';
		} else if (landon < 0.6) {
			color = 'yellow';
		} else if (landon < 0.75) {
			color = 'green';
		} else if (landon < 0.85) {
			color = 'black';
		} else {
			color = 'orange';
		}

		for (var i = 0; i < room.roulusers.length; i++) {
			var loopuser = Users.get(room.roulusers[i]);
			var loopchoice = '';
			if (loopuser) {
				loopchoice = loopuser.bet;
				if (loopchoice === color) winners.push(loopuser.userid);
			} else {
				continue;
			}
		}

		if (winners === []) {
			for (var i = 0; i < room.roulusers.length; i++) {
				var loopuser = Users.get(room.roulusers[i]);
				if (loopuser) {
					loopuser.bet = null;
					loopuser.bets = 0;
				}
			}
			return room.addRaw('Bad Luck. Nobody won this time');
		}

		var perbetwin = 0;

		switch (color) {
		case "red":
			perbetwin = 100;
			break;
		case "yellow":
			perbetwin = 100;
			break;
		case "green":
			perbetwin = 300;
			break;
		case "black":
			perbetwin = 1000;
			break;
		default:
			perbetwin = 300;
		}

		for (var i = 0; i < winners.length; i++) {
			loopwinner = Users.get(winners[i]);
			totalwin[i] = perbetwin * loopwinner.bets;
			loopwinner.moneh += totalwin[i];
			loopwinner.prewritemoney();
		}
		if (winners.length) Users.exportUserwealth();

		for (var i = 0; i < room.roulusers.length; i++) {
			var loopuser = Users.get(room.roulusers[i]);
			if (loopuser) {
				loopuser.bet = null;
				loopuser.bets = 0;
			}
		}
		if (winners.length === 1) {
			room.addRaw('The roulette landed on ' + color + '. The only winner was ' + winners[0] + ', who won the sum of ' + totalwin[0] + ' Points.');
		} else if (winners.length) {
			room.addRaw('The roulette landed on ' + color + '. Winners: ' + winners.toString() + '. They won, respectively, ' + totalwin.toString() + '  Points.');
		} else {
			room.addRaw('The roulette landed on ' + color + '. Nobody won this time.');
		}
		room.rouletteon = false;
	},
  tpolltest: 'poll',
	poll: 'poll',
	poll: function(room, user, cmd){
                return this.parse('/poll Next <font color="#FF4105">Tournament</font> Tier: <br><font size="1">To vote do /vote option OR click the tier you want.</font><br><center><button name="send" value="/vote other" target="_blank" title="Vote other">other</button> <button name="send" value="/vote rubeta" target="_blank" title="Vote RU Beta">rubeta</button> <button name="send" value="/vote randomdoubles" target="_blank" title="Vote Random Doubles">randomdoubles</button> <button name="send" value="/vote custom" target="_blank" title="Vote Custom">custom</button> <button name="send" value="/vote reg1v1" target="_blank" title="Vote Regular 1v1">reg1v1</button> <button name="send" value="/vote lc" target="_blank" title="Vote LC">lc</button> <button name="send" value="/vote nu" target="_blank" title="Vote NU">nu</button> <button name="send" value="/vote cap" target="_blank" title="Vote CAP">cap</button> <button name="send" value="/vote cc" target="_blank" title="Vote CC">cc</button> <button name="send" value="/vote oumono" target="_blank" title="Vote OU Monotype">oumono</button> <button name="send" value="/vote doubles" target="_blank" title="Vote Doubles">doubles</button> <button name="send" value="/vote balhackmons" target="_blank" title="Vote Balanced Hackmons">balhackmons</button> <button name="send" value="/vote hackmons" target="_blank" title="Vote Hackmons">hackmons</button> <button name="send" value="/vote ubers" target="_blank" title="Vote Ubers">ubers</button> <button name="send" value="/vote randombat" target="_blank" title="Vote Random Battle">randombat</button> <button name="send" value="/vote ou" target="_blank" title="Vote OU">ou</button> <button name="send" value="/vote cc1v1" target="_blank" title="Vote CC1v1">cc1v1</button>  <button name="send" value="/vote uu" target="_blank" title="Vote UU">uu</button></center>, other, Speedmons, randomdoubles, custom, reg1v1, lc, nu, cap, cc, oumono, doubles, balhackmons,C&E, ubers, randombat 1v1, ou, cc1v1, uu');
	},
	hv: 'helpvotes',
	helpvotes: function(room, user, cmd){
                return this.parse('/wall Remember to **vote** even if you don\'t want to battle; that way you\'re still voting for what tier battles you want to watch!');	
	},
	hc: function(room, user, cmd){
                return this.parse('/hotpatch chat');
	},
	def: function(target, room, user){
	 if(!target) return this.sendReply('/def [word] - Will bring you to a search to define the targeted word.');
                return this.parse('[[define '+target+']]');
	},
	cc1v1: function(room, user, cmd){
                return this.parse('/tour challengecup1vs1, 4minutes');	
	},
	
	        /*********************************************************
         * Coins                                     
         *********************************************************/

        givecoins: function(target, room, user) {
                if(!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');
                if(!target) return this.parse('/help givecoins');
                if (target.indexOf(',') != -1) {
                        var parts = target.split(',');
                        parts[0] = this.splitTarget(parts[0]);
                        var targetUser = this.targetUser;
                if (!targetUser) {
                        return this.sendReply('User '+this.targetUsername+' not found.');
                }
                if (isNaN(parts[1])) {
                        return this.sendReply('Very funny, now use a real number.');
                }
                var cleanedUp = parts[1].trim();
                var giveCoins = Number(cleanedUp);
                var data = fs.readFileSync('config/coins.csv','utf8')
                var match = false;
                var coins = 0;
                var line = '';
                var row = (''+data).split("\n");
                for (var i = row.length; i > -1; i--) {
                        if (!row[i]) continue;
                        var parts = row[i].split(",");
                        var userid = toUserid(parts[0]);
                        if (targetUser.userid == userid) {
                        var x = Number(parts[1]);
                        var coins = x;
                        match = true;
                        if (match === true) {
                                line = line + row[i];
                                break;
                        }
                        }
                }
                targetUser.coins = coins;
                targetUser.coins += giveCoins;
                if (match === true) {
                        var re = new RegExp(line,"g");
                        fs.readFile('config/coins.csv', 'utf8', function (err,data) {
                        if (err) {
                                return console.log(err);
                        }
                        var result = data.replace(re, targetUser.userid+','+targetUser.coins);
                        fs.writeFile('config/coins.csv', result, 'utf8', function (err) {
                                if (err) return console.log(err);
                        });
                        });
                } else {
                        var log = fs.createWriteStream('config/coins.csv', {'flags': 'a'});
                        log.write("\n"+targetUser.userid+','+targetUser.coins);
                }
                var p = 'coins';
                if (giveCoins < 2) p = 'coin';
                this.sendReply(targetUser.name + ' was given ' + giveCoins + ' ' + p + '. This user now has ' + targetUser.coins + ' coins.');
                targetUser.send(user.name + ' has given you ' + giveCoins + ' ' + p + '.');
                } else {
                        return this.parse('/help givecoins');
                }
        },

        takecoins: function(target, room, user) {
                if(!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');
                if(!target) return this.parse('/help takecoins');
                if (target.indexOf(',') != -1) {
                        var parts = target.split(',');
                        parts[0] = this.splitTarget(parts[0]);
                        var targetUser = this.targetUser;
                if (!targetUser) {
                        return this.sendReply('User '+this.targetUsername+' not found.');
                }
                if (isNaN(parts[1])) {
                        return this.sendReply('Very funny, now use a real number.');
                }
                var cleanedUp = parts[1].trim();
                var takeCoins = Number(cleanedUp);
                var data = fs.readFileSync('config/coins.csv','utf8')
                var match = false;
                var coins = 0;
                var line = '';
                var row = (''+data).split("\n");
                for (var i = row.length; i > -1; i--) {
                        if (!row[i]) continue;
                        var parts = row[i].split(",");
                        var userid = toUserid(parts[0]);
                        if (targetUser.userid == userid) {
                        var x = Number(parts[1]);
                        var coins = x;
                        match = true;
                        if (match === true) {
                                line = line + row[i];
                                break;
                        }
                        }
                }
                targetUser.coins = coins;
                targetUser.coins -= takeCoins;
                if (match === true) {
                        var re = new RegExp(line,"g");
                        fs.readFile('config/coins.csv', 'utf8', function (err,data) {
                        if (err) {
                                return console.log(err);
                        }
                        var result = data.replace(re, targetUser.userid+','+targetUser.coins);
                        fs.writeFile('config/coins.csv', result, 'utf8', function (err) {
                                if (err) return console.log(err);
                        });
                        });
                } else {
                        var log = fs.createWriteStream('config/coins.csv', {'flags': 'a'});
                        log.write("\n"+targetUser.userid+','+targetUser.coins);
                }
                var p = 'coins';
                if (giveCoins < 2) p = 'coin';
                this.sendReply(targetUser.name + ' was had ' + takeCoins + ' ' + p + ' removed. This user now has ' + targetUser.coins + ' coins.');
                targetUser.send(user.name + ' has given you ' + takeCoins + ' ' + p + '.');
                } else {
                        return this.parse('/help takecoins');
                }
        },
        
        createpoints: function(target, room, user, connection) {
                if(!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');
                fs.exists('config/money.csv', function (exists) {
                        if(exists){
                                return connection.sendTo(room, 'Since this file already exists, you cannot do this.');
                        } else {
                                fs.writeFile('config/money.csv', 'scizornician,ninjastaz7,pokemasterdb', function (err) {
                                        if (err) throw err;
                                        console.log('config/money.csv created.');
                                        connection.sendTo(room, 'config/money.csv created.');
                                });
                        }
                });
        },
        
        pmall: function(target, room, user) {
                if (!target) return this.parse('/pmall [message] - Sends a PM to every user in a room.');
                if (!this.can('pmall', null, room)) return false;

                var pmName = 'SS PM';

                for (var i in Users.users) {
                        var message = '|pm|'+pmName+'|'+Users.users[i].getIdentity()+'|'+target;
                        Users.users[i].send(message);
                }
        },
			 

	me: function (target, room, user, connection) {
		// By default, /me allows a blank message
		if (target) target = this.canTalk(target);
		if (!target) return;

		return '/me ' + target;
	},

	mee: function (target, room, user, connection) {
		// By default, /mee allows a blank message
		if (target) target = this.canTalk(target);
		if (!target) return;

		return '/mee ' + target;
	},

	avatar: function (target, room, user) {
		if (!target) return this.parse('/avatars');
		var parts = target.split(',');
		var avatar = parseInt(parts[0]);
		if (!avatar || avatar > 294 || avatar < 1) {
			if (!parts[1]) {
				this.sendReply("Invalid avatar.");
			}
			return false;
		}

		user.avatar = avatar;
		if (!parts[1]) {
			this.sendReply("Avatar changed to:\n" +
				'|raw|<img src="//play.pokemonshowdown.com/sprites/trainers/' + avatar + '.png" alt="" width="80" height="80" />');
		}
	},

	logout: function (target, room, user) {
		user.resetName();
	},

	r: 'reply',
	reply: function (target, room, user) {
		if (!target) return this.parse('/help reply');
		if (!user.lastPM) {
			return this.sendReply("No one has PMed you yet.");
		}
		return this.parse('/msg ' + (user.lastPM || '') + ', ' + target);
	},

	pm: 'msg',
	whisper: 'msg',
	w: 'msg',
	msg: function (target, room, user) {
		if (!target) return this.parse('/help msg');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!target) {
			this.sendReply("You forgot the comma.");
			return this.parse('/help msg');
		}
		if (!targetUser || !targetUser.connected) {
			if (targetUser && !targetUser.connected) {
				this.popupReply("User " + this.targetUsername + " is offline.");
			} else if (!target) {
				this.popupReply("User " + this.targetUsername + " not found. Did you forget a comma?");
			} else {
				this.popupReply("User "  + this.targetUsername + " not found. Did you misspell their name?");
			}
			return this.parse('/help msg');
		}

		if (Config.pmmodchat) {
			var userGroup = user.group;
			if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(Config.pmmodchat)) {
				var groupName = Config.groups[Config.pmmodchat].name || Config.pmmodchat;
				this.popupReply("Because moderated chat is set, you must be of rank " + groupName + " or higher to PM users.");
				return false;
			}
		}

		if (user.locked && !targetUser.can('lock', user)) {
			return this.popupReply("You can only private message members of the moderation team (users marked by %, @, &, or ~) when locked.");
		}
		if (targetUser.locked && !user.can('lock', targetUser)) {
			return this.popupReply("This user is locked and cannot PM.");
		}
		if (targetUser.ignorePMs && !user.can('lock')) {
			if (!targetUser.can('lock')) {
				return this.popupReply("This user is blocking Private Messages right now.");
			} else if (targetUser.can('hotpatch')) {
				return this.popupReply("This admin is too busy to answer Private Messages right now. Please contact a different staff member.");
			}
		}

		target = this.canTalk(target, null);
		if (!target) return false;

		var message = '|pm|' + user.getIdentity() + '|' + targetUser.getIdentity() + '|' + target;
		user.send(message);
		if (targetUser !== user) targetUser.send(message);
		targetUser.lastPM = user.userid;
		user.lastPM = targetUser.userid;
	},

	blockpm: 'ignorepms',
	blockpms: 'ignorepms',
	ignorepm: 'ignorepms',
	ignorepms: function (target, room, user) {
		if (user.ignorePMs) return this.sendReply("You are already blocking Private Messages!");
		if (user.can('lock') && !user.can('hotpatch')) return this.sendReply("You are not allowed to block Private Messages.");
		user.ignorePMs = true;
		return this.sendReply("You are now blocking Private Messages.");
	},

	unblockpm: 'unignorepms',
	unblockpms: 'unignorepms',
	unignorepm: 'unignorepms',
	unignorepms: function (target, room, user) {
		if (!user.ignorePMs) return this.sendReply("You are not blocking Private Messages!");
		user.ignorePMs = false;
		return this.sendReply("You are no longer blocking Private Messages.");
	},

	makechatroom: function(target, room, user) {
		if (!this.can('makeroom')) return;
		var id = toId(target);
		if (!id) return this.parse('/help makechatroom');
		if (Rooms.rooms[id]) {
			return this.sendReply("The room '"+target+"' already exists.");
		}
		if (Rooms.global.addChatRoom(target)) {
			return this.sendReply("The room '"+target+"' was created.");
		}
		return this.sendReply("An error occurred while trying to create the room '"+target+"'.");
	},

	deregisterchatroom: function (target, room, user) {
		if (!this.can('makeroom')) return;
		var id = toId(target);
		if (!id) return this.parse('/help deregisterchatroom');
		var targetRoom = Rooms.get(id);
		if (!targetRoom) return this.sendReply("The room '" + target + "' doesn't exist.");
		target = targetRoom.title || targetRoom.id;
		if (Rooms.global.deregisterChatRoom(id)) {
			this.sendReply("The room '" + target + "' was deregistered.");
			this.sendReply("It will be deleted as of the next server restart.");
			return;
		}
		return this.sendReply("The room '" + target + "' isn't registered.");
	},

	privateroom: function (target, room, user) {
		if (!this.can('privateroom', null, room)) return;
		if (target === 'off') {
			delete room.isPrivate;
			this.addModCommand("" + user.name + " made this room public.");
			if (room.chatRoomData) {
				delete room.chatRoomData.isPrivate;
				Rooms.global.writeChatRoomData();
			}
		} else {
			room.isPrivate = true;
			this.addModCommand("" + user.name + " made this room private.");
			if (room.chatRoomData) {
				room.chatRoomData.isPrivate = true;
				Rooms.global.writeChatRoomData();
			}
		}
	},

	modjoin: function (target, room, user) {
		if (!this.can('privateroom', null, room)) return;
		if (target === 'off') {
			delete room.modjoin;
			this.addModCommand("" + user.name + " turned off modjoin.");
			if (room.chatRoomData) {
				delete room.chatRoomData.modjoin;
				Rooms.global.writeChatRoomData();
			}
		} else {
			room.modjoin = true;
			this.addModCommand("" + user.name + " turned on modjoin.");
			if (room.chatRoomData) {
				room.chatRoomData.modjoin = true;
				Rooms.global.writeChatRoomData();
			}
		}
	},

	officialchatroom: 'officialroom',
	officialroom: function (target, room, user) {
		if (!this.can('makeroom')) return;
		if (!room.chatRoomData) {
			return this.sendReply("/officialroom - This room can't be made official");
		}
		if (target === 'off') {
			delete room.isOfficial;
			this.addModCommand("" + user.name + " made this chat room unofficial.");
			delete room.chatRoomData.isOfficial;
			Rooms.global.writeChatRoomData();
		} else {
			room.isOfficial = true;
			this.addModCommand("" + user.name + " made this chat room official.");
			room.chatRoomData.isOfficial = true;
			Rooms.global.writeChatRoomData();
		}
	},

	roomowner: function (target, room, user) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomowner - This room isn't designed for per-room moderation to be added");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;

		if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");

		if (!this.can('makeroom', targetUser, room)) return false;

		if (!room.auth) room.auth = room.chatRoomData.auth = {};

		var name = targetUser.name;

		room.auth[targetUser.userid] = '#';
		this.addModCommand("" + name + " was appointed Room Owner by " + user.name + ".");
		room.onUpdateIdentity(targetUser);
		Rooms.global.writeChatRoomData();
	},

	roomdeowner: 'deroomowner',
	deroomowner: function (target, room, user) {
		if (!room.auth) {
			return this.sendReply("/roomdeowner - This room isn't designed for per-room moderation");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");

		if (room.auth[userid] !== '#') return this.sendReply("User '" + name + "' is not a room owner.");
		if (!this.can('makeroom', null, room)) return false;

		delete room.auth[userid];
		this.sendReply("(" + name + " is no longer Room Owner.)");
		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
	},

	roomdesc: function (target, room, user) {
		if (!target) {
			if (!this.canBroadcast()) return;
			var re = /(https?:\/\/(([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?))/g;
			if (!room.desc) return this.sendReply("This room does not have a description set.");
			this.sendReplyBox("The room description is: " + room.desc.replace(re, '<a href="$1">$1</a>'));
			return;
		}
		if (!this.can('roommod', null, room)) return false;
		if (target.length > 80) return this.sendReply("Error: Room description is too long (must be at most 80 characters).");

		room.desc = target;
		this.sendReply("(The room description is now: " + target + ")");

		if (room.chatRoomData) {
			room.chatRoomData.desc = room.desc;
			Rooms.global.writeChatRoomData();
		}
	},

	roomdemote: 'roompromote',
	roompromote: function (target, room, user, connection, cmd) {
		if (!room.auth) {
			this.sendReply("/roompromote - This room isn't designed for per-room moderation");
			return this.sendReply("Before setting room mods, you need to set it up with /roomowner");
		}
		if (!target) return this.parse('/help roompromote');

		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var userid = toId(this.targetUsername);
		var name = targetUser ? targetUser.name : this.targetUsername;

		if (!userid) return this.parse('/help roompromote');
		if (!targetUser && (!room.auth || !room.auth[userid])) {
			return this.sendReply("User '" + name + "' is offline and unauthed, and so can't be promoted.");
		}

		var currentGroup = ((room.auth && room.auth[userid]) || ' ')[0];
		var nextGroup = target || Users.getNextGroupSymbol(currentGroup, cmd === 'roomdemote', true);
		if (target === 'deauth') nextGroup = Config.groupsranking[0];
		if (!Config.groups[nextGroup]) {
			return this.sendReply("Group '" + nextGroup + "' does not exist.");
		}

		if (Config.groups[nextGroup].globalonly) {
			return this.sendReply("Group 'room" + Config.groups[nextGroup].id + "' does not exist as a room rank.");
		}

		var groupName = Config.groups[nextGroup].name || "regular user";
		if (currentGroup === nextGroup) {
			return this.sendReply("User '" + name + "' is already a " + groupName + " in this room.");
		}
		if (currentGroup !== ' ' && !user.can('room' + Config.groups[currentGroup].id, null, room)) {
			return this.sendReply("/" + cmd + " - Access denied for promoting from " + Config.groups[currentGroup].name + ".");
		}
		if (nextGroup !== ' ' && !user.can('room' + Config.groups[nextGroup].id, null, room)) {
			return this.sendReply("/" + cmd + " - Access denied for promoting to " + Config.groups[nextGroup].name + ".");
		}

		if (nextGroup === ' ') {
			delete room.auth[userid];
		} else {
			room.auth[userid] = nextGroup;
		}

		if (Config.groups[nextGroup].rank < Config.groups[currentGroup].rank) {
			this.privateModCommand("(" + name + " was demoted to Room " + groupName + " by " + user.name + ".)");
			if (targetUser) targetUser.popup("You were demoted to Room " + groupName + " by " + user.name + ".");
		} else if (nextGroup === '#') {
			this.addModCommand("" + name + " was promoted to " + groupName + " by " + user.name + ".");
		} else {
			this.addModCommand("" + name + " was promoted to Room " + groupName + " by " + user.name + ".");
		}

		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) Rooms.global.writeChatRoomData();
	},

	autojoin: function (target, room, user, connection) {
		Rooms.global.autojoinRooms(user, connection);
	},

	join: function (target, room, user, connection) {
		if (!target) return false;
		var targetRoom = Rooms.get(target) || Rooms.get(toId(target));
		if (!targetRoom) {
			return connection.sendTo(target, "|noinit|nonexistent|The room '" + target + "' does not exist.");
		}
		if (targetRoom.isPrivate) {
			if (targetRoom.modjoin) {
				var userGroup = user.group;
				if (targetRoom.auth) {
					userGroup = targetRoom.auth[user.userid] || ' ';
				}
				if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(targetRoom.modchat)) {
					return connection.sendTo(target, "|noinit|nonexistent|The room '" + target + "' does not exist.");
				}
			}
			if (!user.named) {
				return connection.sendTo(target, "|noinit|namerequired|You must have a name in order to join the room '" + target + "'.");
			}
		}
		if (!user.joinRoom(targetRoom || room, connection)) {
			return connection.sendTo(target, "|noinit|joinfailed|The room '" + target + "' could not be joined.");
		}if(target.toLowerCase() == 'lobby'){
            connection.sendTo('lobby','|html|<center><font size="5" color="#8000ff">' +
            '"Welcome, to the Shocked Spirit server by Freddycakes, where trainers take a break and just have some fun! Come chill for a while!"<br/>' +
            '</font><font size="3">If you like eating and playing pokemon, stop on by :)<br/>' +
            '</font><font size="3">I am happy to announce that speedmons is out of beta and ready to be played<br/>' +
            'The Pokemon of the day is beartic,</font><br/>' +
            'GOOD LUCK,Check out our new formats and commands</font><br/>' +
            'and please if you want to become a part of our staff it is really easy just stick around</font><br/>' +
            'and be a good person and you will get promoted in no time,</font><br/>' +
            'I am also making a staff room pm me to join if your apart of our staff</font><br/>' + 
            '<img src="http://www.smogon.com/download/sprites/bwmini/250.gif">' +
            '<img src="http://www.smogon.com/download/sprites/bwmini/128.gif">' +
            '<img src="http://www.smogon.com/download/sprites/bwmini/393.gif">' +
            '<img src="http://www.smogon.com/download/sprites/bwmini/248.gif"> </center>' +
            '<button> <button name="send" value="I love eating out the trash">Only Cool People Press Me!<button> </font><br/> </center>');
		}
	},afk: 'away',
        away: function(target, room, user, connection) {
                if (!this.can('lock')) return false;
                if (user.name.indexOf(' - ⒶⓌⒶⓎ') !== -1) {
                return this.sendReply("You are already away");
                }
                var target2 = '('+target+')';
                if (target.length < 1) {
this.add('|html|<b>- <font color = #007bff>'+user.name+'</font></b> is now away.');
}
else {
this.add('|html|<b>- <font color = #007bff>'+user.name+'</font></b> is now away. '+target2);
}
                var namezzz = user.name + ' - ⒶⓌⒶⓎ';
user.forceRename(namezzz, undefined, true);
//return this.parse('/nick '+namezzz);
},
        unafk: 'back',
        back: function(target, room, user, connection) {
                if (!this.can('lock')) return false;
              if (user.name.indexOf(' - ⒶⓌⒶⓎ') == -1) {
                return this.sendReply("You're not away!");
                }
                nickk = user.name.substring(0, user.name.length - 7);
                user.forceRename(nickk, undefined, true);
                this.add('|html|<b>- <font color = #007bff>'+user.name+'</font></b> is back.');
                },

	rb: 'roomban',
	roomban: function (target, room, user, connection) {
		if (!target) return this.parse('/help roomban');

		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);

		if (!userid || !targetUser) return this.sendReply("User '" + name + "' does not exist.");
		if (!this.can('ban', targetUser, room)) return false;
		if (!room.bannedUsers || !room.bannedIps) {
			return this.sendReply("Room bans are not meant to be used in room " + room.id + ".");
		}
		room.bannedUsers[userid] = true;
		for (var ip in targetUser.ips) {
			room.bannedIps[ip] = true;
		}
		targetUser.popup("" + user.name + " has banned you from the room " + room.id + ". To appeal the ban, PM the moderator that banned you or a room owner." + (target ? " (" + target + ")" : ""));
		this.addModCommand("" + targetUser.name + " was banned from room " + room.id + " by " + user.name + "." + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addModCommand("" + targetUser.name + "'s alts were also banned from room " + room.id + ": " + alts.join(", "));
			for (var i = 0; i < alts.length; ++i) {
				var altId = toId(alts[i]);
				this.add('|unlink|' + altId);
				room.bannedUsers[altId] = true;
			}
		}
		this.add('|unlink|' + targetUser.userid);
		targetUser.leaveRoom(room.id);
	},

	roomunban: function (target, room, user, connection) {
		if (!target) return this.parse('/help roomunban');

		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);

		if (!userid || !targetUser) return this.sendReply("User '" + name + "' does not exist.");
		if (!this.can('ban', targetUser, room)) return false;
		if (!room.bannedUsers || !room.bannedIps) {
			return this.sendReply("Room bans are not meant to be used in room " + room.id + ".");
		}
		if (room.bannedUsers[userid]) delete room.bannedUsers[userid];
		for (var ip in targetUser.ips) {
			if (room.bannedIps[ip]) delete room.bannedIps[ip];
		}
		targetUser.popup("" + user.name + " has unbanned you from the room " + room.id + ".");
		this.addModCommand("" + targetUser.name + " was unbanned from room " + room.id + " by " + user.name + ".");
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addModCommand("" + targetUser.name + "'s alts were also unbanned from room " + room.id + ": " + alts.join(", "));
			for (var i = 0; i < alts.length; ++i) {
				var altId = toId(alts[i]);
				if (room.bannedUsers[altId]) delete room.bannedUsers[altId];
			}
		}
	},hug: function(target, room, user){
		if(!target) return this.sendReply('/hug needs a target.');
		return this.parse('/me hugs ' + target + '.');
	},
	slap: function(target, room, user){
		if(!target) return this.sendReply('/slap needs a target.');
		return this.parse('/me slaps ' + target + ' with a bananna peel.');
	},
      rk:function(target, room, user){
		if(!target) return this.sendReply('/roomkick needs a target.');
		return this.parse('/roomkick ' + target + ' with a bananna peel.');
	},

	roomauth: function (target, room, user, connection) {
		if (!room.auth) return this.sendReply("/roomauth - This room isn't designed for per-room moderation and therefore has no auth list.");
		var buffer = [];
		for (var u in room.auth) {
			buffer.push(room.auth[u] + u);
		}
		if (buffer.length > 0) {
			buffer = buffer.join(", ");
		} else {
			buffer = "This room has no auth.";
		}
		connection.popup(buffer);
	},

	leave: 'part',
	part: function (target, room, user, connection) {
		if (room.id === 'global') return false;
		var targetRoom = Rooms.get(target);
		if (target && !targetRoom) {
			return this.sendReply("The room '" + target + "' does not exist.");
		}
		user.leaveRoom(targetRoom || room, connection);
	},zzz: 'sleep',
        sleep: function(target, room, user, connection) {
                if (!this.can('lock')) return false;
                if (user.name.indexOf(' - sleep') !== -1) {
                return this.sendReply("You are already sleep");
                }
                var target2 = '('+target+')';
                if (target.length < 1) {
this.add('|html|<b>- <font color = #007bff>'+user.name+'</font></b> is now sleep.');
}
else {
this.add('|html|<b>- <font color = #007bff>'+user.name+'</font></b> is now sleep. '+target2);
}
                var namezzz = user.name + ' - sleep';
user.forceRename(namezzz, undefined, true);
//return this.parse('/nick '+namezzz);
},
               
awake: 'awake',
        awake: function(target, room, user, connection) {
                if (!this.can('lock')) return false;
if (user.name.indexOf(' - sleep') == -1) {
                return this.sendReply("You're not away!");
                }
                nickk = user.name.substring(0, user.name.length - 7);
                user.forceRename(nickk, undefined, true);
                this.add('|html|<b>- <font color = #007bff>'+user.name+'</font></b> is back.');
                },
         afs: 'away',
        away: function(target, room, user, connection) {
                if (!this.can('lock')) return false;
                if (user.name.indexOf(' - away') !== -1) {
                return this.sendReply("You are already away");
                }
                var target2 = '('+target+')';
                if (target.length < 1) {
this.add('|html|<b>- <font color = #007bff>'+user.name+'</font></b> is now away from server.');
}
else {
this.add('|html|<b>- <font color = #007bff>'+user.name+'</font></b> is now away from server. '+target2);
}
                var namezzz = user.name + ' - away';
user.forceRename(namezzz, undefined, true);
//return this.parse('/nick '+namezzz);
},
               
unafk: 'back',
        back: function(target, room, user, connection) {
                if (!this.can('lock')) return false;
if (user.name.indexOf(' - away') == -1) {
                return this.sendReply("You're not away!");
                }
                nickk = user.name.substring(0, user.name.length - 7);
                user.forceRename(nickk, undefined, true);
                this.add('|html|<b>- <font color = #007bff>'+user.name+'</font></b> is back.');
                },
 catvenom: 'inject',
        inject: function(target, room, user) {
                if (user.name == 'freddycakes') {
                        if (!target) {
                        return this.sendReply('You need a target to inject!');
                        }
target = this.splitTarget(target);
                        var targetUser = this.targetUser;
               
                if (!targetUser) {
                return this.sendReply('You need a target to inject!');
                }
                if (targetUser.Derped == true) {
                        return this.sendReply(targetUser.name+' has already been injected!')
                }
                //if (targetUser.can('forcetie')) {
                //      return this.sendReply('You can\'t inject that user!');
                //}
                        this.send('|html|<font color="blue"> '+user.name+' injected '+targetUser.name+' with cat venom!');
                        targetUser.Derped = true;
                        targetUser.popup('You have been injected with cat venom. You will behave like a cat until an antidote is given to you')
                }
                else this.sendReply('You arent allowed');
                },
               
                cure: function(target, room, user) {
                if (!this.can('ban')) return false;
                if (!target) {
                return this.sendReply('You need a target to cure!');
                }
                target = this.splitTarget(target);
                var targetUser = this.targetUser;
                if (!targetUser) {
                return this.sendReply('You need a target to cure!');
                }
                if (targetUser.Derped == false) {
                        return this.sendReply(targetUser.name+' isn\'t poisoned with cat venom yet!')
                }
                        this.send('|html|<font color= "blue"> '+targetUser.name+' was cured of the cat poisoning by '+user.name+'!');
                        targetUser.Derped = false;
                        targetUser.popup('You have now been cured by '+user.name);
                }, lick: function(target, room, user){
                if(!target) return this.sendReply('/lick needs a target.');
                return this.parse('/me licks ' + target +' excessivley!');
     }, busy: function(target, room, user, connection) {
		if (!this.can('lock')) return false;
		if (user.name.length > 18) return this.sendReply('Your username exceeds the length limit.');
		
		var html = ['<img ','<a href','<font ','<marquee','<blink','<center', '<button', '<b', '<i'];
        	for (var x in html) {
        	if (target.indexOf(html[x]) > -1) return this.sendReply('HTML is not supported in this command.');
        	}

		if (!user.isAway) {
			user.originalName = user.name;
			var awayName = user.name + ' - Busy';
			//delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
			delete Users.get(awayName);
			user.forceRename(awayName, undefined, true);
			
			this.add('|raw|-- <b><font color="#4F86F7">' + user.originalName +'</font color></b> is now busy. '+ (target ? " (" + target + ")" : ""));

			user.isAway = true;
		}
		else {
			return this.sendReply('You are already set as away, type /back if you are now back.');
		}

		user.updateIdentity();
	}, unBusy: 'unBusy',
        unBusy: function(target, room, user, connection) {
                if (!this.can('lock')) return false;
if (user.name.indexOf(' - Busy') == -1) {
                return this.sendReply("You're not Busy!");
                }
                nickk = user.name.substring(0, user.name.length - 7);
                user.forceRename(nickk, undefined, true);
                this.add('|html|<b>- <font color = #007bff>'+user.name+'</font></b> is not Busy.');
                },
	cry: 'cry',
	cry: function(target, room, user){
		return this.parse('/me starts tearbending dramatically like Katara~!');
	}, HI: 'Hi',
	hi: function(target, room, user){
		return this.parse('/msg freddycakes, hello');
	},
         s: 'spank',
	spank: function(target, room, user){
                if(!target) return this.sendReply('/spank needs a target.');
                return this.parse('/me spanks ' + target +'!');
    	},kiss: 'kiss',
	kiss: function(target, room, user){
                if(!target) return this.sendReply('/kiss needs a target.');
                return this.parse('/me kisses ' + target +'!');
    	},dk: 'dropkick',
	dropkick: function(target, room, user){
                if(!target) return this.sendReply('/dropkick needs a target.');
                return this.parse('/me dropkicks ' + target + ' across the PokÃƒÆ’Ã‚Â©mon Stadium!');
           },fart: function(target, room, user){
		if(!target) return this.sendReply('/fart needs a target.');
		return this.parse('/me farts on ' + target + '\'s face!');
	},
	poke: function(target, room, user){
		if(!target) return this.sendReply('/poke needs a target.');
		return this.parse('/me pokes ' + target + '.');
	},pet: function(target, room, user){
		if(!target) return this.sendReply('/pet needs a target.');
		return this.parse('/me pets ' + target + ' lavishly.');
	},halloween: function(target, room, user){
                if(!target) return this.sendReply('/halloween needs a target.');
                return this.parse('/me takes ' + target +'`s pumpkin and smashes it all over the PokÃƒÆ’Ã‚Â©mon Stadium!');
	},

         /*********************************************************
	* Nature Commands                                  
	*********************************************************/


	nature: 'n',
        n: function(target, room, user) {
                if (!this.canBroadcast()) return;
                target = target.toLowerCase();
                target = target.trim();
                var matched = false;
                if (target === 'hardy') {
                        matched = true;
                        this.sendReplyBox('<b>Hardy</b>: <font color="blue"><b>Neutral</b></font>');
                }
                if (target === 'lonely' || target ==='+atk -def') {
                        matched = true;
                        this.sendReplyBox('<b>Lonely</b>: <font color="green"><b>Attack</b></font>, <font color="red"><b>Defense</b></font>');
                }
                if (target === 'brave' || target ==='+atk -spe') {
                        matched = true;
                        this.sendReplyBox('<b>Brave</b>: <font color="green"><b>Attack</b></font>, <font color="red"><b>Speed</b></font>');
                }
                if (target === 'adamant' || target === '+atk -spa') {
                        matched = true;
                        this.sendReplyBox('<b>Adamant</b>: <font color="green"><b>Attack</b></font>, <font color="red"><b>Special Attack</b></font>');
                }
                if (target === 'naughty' || target ==='+atk -spd') {
                        matched = true;
                        this.sendReplyBox('<b>Naughty</b>: <font color="green"><b>Attack</b></font>, <font color="red"><b>Special Defense</b></font>');
                }
                if (target === 'bold' || target ==='+def -atk') {
                        matched = true;
                        this.sendReplyBox('<b>Bold</b>: <font color="green"><b>Defense</b></font>, <font color="red"><b>Attack</b></font>');
                }
                if (target === 'docile') {
                        matched = true;
                        this.sendReplyBox('<b>Docile</b>: <font color="blue"><b>Neutral</b></font>');
                }
                if (target === 'relaxed' || target ==='+def -spe') {
                        matched = true;
                        this.sendReplyBox('<b>Relaxed</b>: <font color="green"><b>Defense</b></font>, <font color="red"><b>Speed</b></font>');
                }
                if (target === 'impish' || target ==='+def -spa') {
                        matched = true;
                        this.sendReplyBox('<b>Impish</b>: <font color="green"><b>Defense</b></font>, <font color="red"><b>Special Attack</b></font>');
                }
                if (target === 'lax' || target ==='+def -spd') {
                        matched = true;
                        this.sendReplyBox('<b>Lax</b>: <font color="green"><b>Defense</b></font>, <font color="red"><b>Special Defense</b></font>');
                }
                if (target === 'timid' || target ==='+spe -atk') {
                        matched = true;
                        this.sendReplyBox('<b>Timid</b>: <font color="green"><b>Speed</b></font>, <font color="red"><b>Attack</b></font>');
                }
                if (target ==='hasty' || target ==='+spe -def') {
                        matched = true;
                        this.sendReplyBox('<b>Hasty</b>: <font color="green"><b>Speed</b></font>, <font color="red"><b>Defense</b></font>');
                }
                if (target ==='serious') {
                        matched = true;
                        this.sendReplyBox('<b>Serious</b>: <font color="blue"><b>Neutral</b></font>');
                }
                if (target ==='jolly' || target ==='+spe -spa') {
                        matched= true;
                        this.sendReplyBox('<b>Jolly</b>: <font color="green"><b>Speed</b></font>, <font color="red"><b>Special Attack</b></font>');
                }
                if (target==='naive' || target ==='+spe -spd') {
                        matched = true;
                        this.sendReplyBox('<b>NaÃƒÂ¯ve</b>: <font color="green"><b>Speed</b></font>, <font color="red"><b>Special Defense</b></font>');
                }
                if (target==='modest' || target ==='+spa -atk') {
                        matched = true;
                        this.sendReplyBox('<b>Modest</b>: <font color="green"><b>Special Attack</b></font>, <font color="red"><b>Attack</b></font>');
                }
                if (target==='mild' || target ==='+spa -def') {
                        matched = true;
                        this.sendReplyBox('<b>Mild</b>: <font color="green"><b>Special Attack</b></font>, <font color="red"><b>Defense</b></font>');
                }
                if (target==='quiet' || target ==='+spa -spe') {
                        matched = true;
                        this.sendReplyBox('<b>Quiet</b>: <font color="green"><b>Special Attack</b></font>, <font color="red"><b>Speed</b></font>');
                }
                if (target==='bashful') {
                        matched = true;
                        this.sendReplyBox('<b>Bashful</b>: <font color="blue"><b>Neutral</b></font>');
                }
                if (target ==='rash' || target === '+spa -spd') {
                        matched = true;
                        this.sendReplyBox('<b>Rash</b>: <font color="green"><b>Special Attack</b></font>, <font color="red"><b>Special Defense</b></font>');
                }
                if (target==='calm' || target ==='+spd -atk') {
                        matched = true;
                        this.sendReplyBox('<b>Calm</b>: <font color="green"><b>Special Defense</b></font>, <font color="red"><b>Attack</b></font>');
                }
                if (target==='gentle' || target ==='+spd -def') {
                        matched = true;
                        this.sendReplyBox('<b>Gentle</b>: <font color="green"><b>Special Defense</b></font>, <font color="red"><b>Defense</b></font>');
                }
                if (target==='sassy' || target ==='+spd -spe') {
                        matched = true;
                        this.sendReplyBox('<b>Sassy</b>: <font color="green"><b>Special Defense</b></font>, <font color="red"><b>Speed</b></font>');
                }
                if (target==='careful' || target ==='+spd -spa') {
                        matched = true;
                        this.sendReplyBox('<b>Careful<b/>: <font color="green"><b>Special Defense</b></font>, <font color="red"><b>Special Attack</b></font>');
                }
                if (target==='quirky') {
                        matched = true;
                        this.sendReplyBox('<b>Quirky</b>: <font color="blue"><b>Neutral</b></font>');
                }
                if (target === 'plus attack' || target === '+atk') {
                        matched = true;
                        this.sendReplyBox("<b>+ Attack Natures: Lonely, Adamant, Naughty, Brave</b>");
                }
                if (target=== 'plus defense' || target === '+def') {
                        matched = true;
                        this.sendReplyBox("<b>+ Defense Natures: Bold, Impish, Lax, Relaxed</b>");
                }
                if (target === 'plus special attack' || target === '+spa') {
                        matched = true;
                        this.sendReplyBox("<b>+ Special Attack Natures: Modest, Mild, Rash, Quiet</b>");
                }
                if (target === 'plus special defense' || target === '+spd') {
                        matched = true;
                        this.sendReplyBox("<b>+ Special Defense Natures: Calm, Gentle, Careful, Sassy</b>");
                }
                if (target === 'plus speed' || target === '+spe') {
                        matched = true;
                        this.sendReplyBox("<b>+ Speed Natures: Timid, Hasty, Jolly, NaÃƒÆ’Ã‚Â¯ve</b>");
                }
                if (target === 'minus attack' || target==='-atk') {
                        matched = true;
                        this.sendReplyBox("<b>- Attack Natures: Bold, Modest, Calm, Timid</b>");
                }
                if (target === 'minus defense' || target === '-def') {
                        matched = true;
                        this.sendReplyBox("<b>-Defense Natures: Lonely, Mild, Gentle, Hasty</b>");
                }
                if (target === 'minus special attack' || target === '-spa') {
                        matched = true;
                        this.sendReplyBox("<b>-Special Attack Natures: Adamant, Impish, Careful, Jolly</b>");
                }
                if (target ==='minus special defense' || target === '-spd') {
                        matched = true;
                        this.sendReplyBox("<b>-Special Defense Natures: Naughty, Lax, Rash, NaÃƒÆ’Ã‚Â¯ve</b>");
                }
                if (target === 'minus speed' || target === '-spe') {
                        matched = true;
                        this.sendReplyBox("<b>-Speed Natures: Brave, Relaxed, Quiet, Sassy</b>");
                }
                if (!target) {
                        this.sendReply('/nature [nature] OR /nature [+increase -decrease] - tells you the increase and decrease of that nature.');
                }
                if (!matched) {
                        this.sendReply('Nature "'+target+'" not found. Check your spelling?');
                }
        },
	/*********************************************************
	 * Moderating: Punishments
	 *********************************************************/

	kick: 'warn',
	k: 'warn',
	warn: function (target, room, user) {
		if (!target) return this.parse('/help warn');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		if (room.isPrivate && room.auth) {
			return this.sendReply("You can't warn here: This is a privately-owned room not subject to global rules.");
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('warn', targetUser, room)) return false;

		this.addModCommand("" + targetUser.name + " was warned by " + user.name + "." + (target ? " (" + target + ")" : ""));
		targetUser.send('|c|~|/warn ' + target);
		var nickToUnlink = targetUser.named ? targetUser.userid : (Object.keys(targetUser.prevNames).last() || targetUser.userid);
		this.add('|unlink|' + nickToUnlink);
	},

	redirect: 'redir',
	redir: function (target, room, user, connection) {
		if (!target) return this.parse('/help redirect');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		var targetRoom = Rooms.get(target) || Rooms.get(toId(target));
		if (!targetRoom) {
			return this.sendReply("The room '" + target + "' does not exist.");
		}
		if (!this.can('warn', targetUser, room) || !this.can('warn', targetUser, targetRoom)) return false;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		if (Rooms.rooms[targetRoom.id].users[targetUser.userid]) {
			return this.sendReply("User " + targetUser.name + " is already in the room " + target + "!");
		}
		if (!Rooms.rooms[room.id].users[targetUser.userid]) {
			return this.sendReply("User " + this.targetUsername + " is not in the room " + room.id + ".");
		}
		if (targetUser.joinRoom(target) === false) return this.sendReply("User " + targetUser.name + " could not be joined to room " + target + ". They could be banned from the room.");
		var roomName = (targetRoom.isPrivate)? "a private room" : "room " + targetRoom.title;
		this.addModCommand("" + targetUser.name + " was redirected to " + roomName + " by " + user.name + ".");
		targetUser.leaveRoom(room);
	},

	m: 'mute',
	mute: function (target, room, user) {
		if (!target) return this.parse('/help mute');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('mute', targetUser, room)) return false;
		if (targetUser.mutedRooms[room.id] || targetUser.locked || !targetUser.connected) {
			var problem = " but was already " + (!targetUser.connected ? "offline" : targetUser.locked ? "locked" : "muted");
			if (!target) {
				return this.privateModCommand("(" + targetUser.name + " would be muted by " + user.name + problem + ".)");
			}
			return this.addModCommand("" + targetUser.name + " would be muted by " + user.name + problem + "." + (target ? " (" + target + ")" : ""));
		}

		targetUser.popup("" + user.name + " has muted you for 7 minutes. " + target);
		this.addModCommand("" + targetUser.name + " was muted by " + user.name + " for 7 minutes." + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand("" + targetUser.name + "'s alts were also muted: " + alts.join(", "));
		var nickToUnlink = targetUser.named ? targetUser.userid : (Object.keys(targetUser.prevNames).last() || targetUser.userid);
		this.add('|unlink|' + nickToUnlink);

		targetUser.mute(room.id, 7 * 60 * 1000);
	},

	hm: 'hourmute',
	hourmute: function (target, room, user) {
		if (!target) return this.parse('/help hourmute');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('mute', targetUser, room)) return false;

		if (((targetUser.mutedRooms[room.id] && (targetUser.muteDuration[room.id] || 0) >= 50 * 60 * 1000) || targetUser.locked) && !target) {
			var problem = " but was already " + (!targetUser.connected ? "offline" : targetUser.locked ? "locked" : "muted");
			return this.privateModCommand("(" + targetUser.name + " would be muted by " + user.name + problem + ".)");
		}

		targetUser.popup("" + user.name + " has muted you for 60 minutes. " + target);
		this.addModCommand("" + targetUser.name + " was muted by " + user.name + " for 60 minutes." + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand("" + targetUser.name + "'s alts were also muted: " + alts.join(", "));
		var nickToUnlink = targetUser.named ? targetUser.userid : (Object.keys(targetUser.prevNames).last() || targetUser.userid);
		this.add('|unlink|' + nickToUnlink);

		targetUser.mute(room.id, 60 * 60 * 1000, true);
	},

	um: 'unmute',
	unmute: function (target, room, user) {
		if (!target) return this.parse('/help unmute');
		var targetUser = Users.get(target);
		if (!targetUser) {
			return this.sendReply("User " + target + " not found.");
		}
		if (!this.can('mute', targetUser, room)) return false;

		if (!targetUser.mutedRooms[room.id]) {
			return this.sendReply("" + targetUser.name + " isn't muted.");
		}

		this.addModCommand("" + targetUser.name + " was unmuted by " + user.name + ".");

		targetUser.unmute(room.id);
	},

	l: 'lock',
	ipmute: 'lock',
	lock: function (target, room, user) {
		if (!target) return this.parse('/help lock');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply("User " + this.targetUser + " not found.");
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('lock', targetUser)) return false;

		if ((targetUser.locked || Users.checkBanned(targetUser.latestIp)) && !target) {
			var problem = " but was already " + (targetUser.locked ? "locked" : "banned");
			return this.privateModCommand("(" + targetUser.name + " would be locked by " + user.name + problem + ".)");
		}

		targetUser.popup("" + user.name + " has locked you from talking in chats, battles, and PMing regular users.\n\n" + target + "\n\nIf you feel that your lock was unjustified, you can still PM staff members (%, @, &, and ~) to discuss it.");

		this.addModCommand("" + targetUser.name + " was locked from talking by " + user.name + "." + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand("" + targetUser.name + "'s alts were also locked: " + alts.join(", "));
		var nickToUnlink = targetUser.named ? targetUser.userid : (Object.keys(targetUser.prevNames).last() || targetUser.userid);
		this.add('|unlink|' + nickToUnlink);

		targetUser.lock();
	},

	unlock: function (target, room, user) {
		if (!target) return this.parse('/help unlock');
		if (!this.can('lock')) return false;

		var unlocked = Users.unlock(target);

		if (unlocked) {
			var names = Object.keys(unlocked);
			this.addModCommand(names.join(", ") + " " +
				((names.length > 1) ? "were" : "was") +
				" unlocked by " + user.name + ".");
		} else {
			this.sendReply("User " + target + " is not locked.");
		}
	},

	b: 'ban',
	ban: function (target, room, user) {
		if (!target) return this.parse('/help ban');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('ban', targetUser)) return false;

		if (Users.checkBanned(targetUser.latestIp) && !target && !targetUser.connected) {
			var problem = " but was already banned";
			return this.privateModCommand("(" + targetUser.name + " would be banned by " + user.name + problem + ".)");
		}

		targetUser.popup("" + user.name + " has banned you." + (Config.appealurl ? (" If you feel that your banning was unjustified you can appeal the ban:\n" + Config.appealurl) : "") + "\n\n" + target);

		this.addModCommand("" + targetUser.name + " was banned by " + user.name + "." + (target ? " (" + target + ")" : ""), " (" + targetUser.latestIp + ")");
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addModCommand("" + targetUser.name + "'s alts were also banned: " + alts.join(", "));
			for (var i = 0; i < alts.length; ++i) {
				this.add('|unlink|' + toId(alts[i]));
			}
		}

		var nickToUnlink = targetUser.named ? targetUser.userid : (Object.keys(targetUser.prevNames).last() || targetUser.userid);
		this.add('|unlink|' + nickToUnlink);
		targetUser.ban();
	},

	unban: function (target, room, user) {
		if (!target) return this.parse('/help unban');
		if (!this.can('ban')) return false;

		var name = Users.unban(target);

		if (name) {
			this.addModCommand("" + name + " was unbanned by " + user.name + ".");
		} else {
			this.sendReply("User " + target + " is not banned.");
		}
	},

	unbanall: function (target, room, user) {
		if (!this.can('rangeban')) return false;
		// we have to do this the hard way since it's no longer a global
		for (var i in Users.bannedIps) {
			delete Users.bannedIps[i];
		}
		for (var i in Users.lockedIps) {
			delete Users.lockedIps[i];
		}
		this.addModCommand("All bans and locks have been lifted by " + user.name + ".");
	},

	banip: function (target, room, user) {
		target = target.trim();
		if (!target) {
			return this.parse('/help banip');
		}
		if (!this.can('rangeban')) return false;

		Users.bannedIps[target] = '#ipban';
		this.addModCommand("" + user.name + " temporarily banned the " + (target.charAt(target.length - 1) === '*' ? "IP range" : "IP") + ": " + target);
	},

	unbanip: function (target, room, user) {
		target = target.trim();
		if (!target) {
			return this.parse('/help unbanip');
		}
		if (!this.can('rangeban')) return false;
		if (!Users.bannedIps[target]) {
			return this.sendReply("" + target + " is not a banned IP or IP range.");
		}
		delete Users.bannedIps[target];
		this.addModCommand("" + user.name + " unbanned the " + (target.charAt(target.length - 1) === '*' ? "IP range" : "IP") + ": " + target);
	},

	/*********************************************************
	 * Moderating: Other
	 *********************************************************/

	demote: 'promote',
	promote: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help promote');

		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var userid = toId(this.targetUsername);
		var name = targetUser ? targetUser.name : this.targetUsername;

		if (!userid) return this.parse('/help promote');

		var currentGroup = ((targetUser && targetUser.group) || Users.usergroups[userid] || ' ')[0];
		var nextGroup = target ? target : Users.getNextGroupSymbol(currentGroup, cmd === 'demote', true);
		if (target === 'deauth') nextGroup = Config.groupsranking[0];
		if (!Config.groups[nextGroup]) {
			return this.sendReply("Group '" + nextGroup + "' does not exist.");
		}
		if (Config.groups[nextGroup].roomonly) {
			return this.sendReply("Group '" + nextGroup + "' does not exist as a global rank.");
		}

		var groupName = Config.groups[nextGroup].name || "regular user";
		if (currentGroup === nextGroup) {
			return this.sendReply("User '" + name + "' is already a " + groupName);
		}
		if (!user.canPromote(currentGroup, nextGroup)) {
			return this.sendReply("/" + cmd + " - Access denied.");
		}

		if (!Users.setOfflineGroup(name, nextGroup)) {
			return this.sendReply("/promote - WARNING: This user is offline and could be unregistered. Use /forcepromote if you're sure you want to risk it.");
		}
		if (Config.groups[nextGroup].rank < Config.groups[currentGroup].rank) {
			this.privateModCommand("(" + name + " was demoted to " + groupName + " by " + user.name + ".)");
			if (targetUser) targetUser.popup("You were demoted to " + groupName + " by " + user.name + ".");
		} else {
			this.addModCommand("" + name + " was promoted to " + groupName + " by " + user.name + ".");
		}

		if (targetUser) targetUser.updateIdentity();
	},

	forcepromote: function (target, room, user) {
		// warning: never document this command in /help
		if (!this.can('forcepromote')) return false;
		target = this.splitTarget(target, true);
		var name = this.targetUsername;
		var nextGroup = target || Users.getNextGroupSymbol(' ', false);

		if (!Users.setOfflineGroup(name, nextGroup, true)) {
			return this.sendReply("/forcepromote - Don't forcepromote unless you have to.");
		}

		this.addModCommand("" + name + " was promoted to " + (Config.groups[nextGroup].name || "regular user") + " by " + user.name + ".");
	},

	deauth: function (target, room, user) {
		return this.parse('/demote ' + target + ', deauth');
	},

	modchat: function (target, room, user) {
		if (!target) return this.sendReply("Moderated chat is currently set to: " + room.modchat);
		if (!this.can('modchat', null, room)) return false;

		if (room.modchat && room.modchat.length <= 1 && Config.groupsranking.indexOf(room.modchat) > 1 && !user.can('modchatall', null, room)) {
			return this.sendReply("/modchat - Access denied for removing a setting higher than " + Config.groupsranking[1] + ".");
		}

		target = target.toLowerCase();
		var currentModchat = room.modchat;
		switch (target) {
		case 'off':
		case 'false':
		case 'no':
			room.modchat = false;
			break;
		case 'ac':
		case 'autoconfirmed':
			room.modchat = 'autoconfirmed';
			break;
		case '*':
		case 'player':
			target = '\u2605';
			// fallthrough
		default:
			if (!Config.groups[target]) {
				return this.parse('/help modchat');
			}
			if (Config.groupsranking.indexOf(target) > 1 && !user.can('modchatall', null, room)) {
				return this.sendReply("/modchat - Access denied for setting higher than " + Config.groupsranking[1] + ".");
			}
			room.modchat = target;
			break;
		}
		if (currentModchat === room.modchat) {
			return this.sendReply("Modchat is already set to " + currentModchat + ".");
		}
		if (!room.modchat) {
			this.add("|raw|<div class=\"broadcast-blue\"><b>Moderated chat was disabled!</b><br />Anyone may talk now.</div>");
		} else {
			var modchat = sanitize(room.modchat);
			this.add("|raw|<div class=\"broadcast-red\"><b>Moderated chat was set to " + modchat + "!</b><br />Only users of rank " + modchat + " and higher can talk.</div>");
		}
		this.logModCommand(user.name + " set modchat to " + room.modchat);

		if (room.chatRoomData) {
			room.chatRoomData.modchat = room.modchat;
			Rooms.global.writeChatRoomData();
		}
	},

	declare: function (target, room, user) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;

		if (!this.canTalk()) return;

		this.add('|raw|<div class="broadcast-blue"><b>' + sanitize(target) + '</b></div>');
		this.logModCommand(user.name + " declared " + target);
	},

	htmldeclare: function (target, room, user) {
		if (!target) return this.parse('/help htmldeclare');
		if (!this.can('gdeclare', null, room)) return false;

		if (!this.canTalk()) return;

		this.add('|raw|<div class="broadcast-blue"><b>' + target + '</b></div>');
		this.logModCommand(user.name + " declared " + target);
	},

	gdeclare: 'globaldeclare',
	globaldeclare: function (target, room, user) {
		if (!target) return this.parse('/help globaldeclare');
		if (!this.can('gdeclare')) return false;

		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b>' + target + '</b></div>');
		}
		this.logModCommand(user.name + " globally declared " + target);
	},

	cdeclare: 'chatdeclare',
	chatdeclare: function (target, room, user) {
		if (!target) return this.parse('/chatdeclare');
		if (!this.can('gdeclare')) return false;

		for (var id in Rooms.rooms) {
			if (id !== 'global') if (Rooms.rooms[id].type !== 'battle') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b>' + target + '</b></div>');
		}
		this.logModCommand(user.name + " globally declared (chat level) " + target);
	},

	wall: 'announce',
	announce: function (target, room, user) {
		if (!target) return this.parse('/help announce');

		if (!this.can('announce', null, room)) return false;

		target = this.canTalk(target);
		if (!target) return;

		return '/announce ' + target;
	},

	fr: 'forcerename',
	forcerename: function (target, room, user) {
		if (!target) return this.parse('/help forcerename');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		if (!this.can('forcerename', targetUser)) return false;

		if (targetUser.userid === toId(this.targetUser)) {
			var entry = targetUser.name + " was forced to choose a new name by " + user.name + (target ? ": " + target: "");
			this.privateModCommand("(" + entry + ")");
			Rooms.global.cancelSearch(targetUser);
			targetUser.resetName();
			targetUser.send("|nametaken||" + user.name + " has forced you to change your name. " + target);
		} else {
			this.sendReply("User " + targetUser.name + " is no longer using that name.");
		}
	},

	modlog: function (target, room, user, connection) {
		var lines = 0;
		// Specific case for modlog command. Room can be indicated with a comma, lines go after the comma.
		// Otherwise, the text is defaulted to text search in current room's modlog.
		var roomId = room.id;
		var roomLogs = {};

		if (target.indexOf(',') > -1) {
			var targets = target.split(',');
			target = targets[1].trim();
			roomId = toId(targets[0]) || room.id;
		}

		// Let's check the number of lines to retrieve or if it's a word instead
		if (!target.match('[^0-9]')) {
			lines = parseInt(target || 15, 10);
			if (lines > 100) lines = 100;
		}
		var wordSearch = (!lines || lines < 0);

		// Control if we really, really want to check all modlogs for a word.
		var roomNames = '';
		var filename = '';
		var command = '';
		if (roomId === 'all' && wordSearch) {
			if (!this.can('modlog')) return;
			roomNames = 'all rooms';
			// Get a list of all the rooms
			var fileList = fs.readdirSync('logs/modlog');
			for (var i = 0; i < fileList.length; ++i) {
				filename += 'logs/modlog/' + fileList[i] + ' ';
			}
		} else {
			if (!this.can('modlog', null, Rooms.get(roomId))) return;
			roomNames = 'the room ' + roomId;
			filename = 'logs/modlog/modlog_' + roomId + '.txt';
		}

		// Seek for all input rooms for the lines or text
		command = 'tail -' + lines + ' ' + filename;
		var grepLimit = 100;
		if (wordSearch) { // searching for a word instead
			if (target.match(/^["'].+["']$/)) target = target.substring(1, target.length - 1);
			command = "awk '{print NR,$0}' " + filename + " | sort -nr | cut -d' ' -f2- | grep -m" + grepLimit + " -i '" + target.replace(/\\/g, '\\\\\\\\').replace(/["'`]/g, '\'\\$&\'').replace(/[\{\}\[\]\(\)\$\^\.\?\+\-\*]/g, '[$&]') + "'";
		}

		// Execute the file search to see modlog
		require('child_process').exec(command, function (error, stdout, stderr) {
			if (error && stderr) {
				connection.popup("/modlog empty on " + roomNames + " or erred - modlog does not support Windows");
				console.log("/modlog error: " + error);
				return false;
			}
			if (lines) {
				if (!stdout) {
					connection.popup("The modlog is empty. (Weird.)");
				} else {
					connection.popup("Displaying the last " + lines + " lines of the Moderator Log of " + roomNames + ":\n\n" + stdout);
				}
			} else {
				if (!stdout) {
					connection.popup("No moderator actions containing '" + target + "' were found on " + roomNames + ".");
				} else {
					connection.popup("Displaying the last " + grepLimit + " logged actions containing '" + target + "' on " + roomNames + ":\n\n" + stdout);
				}
			}
		});
	},

	bw: 'banword',
	banword: function (target, room, user) {
		if (!this.can('declare')) return false;
		target = toId(target);
		if (!target) {
			return this.sendReply("Specify a word or phrase to ban.");
		}
		Users.addBannedWord(target);
		this.sendReply("Added '" + target + "' to the list of banned words.");
	},

	ubw: 'unbanword',
	unbanword: function (target, room, user) {
		if (!this.can('declare')) return false;
		target = toId(target);
		if (!target) {
			return this.sendReply("Specify a word or phrase to unban.");
		}
		Users.removeBannedWord(target);
		this.sendReply("Removed '" + target + "' from the list of banned words.");
	},

	/*********************************************************
	 * Server management commands
	 *********************************************************/

	hotpatch: function (target, room, user) {
		if (!target) return this.parse('/help hotpatch');
		if (!this.can('hotpatch')) return false;

		this.logEntry(user.name + " used /hotpatch " + target);

		if (target === 'chat' || target === 'commands') {

			try {
				CommandParser.uncacheTree('./command-parser.js');
				CommandParser = require('./command-parser.js');

				CommandParser.uncacheTree('./hangman.js');
				hangman = require('./hangman.js').hangman(hangman);

				var runningTournaments = Tournaments.tournaments;
				CommandParser.uncacheTree('./tournaments/frontend.js');
				Tournaments = require('./tournaments/frontend.js');
				Tournaments.tournaments = runningTournaments;

				return this.sendReply("Chat commands have been hot-patched.");
			} catch (e) {
				return this.sendReply("Something failed while trying to hotpatch chat: \n" + e.stack);
			}

		} else if (target === 'tournaments') {

			try {
				var runningTournaments = Tournaments.tournaments;
				CommandParser.uncacheTree('./tournaments/frontend.js');
				Tournaments = require('./tournaments/frontend.js');
				Tournaments.tournaments = runningTournaments;
				return this.sendReply("Tournaments have been hot-patched.");
			} catch (e) {
				return this.sendReply("Something failed while trying to hotpatch tournaments: \n" + e.stack);
			}

		} else if (target === 'battles') {

			Simulator.SimulatorProcess.respawn();
			return this.sendReply("Battles have been hotpatched. Any battles started after now will use the new code; however, in-progress battles will continue to use the old code.");

		} else if (target === 'formats') {
			try {
				// uncache the tools.js dependency tree
				CommandParser.uncacheTree('./tools.js');
				// reload tools.js
				Tools = require('./tools.js'); // note: this will lock up the server for a few seconds
				// rebuild the formats list
				Rooms.global.formatListText = Rooms.global.getFormatListText();
				// respawn validator processes
				TeamValidator.ValidatorProcess.respawn();
				// respawn simulator processes
				Simulator.SimulatorProcess.respawn();
				// broadcast the new formats list to clients
				Rooms.global.send(Rooms.global.formatListText);

				return this.sendReply("Formats have been hotpatched.");
			} catch (e) {
				return this.sendReply("Something failed while trying to hotpatch formats: \n" + e.stack);
			}

		} else if (target === 'learnsets') {
			try {
				// uncache the tools.js dependency tree
				CommandParser.uncacheTree('./tools.js');
				// reload tools.js
				Tools = require('./tools.js'); // note: this will lock up the server for a few seconds

				return this.sendReply("Learnsets have been hotpatched.");
			} catch (e) {
				return this.sendReply("Something failed while trying to hotpatch learnsets: \n" + e.stack);
			}

		}
		this.sendReply("Your hot-patch command was unrecognized.");
	},


	savelearnsets: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		fs.writeFile('data/learnsets.js', 'exports.BattleLearnsets = ' + JSON.stringify(BattleLearnsets) + ";\n");
		this.sendReply("learnsets.js saved.");
	},

	disableladder: function (target, room, user) {
		if (!this.can('disableladder')) return false;
		if (LoginServer.disabled) {
			return this.sendReply("/disableladder - Ladder is already disabled.");
		}
		LoginServer.disabled = true;
		this.logModCommand("The ladder was disabled by " + user.name + ".");
		this.add("|raw|<div class=\"broadcast-red\"><b>Due to high server load, the ladder has been temporarily disabled</b><br />Rated games will no longer update the ladder. It will be back momentarily.</div>");
	},

	enableladder: function (target, room, user) {
		if (!this.can('disableladder')) return false;
		if (!LoginServer.disabled) {
			return this.sendReply("/enable - Ladder is already enabled.");
		}
		LoginServer.disabled = false;
		this.logModCommand("The ladder was enabled by " + user.name + ".");
		this.add("|raw|<div class=\"broadcast-green\"><b>The ladder is now back.</b><br />Rated games will update the ladder now.</div>");
	},

	lockdown: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		Rooms.global.lockdown = true;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw("<div class=\"broadcast-red\"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>");
			if (Rooms.rooms[id].requestKickInactive && !Rooms.rooms[id].battle.ended) Rooms.rooms[id].requestKickInactive(user, true);
		}

		this.logEntry(user.name + " used /lockdown");

	},

	endlockdown: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Rooms.global.lockdown) {
			return this.sendReply("We're not under lockdown right now.");
		}
		Rooms.global.lockdown = false;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw("<div class=\"broadcast-green\"><b>The server shutdown was canceled.</b></div>");
		}

		this.logEntry(user.name + " used /endlockdown");

	},

	emergency: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		if (Config.emergency) {
			return this.sendReply("We're already in emergency mode.");
		}
		Config.emergency = true;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw("<div class=\"broadcast-red\">The server has entered emergency mode. Some features might be disabled or limited.</div>");
		}

		this.logEntry(user.name + " used /emergency");
	},

	endemergency: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Config.emergency) {
			return this.sendReply("We're not in emergency mode.");
		}
		Config.emergency = false;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw("<div class=\"broadcast-green\"><b>The server is no longer in emergency mode.</b></div>");
		}

		this.logEntry(user.name + " used /endemergency");
	},

	kill: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Rooms.global.lockdown) {
			return this.sendReply("For safety reasons, /kill can only be used during lockdown.");
		}

		if (CommandParser.updateServerLock) {
			return this.sendReply("Wait for /updateserver to finish before using /kill.");
		}

		for (var i in Sockets.workers) {
			Sockets.workers[i].kill();
		}

		if (!room.destroyLog) {
			process.exit();
			return;
		}
		room.destroyLog(function () {
			room.logEntry(user.name + " used /kill");
		}, function () {
			process.exit();
		});

		// Just in the case the above never terminates, kill the process
		// after 10 seconds.
		setTimeout(function () {
			process.exit();
		}, 10000);
	},

	loadbanlist: function (target, room, user, connection) {
		if (!this.can('hotpatch')) return false;

		connection.sendTo(room, "Loading ipbans.txt...");
		fs.readFile('config/ipbans.txt', function (err, data) {
			if (err) return;
			data = ('' + data).split('\n');
			var rangebans = [];
			for (var i = 0; i < data.length; ++i) {
				var line = data[i].split('#')[0].trim();
				if (!line) continue;
				if (line.indexOf('/') >= 0) {
					rangebans.push(line);
				} else if (line && !Users.bannedIps[line]) {
					Users.bannedIps[line] = '#ipban';
				}
			}
			Users.checkRangeBanned = Cidr.checker(rangebans);
			connection.sendTo(room, "ibans.txt has been reloaded.");
		});
	},

	refreshpage: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		Rooms.global.send('|refresh|');
		this.logEntry(user.name + " used /refreshpage");
	},

	updateserver: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply("/updateserver - Access denied.");
		}

		if (CommandParser.updateServerLock) {
			return this.sendReply("/updateserver - Another update is already in progress.");
		}

		CommandParser.updateServerLock = true;

		var logQueue = [];
		logQueue.push(user.name + " used /updateserver");

		connection.sendTo(room, "updating...");

		var exec = require('child_process').exec;
		exec('git diff-index --quiet HEAD --', function (error) {
			var cmd = 'git pull --rebase';
			if (error) {
				if (error.code === 1) {
					// The working directory or index have local changes.
					cmd = 'git stash && ' + cmd + ' && git stash pop';
				} else {
					// The most likely case here is that the user does not have
					// `git` on the PATH (which would be error.code === 127).
					connection.sendTo(room, "" + error);
					logQueue.push("" + error);
					logQueue.forEach(function (line) {
						room.logEntry(line);
					});
					CommandParser.updateServerLock = false;
					return;
				}
			}
			var entry = "Running `" + cmd + "`";
			connection.sendTo(room, entry);
			logQueue.push(entry);
			exec(cmd, function (error, stdout, stderr) {
				("" + stdout + stderr).split("\n").forEach(function (s) {
					connection.sendTo(room, s);
					logQueue.push(s);
				});
				logQueue.forEach(function (line) {
					room.logEntry(line);
				});
				CommandParser.updateServerLock = false;
			});
		});
	},

	crashfixed: function (target, room, user) {
		if (!Rooms.global.lockdown) {
			return this.sendReply('/crashfixed - There is no active crash.');
		}
		if (!this.can('hotpatch')) return false;

		Rooms.global.lockdown = false;
		if (Rooms.lobby) {
			Rooms.lobby.modchat = false;
			Rooms.lobby.addRaw("<div class=\"broadcast-green\"><b>We fixed the crash without restarting the server!</b><br />You may resume talking in the lobby and starting new battles.</div>");
		}
		this.logEntry(user.name + " used /crashfixed");
	},

	'memusage': 'memoryusage',
	memoryusage: function (target) {
		if (!this.can('hotpatch')) return false;
		target = toId(target) || 'all';
		if (target === 'all') {
			this.sendReply("Loading memory usage, this might take a while.");
		}
		if (target === 'all' || target === 'rooms' || target === 'room') {
			this.sendReply("Calculating Room size...");
			var roomSize = ResourceMonitor.sizeOfObject(Rooms);
			this.sendReply("Rooms are using " + roomSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'config') {
			this.sendReply("Calculating config size...");
			var configSize = ResourceMonitor.sizeOfObject(Config);
			this.sendReply("Config is using " + configSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'resourcemonitor' || target === 'rm') {
			this.sendReply("Calculating Resource Monitor size...");
			var rmSize = ResourceMonitor.sizeOfObject(ResourceMonitor);
			this.sendReply("The Resource Monitor is using " + rmSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'cmdp' || target === 'cp' || target === 'commandparser') {
			this.sendReply("Calculating Command Parser size...");
			var cpSize = ResourceMonitor.sizeOfObject(CommandParser);
			this.sendReply("Command Parser is using " + cpSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'sim' || target === 'simulator') {
			this.sendReply("Calculating Simulator size...");
			var simSize = ResourceMonitor.sizeOfObject(Simulator);
			this.sendReply("Simulator is using " + simSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'users') {
			this.sendReply("Calculating Users size...");
			var usersSize = ResourceMonitor.sizeOfObject(Users);
			this.sendReply("Users is using " + usersSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'tools') {
			this.sendReply("Calculating Tools size...");
			var toolsSize = ResourceMonitor.sizeOfObject(Tools);
			this.sendReply("Tools are using " + toolsSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'v8') {
			this.sendReply("Retrieving V8 memory usage...");
			var o = process.memoryUsage();
			this.sendReply(
				"Resident set size: " + o.rss + ", " + o.heapUsed + " heap used of " + o.heapTotal  + " total heap. "
				 + (o.heapTotal - o.heapUsed) + " heap left."
			);
			delete o;
		}
		if (target === 'all') {
			this.sendReply("Calculating Total size...");
			var total = (roomSize + configSize + rmSize + cpSize + simSize + toolsSize + usersSize) || 0;
			var units = ["bytes", "K", "M", "G"];
			var converted = total;
			var unit = 0;
			while (converted > 1024) {
				converted /= 1024;
				++unit;
			}
			converted = Math.round(converted);
			this.sendReply("Total memory used: " + converted + units[unit] + " (" + total + " bytes).");
		}
		return;
	},

	bash: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply("/bash - Access denied.");
		}

		var exec = require('child_process').exec;
		exec(target, function (error, stdout, stderr) {
			connection.sendTo(room, ("" + stdout + stderr));
		});
	},

	eval: function (target, room, user, connection, cmd, message) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply("/eval - Access denied.");
		}
		if (!this.canBroadcast()) return;

		if (!this.broadcasting) this.sendReply('||>> ' + target);
		try {
			var battle = room.battle;
			var me = user;
			this.sendReply('||<< ' + eval(target));
		} catch (e) {
			this.sendReply('||<< error: ' + e.message);
			var stack = '||' + ('' + e.stack).replace(/\n/g, '\n||');
			connection.sendTo(room, stack);
		}
	},

	evalbattle: function (target, room, user, connection, cmd, message) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply("/evalbattle - Access denied.");
		}
		if (!this.canBroadcast()) return;
		if (!room.battle) {
			return this.sendReply("/evalbattle - This isn't a battle room.");
		}

		room.battle.send('eval', target.replace(/\n/g, '\f'));
	},

       /*********************************************************
	 * Personal Server Commands
	 *********************************************************/
       shadow: 'shadow',
	shadow: function(target, room, user){
                if(!target) return this.sendReply('/shadow needs a target.');
                return this.parse('/me haunted u last night ' + target +'!');
    	},
       Blaze: 'blaze',
	blaze: function(target, room, user){
                if(!target) return this.sendReply('/blaze needs a target.');
                return this.parse('/me just burned ' + target +'!');
    	},
      news: 'news',
	greninjanews: function (target, room, user) {
		if (!target) return this.parse('/help globaldeclare');
		if (!this.can('news')) return false;

		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-green"><b>' + target + '</b></div>');
		}
		this.logModCommand(user.name + " globally declared the news " + target);
	},fav: 'favepoke',
		fave: 'favepoke',
		fp: 'favepoke',
		favpoke: 'favepoke',
		favepoke: function(target, room, user) {
                if(!target) return this.sendReply('You need to specify your favorite pokemon (If you want to).') 
				var BadWords = ['cunt', 'poop','fuck','shit','bitch','faggot', 'penis', 'vag', 'pen15', 'pen1s', 'cum', 'nigger', 'nigga', 'n1gger', 'n1gga', 'cock', 'dick', 'puta', 'clit', 'fucker', 'asshole', 'pussies', 'pussy', 'porn', 'p0rn', 'pimp', 'd!ck', 'slut', 'whore', 'wh0re', 'piss', 'vulva', 'peehole', 'boob', 'tit', 'b00b', 't1t', 'semen', 'sperm'];
				if (target.indexOf(BadWords) !== -1 || target.indexOf(' ') !== -1 || target.indexOf('~') !== -1 || target.indexOf('@') !== -1 || target.indexOf('%') !== -1) {
				return this.sendReply('That isn\'t a Pokemon you idiot.');
				}
				if (target.length > 10) {
                        return this.sendReply('That isn\'t a valid pokemon.');
                }
                var fav = target;
                var data = fs.readFileSync('config/favpokes.csv','utf8')
                var match = false;
                var line = '';
                var row = (''+data).split("\n");
                for (var i = row.length; i > -1; i--) {
                        if (!row[i]) continue;
                        var parts = row[i].split(",");
                        var userid = toUserid(parts[0]);
                        if (user.userid == userid) {
                        var x = target;
                        var fav = x;
                        match = true;
                        if (match === true) {
                                line = line + row[i];
                                break;
                        }
                        }
                }
                user.fav = fav;
				var proper = fav.substring(0,1).toUpperCase() + fav.substring(1,fav.length).toLowerCase();
                if (match === true) {
                        var re = new RegExp(line,"g");
                        fs.readFile('config/favpokes.csv', 'utf8', function (err,data) {
                        if (err) {
                                return console.log(err);
                        }
                        var result = data.replace(re, user.userid+','+proper);
                        fs.writeFile('config/favpokes.csv', result, 'utf8', function (err) {
                                if (err) return console.log(err);
                        });
                        });
                } else {
                        var log = fs.createWriteStream('config/favpokes.csv', {'flags': 'a'});
                        log.write("\n"+user.userid+','+proper);
                }
                this.sendReply('Your favorite pokemon has now been set as '+proper+'.');
                },
        
		
		place: 'location',
		location: function(target, room, user) {
                if(!target) return this.sendReply('You need to specify your favorite pokemon (If you want to).') 
				var BadWords = ['cunt', 'poop','fuck','shit','bitch','faggot', 'penis', 'vag', 'pen15', 'pen1s', 'cum', 'nigger', 'nigga', 'n1gger', 'n1gga', 'cock', 'dick', 'puta', 'clit', 'fucker', 'asshole', 'pussies', 'pussy', 'porn', 'p0rn', 'pimp', 'd!ck', 'slut', 'whore', 'wh0re', 'piss', 'vulva', 'peehole', 'boob', 'tit', 'b00b', 't1t', 'semen', 'sperm'];
				if (target.indexOf(BadWords) !== -1 || target.indexOf('~') !== -1 || target.indexOf('@') !== -1 || target.indexOf('%') !== -1) {
				return this.sendReply('That isn\'t a valid location.');
				}
				if (target.length < 3) {
                        return this.sendReply('That isn\'t a valid location.');
                }
                var location = target;
                var data = fs.readFileSync('config/location.csv','utf8')
                var match = false;
                var line = '';
                var row = (''+data).split("\n");
                for (var i = row.length; i > -1; i--) {
                        if (!row[i]) continue;
                        var parts = row[i].split(",");
                        var userid = toUserid(parts[0]);
                        if (user.userid == userid) {
                        var x = target;
                        var location = x;
                        match = true;
                        if (match === true) {
                                line = line + row[i];
                                break;
                        }
                        }
                }
                user.location = location;
				//var proper = fav.substring(0,1).toUpperCase() + fav.substring(1,fav.length).toLowerCase();
                if (match === true) {
                        var re = new RegExp(line,"g");
                        fs.readFile('config/location.csv', 'utf8', function (err,data) {
                        if (err) {
                                return console.log(err);
                        }
                        var result = data.replace(re, user.userid+','+location);
                        fs.writeFile('config/location.csv', result, 'utf8', function (err) {
                                if (err) return console.log(err);
                        });
                        });
                } else {
                        var log = fs.createWriteStream('config/location.csv', {'flags': 'a'});
                        log.write("\n"+user.userid+','+location);
                }
                this.sendReply('Your location has now been set as '+location+'.');
                },
 
	/*********************************************************
	 * Battle commands
	 *********************************************************/

	concede: 'forfeit',
	surrender: 'forfeit',
	forfeit: function (target, room, user) {
		if (!room.battle) {
			return this.sendReply("There's nothing to forfeit here.");
		}
		if (!room.forfeit(user)) {
			return this.sendReply("You can't forfeit this battle.");
		}
	},

	savereplay: function (target, room, user, connection) {
		if (!room || !room.battle) return;
		var logidx = 2; // spectator log (no exact HP)
		if (room.battle.ended) {
			// If the battle is finished when /savereplay is used, include
			// exact HP in the replay log.
			logidx = 3;
		}
		var data = room.getLog(logidx).join("\n");
		var datahash = crypto.createHash('md5').update(data.replace(/[^(\x20-\x7F)]+/g, '')).digest('hex');

		LoginServer.request('prepreplay', {
			id: room.id.substr(7),
			loghash: datahash,
			p1: room.p1.name,
			p2: room.p2.name,
			format: room.format
		}, function (success) {
			if (success && success.errorip) {
				connection.popup("This server's request IP " + success.errorip + " is not a registered server.");
				return;
			}
			connection.send('|queryresponse|savereplay|' + JSON.stringify({
				log: data,
				id: room.id.substr(7)
			}));
		});
	},

	mv: 'move',
	attack: 'move',
	move: function (target, room, user) {
		if (!room.decision) return this.sendReply("You can only do this in battle rooms.");

		room.decision(user, 'choose', 'move ' + target);
	},

	sw: 'switch',
	switch: function (target, room, user) {
		if (!room.decision) return this.sendReply("You can only do this in battle rooms.");

		room.decision(user, 'choose', 'switch ' + parseInt(target, 10));
	},

	choose: function (target, room, user) {
		if (!room.decision) return this.sendReply("You can only do this in battle rooms.");

		room.decision(user, 'choose', target);
	},

	undo: function (target, room, user) {
		if (!room.decision) return this.sendReply("You can only do this in battle rooms.");

		room.decision(user, 'undo', target);
	},

	team: function (target, room, user) {
		if (!room.decision) return this.sendReply("You can only do this in battle rooms.");

		room.decision(user, 'choose', 'team ' + target);
	},

	joinbattle: function (target, room, user) {
		if (!room.joinBattle) return this.sendReply("You can only do this in battle rooms.");
		if (!user.can('joinbattle', null, room)) return this.popupReply("You must be a roomvoice to join a battle you didn't start. Ask a player to use /roomvoice on you to join this battle.");

		room.joinBattle(user);
	},

	partbattle: 'leavebattle',
	leavebattle: function (target, room, user) {
		if (!room.leaveBattle) return this.sendReply("You can only do this in battle rooms.");

		room.leaveBattle(user);
	},

	kickbattle: function (target, room, user) {
		if (!room.leaveBattle) return this.sendReply("You can only do this in battle rooms.");

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		if (!this.can('kick', targetUser)) return false;

		if (room.leaveBattle(targetUser)) {
			this.addModCommand("" + targetUser.name + " was kicked from a battle by " + user.name + (target ? " (" + target + ")" : ""));
		} else {
			this.sendReply("/kickbattle - User isn't in battle.");
		}
	},

	kickinactive: function (target, room, user) {
		if (room.requestKickInactive) {
			room.requestKickInactive(user);
		} else {
			this.sendReply("You can only kick inactive players from inside a room.");
		}
	},

	timer: function (target, room, user) {
		target = toId(target);
		if (room.requestKickInactive) {
			if (target === 'off' || target === 'false' || target === 'stop') {
				room.stopKickInactive(user, user.can('timer'));
			} else if (target === 'on' || target === 'true' || !target) {
				room.requestKickInactive(user, user.can('timer'));
			} else {
				this.sendReply("'" + target + "' is not a recognized timer state.");
			}
		} else {
			this.sendReply("You can only set the timer from inside a room.");
		}
	},

	autotimer: 'forcetimer',
	forcetimer: function (target, room, user) {
		target = toId(target);
		if (!this.can('autotimer')) return;
		if (target === 'off' || target === 'false' || target === 'stop') {
			Config.forcetimer = false;
			this.addModCommand("Forcetimer is now OFF: The timer is now opt-in. (set by " + user.name + ")");
		} else if (target === 'on' || target === 'true' || !target) {
			Config.forcetimer = true;
			this.addModCommand("Forcetimer is now ON: All battles will be timed. (set by " + user.name + ")");
		} else {
			this.sendReply("'" + target + "' is not a recognized forcetimer setting.");
		}
	},

	forcetie: 'forcewin',
	forcewin: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!room.battle) {
			this.sendReply("/forcewin - This is not a battle room.");
			return false;
		}

		room.battle.endType = 'forced';
		if (!target) {
			room.battle.tie();
			this.logModCommand(user.name + " forced a tie.");
			return false;
		}
		target = Users.get(target);
		if (target) target = target.userid;
		else target = '';

		if (target) {
			room.battle.win(target);
			this.logModCommand(user.name + " forced a win for " + target + ".");
		}

	},model: 'sprite',
sprite: function(target, room, user) {
        if (!this.canBroadcast()) return;
		var targets = target.split(',');
			target = targets[0];
				target1 = targets[1];
if (target.toLowerCase().indexOf(' ') !== -1) {
target.toLowerCase().replace(/ /g,'-');
}
        if (target.toLowerCase().length < 4) {
        return this.sendReply('Model not found.');
        }
		var numbers = ['1','2','3','4','5','6','7','8','9','0'];
		for (var i = 0; i < numbers.length; i++) {
		if (target.toLowerCase().indexOf(numbers) == -1 && target.toLowerCase() !== 'porygon2') {
        
        

		if (target && !target1) {
        return this.sendReply('|html|<img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/'+target.toLowerCase().trim().replace(/ /g,'-')+'.gif">');
        }
	if (toId(target1) == 'back' || toId(target1) == 'shiny' || toId(target1) == 'front') {
		if (target && toId(target1) == 'back') {
        return this.sendReply('|html|<img src = "http://play.pokemonshowdown.com/sprites/xyani-back/'+target.toLowerCase().trim().replace(/ /g,'-')+'.gif">');
		}
		if (target && toId(target1) == 'shiny') {
        return this.sendReply('|html|<img src = "http://play.pokemonshowdown.com/sprites/xyani-shiny/'+target.toLowerCase().trim().replace(/ /g,'-')+'.gif">');
		}
		if (target && toId(target1) == 'front') {
        return this.sendReply('|html|<img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/'+target.toLowerCase().trim().replace(/ /g,'-')+'.gif">');
	}
	}

	} else {
	return this.sendReply('Model not found.');
	}
	}
	},


	spy: function(target, room, user) {
	if (!user.can('hotpatch')) return false;
	if (!target) {
	this.sendReply('You need a target to spy on!');
	}
	target = this.splitTarget(target);
			var targetUser = this.targetUser;

		if (!targetUser) {
		return this.sendReply('/spy [user] - spies on the user\'s PMs.');
		}
		if (targetUser.spy == true) {
	return this.sendReply("This user is already being spied on");
	}
		this.sendReply(targetUser.name+ ' is now being spied on');
		targetUser.spy = true;
		},

	logout: function(target, room, user) {
		user.resetName();
	},stafflist: function (target, room, user, connection) {
            var buffer = [];
            var admins = [];
            var leaders = [];
            var mods = [];
            var drivers = [];
            var voices = [];
 
            admins2 = '';
            leaders2 = '';
            mods2 = '';
            drivers2 = '';
            voices2 = '';
            stafflist = fs.readFileSync('config/usergroups.csv', 'utf8');
            stafflist = stafflist.split('\n');
            for (var u in stafflist) {
                line = stafflist[u].split(',');
                if (line[1] == '~') {
                    admins2 = admins2 + line[0] + ',';
                }
                if (line[1] == '&') {
                    leaders2 = leaders2 + line[0] + ',';
                }
                if (line[1] == '@') {
                    mods2 = mods2 + line[0] + ',';
                }
                if (line[1] == '%') {
                    drivers2 = drivers2 + line[0] + ',';
                }
                if (line[1] == '+') {
                    voices2 = voices2 + line[0] + ',';
                }
            }
            admins2 = admins2.split(',');
            leaders2 = leaders2.split(',');
            mods2 = mods2.split(',');
            drivers2 = drivers2.split(',');
            voices2 = voices2.split(',');
            for (var u in admins2) {
                if (admins2[u] != '') admins.push(admins2[u]);
            }
            for (var u in leaders2) {
                if (leaders2[u] != '') leaders.push(leaders2[u]);
            }
            for (var u in mods2) {
                if (mods2[u] != '') mods.push(mods2[u]);
            }
            for (var u in drivers2) {
                if (drivers2[u] != '') drivers.push(drivers2[u]);
            }
            for (var u in voices2) {
                if (voices2[u] != '') voices.push(voices2[u]);
            }
            if (admins.length > 0) {
                admins = admins.join(', ');
            }
            if (leaders.length > 0) {
                leaders = leaders.join(', ');
            }
            if (mods.length > 0) {
                mods = mods.join(', ');
            }
            if (drivers.length > 0) {
                drivers = drivers.join(', ');
            }
            if (voices.length > 0) {
                voices = voices.join(', ');
            }
            connection.popup('Administrators: \n--------------------\n' + admins + '\n\nLeaders:\n-------------------- \n' + leaders + '\n\nModerators:\n-------------------- \n' + mods + '\n\nDrivers: \n--------------------\n' + drivers + '\n\nVoices:\n-------------------- \n' + voices);
},

	/*********************************************************
	 * Challenging and searching commands
	 *********************************************************/

	cancelsearch: 'search',
	search: function (target, room, user) {
		if (target) {
			if (Config.pmmodchat) {
				var userGroup = user.group;
				if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(Config.pmmodchat)) {
					var groupName = Config.groups[Config.pmmodchat].name || Config.pmmodchat;
					this.popupReply("Because moderated chat is set, you must be of rank " + groupName + " or higher to search for a battle.");
					return false;
				}
			}
			Rooms.global.searchBattle(user, target);
		} else {
			Rooms.global.cancelSearch(user);
		}
	},

	chall: 'challenge',
	challenge: function (target, room, user, connection) {
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.popupReply("The user '" + this.targetUsername + "' was not found.");
		}
		if (targetUser.blockChallenges && !user.can('bypassblocks', targetUser)) {
			return this.popupReply("The user '" + this.targetUsername + "' is not accepting challenges right now.");
		}
		if (Config.pmmodchat) {
			var userGroup = user.group;
			if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(Config.pmmodchat)) {
				var groupName = Config.groups[Config.pmmodchat].name || Config.pmmodchat;
				this.popupReply("Because moderated chat is set, you must be of rank " + groupName + " or higher to challenge users.");
				return false;
			}
		}
		user.prepBattle(target, 'challenge', connection, function (result) {
			if (result) user.makeChallenge(targetUser, target);
		});
	},

	blck: 'blockchallenges',
	idle: 'blockchallenges',
	blockchallenges: function (target, room, user) {
		user.blockChallenges = true;
		this.sendReply("You are now blocking all incoming challenge requests.");
	},

	alow: 'allowchallenges',
	allowchallenges: function (target, room, user) {
		user.blockChallenges = false;
		this.sendReply("You are available for challenges from now on.");
	},

	cchall: 'cancelChallenge',
	cancelchallenge: function (target, room, user) {
		user.cancelChallengeTo(target);
	},

	accept: function (target, room, user, connection) {
		var userid = toId(target);
		var format = '';
		if (user.challengesFrom[userid]) format = user.challengesFrom[userid].format;
		if (!format) {
			this.popupReply(target + " cancelled their challenge before you could accept it.");
			return false;
		}
		user.prepBattle(format, 'challenge', connection, function (result) {
			if (result) user.acceptChallengeFrom(userid);
		});
	},

	reject: function (target, room, user) {
		user.rejectChallengeFrom(toId(target));
	},

	saveteam: 'useteam',
	utm: 'useteam',
	useteam: function (target, room, user) {
		user.team = target;
	},

	/*********************************************************
	 * Low-level
	 *********************************************************/

	cmd: 'query',
	query: function (target, room, user, connection) {
		// Avoid guest users to use the cmd errors to ease the app-layer attacks in emergency mode
		var trustable = (!Config.emergency || (user.named && user.authenticated));
		if (Config.emergency && ResourceMonitor.countCmd(connection.ip, user.name)) return false;
		var spaceIndex = target.indexOf(' ');
		var cmd = target;
		if (spaceIndex > 0) {
			cmd = target.substr(0, spaceIndex);
			target = target.substr(spaceIndex + 1);
		} else {
			target = '';
		}
		if (cmd === 'userdetails') {

			var targetUser = Users.get(target);
			if (!trustable || !targetUser) {
				connection.send('|queryresponse|userdetails|' + JSON.stringify({
					userid: toId(target),
					rooms: false
				}));
				return false;
			}
			var roomList = {};
			for (var i in targetUser.roomCount) {
				if (i === 'global') continue;
				var targetRoom = Rooms.get(i);
				if (!targetRoom || targetRoom.isPrivate) continue;
				var roomData = {};
				if (targetRoom.battle) {
					var battle = targetRoom.battle;
					roomData.p1 = battle.p1 ? ' ' + battle.p1 : '';
					roomData.p2 = battle.p2 ? ' ' + battle.p2 : '';
				}
				roomList[i] = roomData;
			}
			if (!targetUser.roomCount['global']) roomList = false;
			var userdetails = {
				userid: targetUser.userid,
				avatar: targetUser.avatar,
				rooms: roomList
			};
			if (user.can('ip', targetUser)) {
				var ips = Object.keys(targetUser.ips);
				if (ips.length === 1) {
					userdetails.ip = ips[0];
				} else {
					userdetails.ips = ips;
				}
			}
			connection.send('|queryresponse|userdetails|' + JSON.stringify(userdetails));

		} else if (cmd === 'roomlist') {
			if (!trustable) return false;
			connection.send('|queryresponse|roomlist|' + JSON.stringify({
				rooms: Rooms.global.getRoomList(true)
			}));

		} else if (cmd === 'rooms') {
			if (!trustable) return false;
			connection.send('|queryresponse|rooms|' + JSON.stringify(
				Rooms.global.getRooms()
			));

		}
	},

	trn: function (target, room, user, connection) {
		var commaIndex = target.indexOf(',');
		var targetName = target;
		var targetAuth = false;
		var targetToken = '';
		if (commaIndex >= 0) {
			targetName = target.substr(0, commaIndex);
			target = target.substr(commaIndex + 1);
			commaIndex = target.indexOf(',');
			targetAuth = target;
			if (commaIndex >= 0) {
				targetAuth = !!parseInt(target.substr(0, commaIndex), 10);
				targetToken = target.substr(commaIndex + 1);
			}
		}
		user.rename(targetName, targetToken, targetAuth, connection);
	},

};

