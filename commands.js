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
 var fs = require('fs');
var code = fs.createWriteStream('config/friendcodes.txt',{'flags':'a'});
var studiouser = fs.createWriteStream('config/studiopermissions.txt',{'flags':'a'});
var key = '';
var hint = '';
var isMotd = false;
var inShop = ['symbol', 'custom', 'animated', 'room', 'trainer', 'fix', 'declare', 'badge', 'potd', 'musicbox', 'vip'];
var closeShop = false
var closedShop = 0;
var bank = exports.bank = {
			bucks: function(uid, amount, take) {
			   	var data = fs.readFileSync('config/money.csv','utf8')
				var match = false;
				var money = 0;
				var row = (''+data).split("\n");
				var line = '';
				for (var i = row.length; i > -1; i--) {
					if (!row[i]) continue;
					var parts = row[i].split(",");
					var userid = toId(parts[0]);
					if (uid.userid == userid) {
						var x = Number(parts[1]);
						var money = x;
						match = true;
						if (match === true) {
							line = line + row[i];
							break;
						}
					}
				}
				uid.money = money;
				if (take === true){if (amount <= uid.money){
				uid.money = uid.money - amount; take = false;}
				else return false;
				}
				else {uid.money = uid.money + amount;}
				if (match === true) {
					var re = new RegExp(line,"g");
					fs.readFile('config/money.csv', 'utf8', function (err,data) {
					if (err) {
						return console.log(err);
					}
					var result = data.replace(re, uid.userid+','+uid.money);
					fs.writeFile('config/money.csv', result, 'utf8', function (err) {
						if (err) return console.log(err);
					});
					});
				} else {
					var log = fs.createWriteStream('config/money.csv', {'flags': 'a'});
					log.write("\n"+uid.userid+','+uid.money);
				}
				return true;
				},

	    coins: function(uid, amount, take) {

	    var lore = fs.readFileSync('config/coins.csv','utf8')
                var match = false;
                var coins = 0;
                var spag = (''+lore).split("\n");
                var hetti = '';
                for (var i = spag.length; i > -1; i--) {
                    if (!spag[i]) continue;
                    var parts = spag[i].split(",");
                    var userid = toId(parts[0]);
					if (uid.userid == userid) {
                        var x = Number(parts[1]);
                        var coins = x;
                        match = true;
                        if (match === true) {
                            hetti = hetti + spag[i];
                            break;
                        }
                    }
                }
                uid.coins = coins;
		if (take === true){if (amount <= uid.coins){
				uid.coins = uid.coins - amount; take = false;}
				else return false;
				}
				else {uid.coins = uid.coins + amount;}

                if (match === true) {
                    var be = new RegExp(hetti,"g");
                    fs.readFile('config/coins.csv', 'utf8', function (err,lore) {
                        if (err) {
                            return console.log(err);
                        }
                        var result = lore.replace(be, uid.userid+','+uid.coins);
                        fs.writeFile('config/coins.csv', result, 'utf8', function (err) {
                            if (err) return console.log(err);
                        });
                    });
                } else {
                    var log = fs.createWriteStream('config/coins.csv', {'flags': 'a'});
                    log.write("\n"+uid.userid+','+uid.coins);
                } return true;
		}


	}
	var economy = exports.economy = {
		writeMoney: function(uid, amount) {
			var data = fs.readFileSync('config/money.csv','utf8')
			var match = false;
			var money = 0;
			var row = (''+data).split("\n");
			var line = '';
			for (var i = row.length; i > -1; i--) {
				if (!row[i]) continue;
				var parts = row[i].split(",");
				var userid = toId(parts[0]);
				if (uid.userid == userid) {
					var x = Number(parts[1]);
					var money = x;
					match = true;
					if (match === true) {
						line = line + row[i];
						break;
					}
				}
			}
			uid.money = money;
			uid.money = uid.money + amount;
			if (match === true) {
				var re = new RegExp(line,"g");
				fs.readFile('config/money.csv', 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				var result = data.replace(re, uid.userid+','+uid.money);
				fs.writeFile('config/money.csv', result, 'utf8', function (err) {
					if (err) return console.log(err);
				});
				});
			} else {
				var log = fs.createWriteStream('config/money.csv', {'flags': 'a'});
				log.write("\n"+uid.userid+','+uid.money);
			}
		},
	}
var ipbans = fs.createWriteStream('config/ipbans.txt', {'flags': 'a'});
var avatar = fs.createWriteStream('config/avatars.csv', {'flags': 'a'});
//spamroom
if (typeof spamroom == "undefined") {
	spamroom = new Object();
}
if (!Rooms.rooms.spamroom) {
	Rooms.rooms.spamroom = new Rooms.ChatRoom("spamroom", "spamroom");
	Rooms.rooms.spamroom.isPrivate = true;
}

//tells
if (typeof tells === 'undefined') {
	tells = {};
}

var crypto = require('crypto');
var poofeh = true;
/*
var aList = ["kupo","freddycakes","corn","stevoduhhero","fallacie","fallacies","imanalt",
		"ipad","orivexes","treecko","theimmortal","talktakestime","oriv","v4",
		"jac","geminiiii", "lepandaw", "cattelite","foe"];
*/
var canTalk;
var fs = require('fs');

const MAX_REASON_LENGTH = 300;

var commands = exports.commands = {
	/**** normal stuff ****/
	random: 'pickrandom',
	pickrandom: function (target, room, user) {
		if (!target) return this.sendReply('/pickrandom [option 1], [option 2], ... - Randomly chooses one of the given options.');
		if (!this.canBroadcast()) return;
		var targets;
		if (target.indexOf(',') === -1) {
			targets = target.split(' ');
		} else {
			targets = target.split(',');
		};
		var result = Math.floor(Math.random() * targets.length);
		return this.sendReplyBox(targets[result].trim());
	},	
	version: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox("Server version: <b>" + CommandParser.package.version + "</b>");
	},
	customavatar: 'ca',
	ca: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<b>Custom Avatars</b> - In order to get a custom avatar, you must buy it from the shop.  For more information, do /shop.');
      },
	roomid: 'room',
	room: function(target, room, user) {
        	if (!this.canBroadcast()) return;
        	this.sendReplyBox('You are currently in the room "<b>'+room.id+'</b>".');
	},
	me: function (target, room, user, connection) {
		// By default, /me allows a blank message
		if (target) target = this.canTalk(target);
		if (!target) return;

		var message = '/me ' + target;
		// if user is not in spamroom
		if (spamroom[user.userid] === undefined) {
			// check to see if an alt exists in list
			for (var u in spamroom) {
				if (Users.get(user.userid) === Users.get(u)) {
					// if alt exists, add new user id to spamroom, break out of loop.
					spamroom[user.userid] = true;
					break;
				}
			}
		}

		if (user.userid in spamroom) {
			this.sendReply('|c|' + user.getIdentity() + '|' + message);
			return Rooms.rooms['spamroom'].add('|c|' + user.getIdentity() + '|' + message);
		} else {
			return message;
		}
	 },
	mee: function (target, room, user, connection) {
		// By default, /mee allows a blank message
		if (target) target = this.canTalk(target);
		if (!target) return;

		var message = '/mee ' + target;
		// if user is not in spamroom
		if (spamroom[user.userid] === undefined) {
			// check to see if an alt exists in list
			for (var u in spamroom) {
				if (Users.get(user.userid) === Users.get(u)) {
					// if alt exists, add new user id to spamroom, break out of loop.
					spamroom[user.userid] = true;
					break;
				}
			}
		}

		if (user.userid in spamroom) {
			this.sendReply('|c|' + user.getIdentity() + '|' + message);
			return Rooms.rooms['spamroom'].add('|c|' + user.getIdentity() + '|' + message);
		} else {
			return message;
		}
	},

	spop: 'sendpopup',
	sendpopup: function(target, room, user) {
		if (!this.can('hotpatch')) return false;
		
		target = this.splitTarget(target);
		var targetUser = this.targetUser;

		if (!targetUser) return this.sendReply('/sendpopup [user], [message] - You missed the user');
		if (!target) return this.sendReply('/sendpopup [user], [message] - You missed the message');

		targetUser.popup(target);
		this.sendReply(targetUser.name + ' got the message as popup: ' + target);
		
		targetUser.send(user.name+' sent a popup message to you.');
		
		this.logModCommand(user.name+' send a popup message to '+targetUser.name);
	},
	cs: 'customsymbol',
	customsymbol: function(target, room, user) {
		if(!user.canCustomSymbol) return this.sendReply('You don\'t have the permission to use this command.');
  		//var free = true;
  		if (user.hasCustomSymbol) return this.sendReply('You currently have a custom symbol, use /resetsymbol if you would like to use this command again.');
 		if (!this.canTalk()) return;
  		//if (!free) return this.sendReply('Sorry, we\'re not currently giving away FREE custom symbols at the moment.');
  		if(!target || target.length > 1) return this.sendReply('/customsymbol [symbol] - changes your symbol (usergroup) to the specified symbol. The symbol can only be one character');
  		var a = target;
  		if (a === "+" || a === "$" || a === "%" || a === "@" || a === "&" || a === "~" || a === "#" || a === "a" || a === "b" || a === "c" || a === "d" || a === "e" || a === "f" || a === "g" || a === "h" || a === "i" || a === "j" || a === "k" || a === "l" || a === "m" || a === "n" || a === "o" || a === "p" || a === "q" || a === "r" || a === "s" || a === "t" || a === "u" || a === "v" || a === "w" || a === "x" || a === "y" || a === "z" || a === "A" || a === "B" || a === "C" || a === "D" || a === "E" || a === "F" || a === "G" || a === "H" || a === "I" || a === "J" || a === "K" || a === "L" || a === "M" || a === "N" || a === "O" || a === "P" || a === "Q" || a === "R" || a === "S" || a === "T" || a === "U" || a === "V" || a === "W" || a === "X" || a === "Y" || a === "Z" || a === "0" || a === "1" || a === "2" || a === "3" || a === "4" || a === "5" || a === "6" || a === "7" || a === "8" || a === "9" || a === "ÃƒÂ¥Ã‚ÂÃ‚Â" ) {
  			return this.sendReply('Sorry, but you cannot change your symbol to this for safety/stability reasons.');
  		}
  		user.getIdentity = function(){
  			if(this.muted)	return '!' + this.name;
  			if(this.locked) return 'ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â½' + this.name;
  			return target + this.name;
  		};
  		user.updateIdentity();
  		user.canCustomSymbol = false;
  		user.hasCustomSymbol = true;
  	},
  	rs: 'resetsymbol',
	resetsymbol: function(target, room, user) {
		if (!user.hasCustomSymbol) return this.sendReply('You don\'t have a custom symbol!');
		user.getIdentity = function() {
			if (this.muted) return '!' + this.name;
			if (this.locked) return 'ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â½' + this.name;
			return this.group + this.name;
		};
		user.hasCustomSymbol = false;
		delete user.getIdentity;
		user.updateIdentity();
		this.sendReply('Your symbol has been reset.');
	},
//Money Commands...

	wallet: 'atm',
        satchel: 'atm',
        fannypack: 'atm',
        purse: 'atm',
        bag: 'atm',
        atm: function(target, room, user, connection, cmd) {
        if (!this.canBroadcast()) return;
        var mMatch = false;
        var money = 0;
        var total = '';
        if (!target) {
        var data = fs.readFileSync('config/money.csv','utf8')
                var row = (''+data).split("\n");
                for (var i = row.length; i > -1; i--) {
                        if (!row[i]) continue;
                        var parts = row[i].split(",");
                        var userid = toId(parts[0]);
                        if (user.userid == userid) {
                        var x = Number(parts[1]);
                        var money = x;
                        mMatch = true;
                        if (mMatch === true) {
                                break;
                        }
                        }
                }
                if (mMatch === true) {
                        var p = 'Coolbucks';
                        if (money < 2) p = 'Coolbucks';
                        total += user.name + ' has ' + money + ' ' + p + '.<br />';
                }
                if (mMatch === false) {
                        total += 'You have no Coolbucks.<br />';
                }
                user.money = money;
        } else {
                var data = fs.readFileSync('config/money.csv','utf8')
                target = this.splitTarget(target);
                var targetUser = this.targetUser;
                if (!targetUser) {
                        return this.sendReply('User '+this.targetUsername+' not found.');
                }
                var money = 0;
                var row = (''+data).split("\n");
                for (var i = row.length; i > -1; i--) {
                        if (!row[i]) continue;
                        var parts = row[i].split(",");
                        var userid = toId(parts[0]);
                        if (targetUser.userid == userid || target == userid) {
                        var x = Number(parts[1]);
                        var money = x;
                        mMatch = true;
                        if (mMatch === true) {
                                break;
                        }
                        }
                }
                if (mMatch === true) {
                        var p = 'Coolbucks';
                        if (money < 2) p = 'Coolbuck';
                        total += targetUser.name + ' has ' + money + ' ' + p + '.<br />';
                } 
                if (mMatch === false) {
                        total += targetUser.name + ' has  no Coolbucks.<br />';
                }
                targetUser.money = money;
                                }
        return this.sendReplyBox('<b>Cool Wallet~</b><br>'+total+'');
        },
	
	awardbucks: 'givebucks',
	gb: 'givebucks',
	givebucks: function(target, room, user) {
		if(!user.can('pban')) return this.sendReply('You do not have enough authority to do this.');
		if(!target) return this.parse('/help givebucks');
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
		var giveMoney = Number(cleanedUp);
		var data = fs.readFileSync('config/money.csv','utf8')
		var match = false;
		var money = 0;
		var line = '';
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toId(parts[0]);
			if (targetUser.userid == userid) {
			var x = Number(parts[1]);
			var money = x;
			match = true;
			if (match === true) {
				line = line + row[i];
				break;
			}
			}
		}
		targetUser.money = money;
		targetUser.money += giveMoney;
		if (match === true) {
			var re = new RegExp(line,"g");
			fs.readFile('config/money.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, targetUser.userid+','+targetUser.money);
			fs.writeFile('config/money.csv', result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
			});
		} else {
			var log = fs.createWriteStream('config/money.csv', {'flags': 'a'});
			log.write("\n"+targetUser.userid+','+targetUser.money);
		}
		var p = 'bucks';
		if (giveMoney < 2) p = 'buck';
		this.sendReply(targetUser.name + ' was given ' + giveMoney + ' ' + p + '. This user now has ' + targetUser.money + ' bucks.');
		targetUser.send(user.name + ' has given you ' + giveMoney + ' ' + p + '.');
		} else {
			return this.parse('/help givebucks');
		}
	},
	tb: 'transferbucks',
	transferbucks: function(target, room, user) {
		if(!target) return this.sendReply('|raw|Correct Syntax: /transferbucks <i>user</i>, <i>amount</i>');
		if (target.indexOf(',') >= 0) {
			var parts = target.split(',');
			if (parts[0].toLowerCase() === user.name.toLowerCase()) {
				return this.sendReply('You can\'t transfer Bucks to yourself.');
			}
			parts[0] = this.splitTarget(parts[0]);
			var targetUser = this.targetUser;
		}
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (isNaN(parts[1])) {
			return this.sendReply('Very funny, now use a real number.');
		}
		if (parts[1] < 0) {
			return this.sendReply('Number cannot be negative.');
		}
		if (parts[1] == 0) {
			return this.sendReply('No! You cannot transfer 0 bucks, you fool!');
		}
		if (String(parts[1]).indexOf('.') >= 0) {
			return this.sendReply('You cannot transfer numbers with decimals.');
		}
		if (parts[1] > user.money) {
			return this.sendReply('You cannot transfer more money than what you have.');
		}
		var p = 'Bucks';
		var cleanedUp = parts[1].trim();
		var transferMoney = Number(cleanedUp);
		if (transferMoney === 1) {
			p = 'Buck';
		}
		economy.writeMoney(user, -transferMoney);
		//set time delay because of node asynchronous so it will update both users' money instead of either updating one or the other
		setTimeout(function(){economy.writeMoney(targetUser, transferMoney);fs.appendFile('logs/transactions.log','\n'+Date()+': '+user.name+' has transferred '+transferMoney+' '+p+' to ' + targetUser.name + '. ' +  user.name +' now has '+user.money + ' ' + p + ' and ' + targetUser.name + ' now has ' + targetUser.money +' ' + p +'.');},3000);
		this.sendReply('You have successfully transferred ' + transferMoney + ' to ' + targetUser.name + '. You now have ' + user.money + ' ' + p + '.');
		targetUser.popup(user.name + ' has transferred ' + transferMoney + ' ' +  p + ' to you.');
		this.logModCommand('('+user.name+'  has transferred ' + transferMoney + ' ' +  p + ' to ' + targetUser.name + '.)');
	},
		
	takebucks: 'removebucks',
	removebucks: function(target, room, user) {
		if(!user.can('pban')) return this.sendReply('You do not have enough authority to do this.');
		if(!target) return this.parse('/help removebucks');
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
		var takeMoney = Number(cleanedUp);
		var data = fs.readFileSync('config/money.csv','utf8')
		var match = false;
		var money = 0;
		var line = '';
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toId(parts[0]);
			if (targetUser.userid == userid) {
			var x = Number(parts[1]);
			var money = x;
			match = true;
			if (match === true) {
				line = line + row[i];
				break;
			}
			}
		}
		targetUser.money = money;
		targetUser.money -= takeMoney;
		if (match === true) {
			var re = new RegExp(line,"g");
			fs.readFile('config/money.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, targetUser.userid+','+targetUser.money);
			fs.writeFile('config/money.csv', result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
			});
		} else {
			var log = fs.createWriteStream('config/money.csv', {'flags': 'a'});
			log.write("\n"+targetUser.userid+','+targetUser.money);
		}
		var p = 'bucks';
		if (takeMoney < 2) p = 'buck';
		this.sendReply(targetUser.name + ' has had ' + takeMoney + ' ' + p + ' removed. This user now has ' + targetUser.money + ' bucks.');
		targetUser.send(user.name + ' has removed ' + takeMoney + ' bucks from you.');
		} else {
			return this.parse('/help removebucks');
		}
	},

	buy: function(target, room, user) {
		if (!target) return this.sendReply('You need to pick an item! Type /buy [item] to buy something.');
		if (closeShop) return this.sendReply('The shop is currently closed and will open shortly.');
		var target2 = target;
		target = target.split(', ');
		var avatar = '';
		var data = fs.readFileSync('config/money.csv','utf8')
		var match = false;
		var money = 0;
		var line = '';
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toId(parts[0]);
			if (user.userid == userid) {
			var x = Number(parts[1]);
			var money = x;
			match = true;
			if (match === true) {
				line = line + row[i];
				break;
			}
			}
		}
		user.money = money;
		var price = 0;
		if (target2 === 'symbol') {
			price = 5;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a custom symbol. You will have this until you log off for more than an hour.');
				this.sendReply('Use /customsymbol [symbol] to change your symbol now!');
				user.canCustomSymbol = true;
				this.add(user.name + ' has purchased a custom symbol!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target[0] === 'custom') {
			price = 100;
			if (price <= user.money) {
				if (!target[1]) return this.sendReply('Please specify the avatar you would like you buy. It has a maximum size of 80x80 and must be in .png format. ex: /buy custom, [url to the avatar]');
       				var filename = target[1].split('.');
				filename = '.'+filename.pop();
				if (filename != ".png") return this.sendReply('Your avatar must be in .png format.');
				user.money = user.money - price;
				this.sendReply('You have purchased a custom avatar. Staff have been notified and it will be added in due time.');
				user.canCustomAvatar = true;
				Rooms.rooms.staff.add(user.name+' has purchased a custom avatar. Image: '+target[1]);
				for (var u in Users.users) {
					if (Users.users[u].group == "~" || Users.users[u].group == "\u266B") {
						Users.users[u].send('|pm|~Server|'+Users.users[u].group+Users.users[u].name+'|'+user.name+' has purchased a custom avatar. Image: '+target[1]);
					}
				}
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target[0] === 'animated') {
			price = 45;
			if (price <= user.money) {
				if (!target[1]) return this.sendReply('Please specify the avatar you would like you buy. It has a maximum size of 80x80 and must be in .gif format. ex: /buy animated, [url to the avatar]');
       				var filename = target[1].split('.');
				filename = '.'+filename.pop();
				if (filename != ".gif") return this.sendReply('Your avatar must be in .gif format.');
				user.money = user.money - price;
				this.sendReply('You have purchased a custom animated avatar. Staff have been notified and it will be added in due time.');
				user.canAnimatedAvatar = true;
				Rooms.rooms.staff.add(user.name+' has purchased a custom animated avatar. Image: '+target[1]);
				for (var u in Users.users) {
					if (Users.users[u].group == "~" || Users.users[u].group == "&") {
						Users.users[u].send('|pm|~Server|'+Users.users[u].group+Users.users[u].name+'|'+user.name+' has purchased a custom animated avatar. Image: '+target[1]);
					}
				}
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target[0] === 'room') {
			price = 200;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a chat room. You need to message an Admin or musician so that the room can be made.');
				user.canChatRoom = true;
				this.add(user.name + ' has purchased a chat room!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
			if (target2 === 'fix') {
			price = 80;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased the ability to alter your avatar or trainer card. You need to message an Admin capable of adding this (freddycakes / chmpion freddy).');
				user.canFixItem = true;
				this.add(user.name + ' has purchased the ability to set alter their card or avatar or music box!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target2 === 'potd') {
			price = 55;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased the ability to pick a POTD! PM a leader or up to claim this prize.');
				user.canPOTD = true;
				this.add(user.name + ' has purchased the ability to set the POTD!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
				if (target2 === 'declare') {
			price = 50;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased the ability to declare (from music). To do this message an musician (?) with the message you want to send. Keep it sensible!');
				user.canDecAdvertise = true;
				this.add(user.name + ' has purchased the ability to declare from an Admin or musician!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (match === true) {
			var re = new RegExp(line,"g");
			fs.readFile('config/money.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, user.userid+','+user.money);
			fs.writeFile('config/money.csv', result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
			});
		}
	},
//Tis' big command
	shop: function(target, room, user) {
	
		if (!this.canBroadcast()) return;
		if(room.id === 'lobby') {
		return this.sendReplyBox('<center>Click <button name="send" value="/shop164" class="blackbutton" title="Shop!"><font color="Black"><b>Shop</button></b></font> to enter our shop!');
		} else 
		return this.sendReplyBox('<center><h3><b><u>ShockedSpirit Pokemart </u></b></h3><table border="1" cellspacing ="0" cellpadding="3"><tr><th>Command</th><th>Description</th><th>Cost</th></tr>' +
			'<tr><td>Symbol</td><td>Buys a custom symbol to go infront of name and puts you at top of userlist (temporary until restart)</td><td>20</td></tr>' +
			'<tr><td>Custom</td><td>Buys a custom avatar to be applied to your name (you supply)</td><td>75</td></tr>' +
			'<tr><td>Animated</td><td>Buys an animated avatar to be applied to your name (you supply)</td><td>45</td></tr>' +
			'<tr><td>Room</td><td>Buys a chatroom for you to own (within reason, can be refused)</td><td>200</td></tr>' +
			'<tr><td>Fix</td><td>Buys the ability to alter your current custom avatar or trainer card or music box (don\'t buy if you have neither)!</td><td>100</td></tr>' +
			'<tr><td>Declare</td><td>You get the ability to get two declares from an Admin in lobby. This can be used for league advertisement (not server)</td><td>50</td></tr>' +
			'<tr><td>POTD</td><td>Buys the ability to set The Pokemon of the Day!  This Pokemon will be guaranteed to show up in random battles. </td><td>55</td></tr>' +
			'</table><br />To buy an item from the shop, use /buy [command].<br></center>');
		if (closeShop) return this.sendReply('|raw|<center><h3><b>The shop is currently closed and will open shortly.</b></h3></center>');
	},
	shop164: function(target, room, user) {
	if (!this.canBroadcast()) return;
	this.sendReplyBox('<center><h3><b><u>ShockeSpirit Pokemart</u></b></h3><table border="1" cellspacing ="0" cellpadding="3"><tr><th>Command</th><th>Description</th><th>Cost</th></tr>' +
			'<tr><td>Symbol</td><td>Buys a custom symbol to go infront of name and puts you at top of userlist (temporary until restart)</td><td>50</td></tr>' +
			'<tr><td>Custom</td><td>Buys a custom avatar to be applied to your name (you supply)</td><td>100</td></tr>' +
			'<tr><td>Animated</td><td>Buys an animated avatar to be applied to your name (you supply)</td><td>45</td></tr>' +
			'<tr><td>Room</td><td>Buys a chatroom for you to own (within reason, can be refused)</td><td>200</td></tr>' +
			'<tr><td>Fix</td><td>Buys the ability to alter your current custom avatar or trainer card or music box (don\'t buy if you have neither)!</td><td>80</td></tr>' +
			'<tr><td>Declare</td><td>You get the ability to get two declares from an Admin in lobby. This can be used for league advertisement (not server)</td><td>50</td></tr>' +
			'<tr><td>POTD</td><td>Buys the ability to set The Pokemon of the Day!  This Pokemon will be guaranteed to show up in random battles. </td><td>55</td></tr>' +
			'</table><br />To buy an item from the shop, use /buy [command].<br></center>');
		if (closeShop) return this.sendReply('|raw|<center><h3><b>The shop is currently closed and will open shortly.</b></h3></center>');
	},

	lockshop: 'closeshop',
	closeshop: function(target, room, user) {
		if (!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');

		if(closeShop && closedShop === 1) closedShop--;

		if (closeShop) {
			return this.sendReply('The shop is already closed. Use /openshop to open the shop to buyers.');
		}
		else if (!closeShop) {
			if (closedShop === 0) {
				this.sendReply('Are you sure you want to close the shop? People will not be able to buy anything. If you do, use the command again.');
				closedShop++;
			}
			else if (closedShop === 1) {
				closeShop = true;
				closedShop--;
				this.add('|raw|<center><h4><b>The shop has been temporarily closed, during this time you cannot buy items.</b></h4></center>');
			}
		}
	},

	openshop: function(target, room, user) {
		if (!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');

		if (!closeShop && closedShop === 1) closedShop--;

		if (!closeShop) {
			return this.sendRepy('The shop is already closed. Use /closeshop to close the shop to buyers.');
		}
		else if (closeShop) {
			if (closedShop === 0) {
				this.sendReply('Are you sure you want to open the shop? People will be able to buy again. If you do, use the command again.');
				closedShop++;
			}
			else if (closedShop === 1) {
				closeShop = false;
				closedShop--;
				this.add('|raw|<center><h4><b>The shop has been opened, you can now buy from the shop.</b></h4></center>');
			}
		}
	},


	shoplift: 'awarditem',
	giveitem: 'awarditem',
	awarditem: function(target, room, user) {
		if (!target) return this.parse('/help awarditem');
		if(!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;

		if (!target) return this.parse('/help awarditem');
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}

		var matched = false;
		var isItem = false;
		var theItem = '';
		for (var i = 0; i < inShop.length; i++) {
			if (target.toLowerCase() === inShop[i]) {
				isItem = true;
				theItem = inShop[i];
			}
		}
		if (isItem === true) {
			if (theItem === 'symbol') {
				if (targetUser.canCustomSymbol === true) {
					return this.sendReply('This user has already bought that item from the shop... no need for another.');
				}
				if (targetUser.canCustomSymbol === false) {
					matched = true;
					this.sendReply(targetUser.name + ' can now use /customsymbol to get a custom symbol.');
					targetUser.canCustomSymbol = true;
					Rooms.rooms.lobby.add(user.name + ' has stolen custom symbol from the shop!');
					targetUser.send(user.name + ' has given you ' + theItem + '! Use /customsymbol [symbol] to add the symbol!');
				}
			}
			if (theItem === 'custom') {
				if (targetUser.canCustomAvatar === true) {
					return this.sendReply('This user has already bought that item from the shop... no need for another.');
				}
				if (targetUser.canCustomAvatar === false) {
					matched = true;
					targetUser.canCustomAvatar = true;
					Rooms.rooms.lobby.add(user.name + ' has stolen a custom avatar from the shop!');
					targetUser.send(user.name + ' has given you ' + theItem + '!');
				}
			}
			if (theItem === 'animated') {
				if (targetUser.canAnimated === true) {
					return this.sendReply('This user has already bought that item from the shop... no need for another.');
				}
				if (targetUser.canCustomAvatar === false) {
					matched = true;
					targetUser.canCustomAvatar = true;
					Rooms.rooms.lobby.add(user.name + ' has stolen a custom avatar from the shop!');
					targetUser.send(user.name + ' has given you ' + theItem + '!');
				}
			}
			if (theItem === 'room') {
				if (targetUser.canChatRoom === true) {
					return this.sendReply('This user has already bought that item from the shop... no need for another.');
				}
				if (targetUser.canChatRoom === false) {
					matched = true;
					targetUser.canChatRoom = true;
					Rooms.rooms.lobby.add(user.name + ' has stolen a chat room from the shop!');
					targetUser.send(user.name + ' has given you ' + theItem + '!');
				}
			}
			if (theItem === 'forcerename') {
				if (targetUser.canForcerename === true) {
					return this.sendReply('This user has already bought that item from the shop... no need for another.');
				}
				if (targetUser.canForcerename === false) {
					matched = true;
					targetUser.canForcerename = true;
					Rooms.rooms.lobby.add(user.name + ' has a forcerename from the shop!');
					targetUser.send(user.name + ' has given you ' + theItem + '!');
				}
			}	
			if (theItem === 'fix') {
				if (targetUser.canFixItem === true) {
					return this.sendReply('This user has already bought that item from the shop... no need for another.');
				}
				if (targetUser.canFixItem === false) {
					matched = true;
					targetUser.canFixItem = true;
					Rooms.rooms.lobby.add(user.name + ' has stolen the ability to alter a current trainer card or avatar from the shop!');
					targetUser.send(user.name + ' has given you the ability to set ' + theItem + '!');
				}
			}
			if (theItem === 'potd') {
				if (targetUser.canPOTD === true) {
					return this.sendReply('This user has already bought that item from the shop... no need for another.');
				}
				if (targetUser.canPOTD === false) {
					matched = true;
					targetUser.canPOTD = true;
					Rooms.rooms.lobby.add(user.name + ' has stolen the ability to set POTD from the shop!');
					targetUser.send(user.name + ' has given you the ability to set ' + theItem + '!');
				}
			}
			if (theItem === 'declare') {
				if (targetUser.canDecAdvertise === true) {
					return this.sendReply('This user has already bought that item from the shop... no need for another.');
				}
				if (targetUser.canDecAdvertise === false) {
					matched = true;
					targetUser.canDecAdvertise = true;
					Rooms.rooms.lobby.add(user.name + ' has stolen the ability to get a declare from the shop!');
					targetUser.send(user.name + ' has given you the ability to set ' + theItem + '!');
				}
			}
			else
				if (!matched) return this.sendReply('Maybe that item isn\'t in the shop yet.');
		}
		else 
			return this.sendReply('Shop item could not be found, please check /shop for all items - ' + theItem);
	},

	removeitem: function(target, room, user) {
		if (!target) return this.parse('/help removeitem');
		if(!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;

		if (!target) return this.parse('/help removeitem');
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}

		if (target === 'symbol') {
			if (targetUser.canCustomSymbol) {
				targetUser.canCustomSymbol = false;
				this.sendReply(targetUser.name + ' no longer has a custom symbol ready to use.');
				targetUser.send(user.name + ' has removed the custom symbol from you.');
			}
			else
				return this.sendReply('They do not have a custom symbol for you to remove.');
		}
		else if (target === 'custom') {
			if (targetUser.canCustomAvatar) {
				targetUser.canCustomAvatar = false;
				this.sendReply(targetUser.name + ' no longer has a custom avatar ready to use.');
				targetUser.send(user.name + ' has removed the custom avatar from you.');
			}
			else
				return this.sendReply('They do not have a custom avatar for you to remove.');
		}
		else if (target === 'animated') {
			if (targetUser.canAnimatedAvatar) {
				targetUser.canAnimatedAvatar = false;
				this.sendReply(targetUser.name + ' no longer has a animated avatar ready to use.');
				targetUser.send(user.name + ' has removed the animated avatar from you.');
			}
			else
				return this.sendReply('They do not have an animated avatar for you to remove.');
		}
		else if (target === 'room') {
			if (targetUser.canChatRoom) {
				targetUser.canChatRoom = false;
				this.sendReply(targetUser.name + ' no longer has a chat room ready to use.');
				targetUser.send(user.name + ' has removed the chat room from you.');
			}
			else
				return this.sendReply('They do not have a chat room for you to remove.');
		}
		else if (target === 'trainer') {
			if (targetUser.canTrainerCard) {
				targetUser.canTrainerCard = false;
				this.sendReply(targetUser.name + ' no longer has a trainer card ready to use.');
				targetUser.send(user.name + ' has removed the trainer card from you.');
			}
			else
				return this.sendReply('They do not have a trainer card for you to remove.');
		}
		else if (target === 'musicbox') {
			if (targetUser.canMusicBox) {
				targetUser.canMusicBox = false;
				this.sendReply(targetUser.name + ' no longer has a music box ready to use.');
				targetUser.send(user.name + ' has removed the music box from you.');
			}
			else
				return this.sendReply('They do not have a music box for you to remove.');
		}
		else if (target === 'fix') {
			if (targetUser.canFixItem) {
				targetUser.canFixItem = false;
				this.sendReply(targetUser.name + ' no longer has the fix to use.');
				targetUser.send(user.name + ' has removed the fix from you.');
			}
			else
				return this.sendReply('They do not have a trainer card for you to remove.');
		}
		else if (target === 'forcerename') {
			if (targetUser.canForcerename) {
				targetUser.canForcerename = false;
				this.sendReply(targetUser.name + ' no longer has the forcerename to use.');
				targetUser.send(user.name + ' has removed forcerename from you.');
			}
			else
				return this.sendReply('They do not have a forcerename for you to remove.');
		}
		else if (target === 'potd') {
			if (targetUser.canPOTD) {
				targetUser.canPOTD = false;
				this.sendReply(targetUser.name + ' no longer can set POTD.');
				targetUser.send(user.name + ' has removed the POTD from you.');
			}
			else
				return this.sendReply('They do not have the POTD ability for you to remove.');
		}
		else if (target === 'badge') {
			if (targetUser.canBadge) {
				targetUser.canBadge = false;
				this.sendReply(targetUser.name + ' no longer has a badge.');
				targetUser.send(user.name + ' has removed the VIP badge from you.');
			}
			else
				return this.sendReply('They do not have a VIP badge for you to remove.');
		}
		else if (target === 'declare') {
			if (targetUser.canDecAdvertise) {
				targetUser.canDecAdvertise = false;
				this.sendReply(targetUser.name + ' no longer has a declare ready to use.');
				targetUser.send(user.name + ' has removed the declare from you.');
			}
			else
				return this.sendReply('They do not have a trainer card for you to remove.');
		}
		else
			return this.sendReply('That isn\'t a real item you fool!');
	},tpm: 'tourpm',
	tourpm: function(target, room, user) {
		if (!target) return this.parse('/tourpm [message] - Sends a PM to every user in a room.');
		if (!this.can('pban')) return false;

		var pmName = '~Tournaments Note';

		for (var i in Users.users) {
			var message = '|pm|'+pmName+'|'+Users.users[i].getIdentity()+'|'+target;
			Users.users[i].send(message);
		}
	},

tournote: 'tournamentnote',
tournamentnote: function(target, room, user){
			return this.parse('/tpm A(n) Tour is taking place in the lobby chatroom or possibly the Tiers Room!');
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
* Personal Server Commands
*********************************************************/
eating: 'away',
	gaming: 'away',
    sleep: 'away',
    work: 'away',
    working: 'away',
    sleeping: 'away',
    busy: 'away',    
	afk: 'away',
	away: function(target, room, user, connection, cmd) {
		if (!this.can('away')) return false;
		// unicode away message idea by Siiilver
		var t = 'â’¶â“¦â“â“¨';
		var t2 = 'Away';
		switch (cmd) {
			case 'busy':
			t = 'â’·â“¤â“¢â“¨';
			t2 = 'Busy';
			break;
			case 'sleeping':
			t = 'â“ˆâ“›â“”â“”â“Ÿâ“˜â“â“–';
			t2 = 'Sleeping';
			break;
			case 'sleep':
			t = 'â“ˆâ“›â“”â“”â“Ÿâ“˜â“â“–';
			t2 = 'Sleeping';
			break;
			case 'gaming':
			t = 'â’¼â“â“œâ“˜â“â“–';
			t2 = 'Gaming';
			break;
			case 'working':
			t = 'â“Œâ“žâ“¡â“šâ“˜â“â“–';
			t2 = 'Working';
			break;
			case 'work':
			t = 'â“Œâ“žâ“¡â“šâ“˜â“â“–';
			t2 = 'Working';
			break;
			case 'eating':
			t = 'â’ºâ“â“£â“˜â“â“–';
			t2 = 'Eating';
			break;
			default:
			t = 'â’¶â“¦â“â“¨'
			t2 = 'Away';
			break;
		}

		if (user.name.length > 18) return this.sendReply('Your username exceeds the length limit.');

		if (!user.isAway) {
			user.originalName = user.name;
			var awayName = user.name + ' - '+t;
			//delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
			delete Users.get(awayName);
			user.forceRename(awayName, undefined, true);
			
			if (user.isStaff) this.add('|raw|-- <b><font color="#088cc7">' + user.originalName +'</font color></b> is now '+t2.toLowerCase()+'. '+ (target ? " (" + escapeHTML(target) + ")" : ""));

			user.isAway = true;
		}
		else {
			return this.sendReply('You are already set as a form of away, type /back if you are now back.');
		}

		user.updateIdentity();
	},

	back: function(target, room, user, connection) {
		if (!this.can('away')) return false;

		if (user.isAway) {
			if (user.name === user.originalName) {
				user.isAway = false; 
				return this.sendReply('Your name has been left unaltered and no longer marked as away.');
			}

			var newName = user.originalName;
			
			//delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
			delete Users.get(newName);

			user.forceRename(newName, undefined, true);
			
			//user will be authenticated
			user.authenticated = true;
			
			if (user.isStaff) this.add('|raw|-- <b><font color="#088cc7">' + newName + '</font color></b> is no longer away.');

			user.originalName = '';
			user.isAway = false;
		}
		else {
			return this.sendReply('You are not set as away.');
		}

		user.updateIdentity();
	},dance: function (target, room, user) {
	if (!this.canBroadcast()) return;
	this.sendReply('|html| <marquee behavior="alternate" scrollamount="3"><b><img src=http://i196.photobucket.com/albums/aa279/loganknightphotos/wobbuffet-2.gif>WOBB<img src=http://i196.photobucket.com/albums/aa279/loganknightphotos/wobbuffet-2.gif>WOBB<img src=http://i196.photobucket.com/albums/aa279/loganknightphotos/wobbuffet-2.gif></b></marquee>');
	},fight: function (target, room, user) {
	if (!this.canBroadcast()) return;
	this.sendReply('|html| <marquee behavior="alternate" scrollamount="3"><b><img src=http://cdn.pokestache.com/2014/5/21/b23b578bf341205ba7cfc93620ddb3f3.gif>Sudden Death<img src=http://cdn.pokestache.com/2014/5/21/b23b578bf341205ba7cfc93620ddb3f3.gif>Sudden Death<img src=http://cdn.pokestache.com/2014/5/21/b23b578bf341205ba7cfc93620ddb3f3.gif></b></marquee>');
	},
      model: 'sprite',
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
/*********************************************************
* Friend Codes                                    
*********************************************************/
	fch: 'friendcodehelp',
	friendcodehelp:function(target, room, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Friend Code Help:</b> <br><br />' +
                '/friendcode (/fc) [friendcode] - Sets your Friend Code.<br />' +
                '/getcode (gc) - Sends you a popup of all of the registered user\'s Friend Codes.<br />' +
                '/deletecode [user] - Deletes this user\'s friend code from the server (Requires %, @, &, ~)<br>' +
                '<i>--Any questions, PM papew!</i>');
                },
             
                
	friendcode: 'fc',
        fc: function(target, room, user, connection) {
                if (!target) {
                        return this.sendReply("Enter in your friend code. Make sure it's in the format: xxxx-xxxx-xxxx or xxxx xxxx xxxx or xxxxxxxxxxxx.");
                }
                var fc = target;
                fc = fc.replace(/-/g, '');
                fc = fc.replace(/ /g, '');
                if (isNaN(fc)) return this.sendReply("The friend code you submitted contains non-numerical characters. Make sure it's in the format: xxxx-xxxx-xxxx or xxxx xxxx xxxx or xxxxxxxxxxxx.");
                if (fc.length < 12) return this.sendReply("The friend code you have entered is not long enough! Make sure it's in the format: xxxx-xxxx-xxxx or xxxx xxxx xxxx or xxxxxxxxxxxx.");
                fc = fc.slice(0,4)+'-'+fc.slice(4,8)+'-'+fc.slice(8,12);
                var codes = fs.readFileSync('config/friendcodes.txt','utf8');
                if (codes.toLowerCase().indexOf(user.name) > -1) {
                        return this.sendReply("Your friend code is already here.");
                }
                code.write('\n'+user.name+': '+fc);
                return this.sendReply("Your Friend Code: "+fc+" has been set.");
        	},
		
		viewcode: 'gc',
		getcodes: 'gc',
		viewcodes: 'gc',
		vc: 'gc',
        getcode: 'gc',
        gc: function(target, room, user, connection) {
                var codes = fs.readFileSync('config/friendcodes.txt','utf8');
                return user.send('|popup|'+codes);
		},
		
	deletecode: function(target, room, user) {
		if (!target) {	
			return this.sendReply('/deletecode [user] - Deletes the Friend Code of the User.');
		}
		t = this;
		if (!this.can('lock')) return false;
		fs.readFile('config/friendcodes.txt','utf8',function(err,data) {
			if (err) console.log(err);
			hi = this;
			var row = (''+data).split('\n');
			match = false;
			line = '';
			for (var i = row.length; i > -1; i--) {
				if (!row[i]) continue;
				var line = row[i].split(':');
				if (target === line[0]) {
					match = true;
					line = row[i];
				}
				break;
			}
			if (match === true) {
				var re = new RegExp(line,'g');
				var result = data.replace(re, '');
				fs.writeFile('config/friendcodes.txt',result,'utf8',function(err) {
					if (err) t.sendReply(err);
					t.sendReply('The Friendcode '+line+' has been deleted.');
				});
			}else{
				t.sendReply('There is no match.');
			}
		});
	},
//End Friend Code commands
		studiopermissions: function(target, room, user, connection) {
				if(!this.canBroadcast()|| !user.can('lock')) return this.sendReply('/studiopermissions - Access Denied.');
                if (!target) {
                        return this.sendReply("Please enter the user you wish to give permissions to.");
                }
                var studiouser = target;
                var studiouser = fs.readFileSync('config/studiopermissions.txt','utf8');
                if (studiouser.toLowerCase().indexOf(user.name) > -1) {
                        return this.sendReply("This user is already on the list.");
                }
                code.write('\n'+user.name+': '+studiouser);
                return this.sendReply(+user+' has been added to bee able to join TheStudioAuth.');
	 	},
        status: function (user) {
	    io.stdinString('config/status.csv', user, 'status');
	    if (user.status === '') {
	        user.status = 'This user hasn\'t set their status yet.';
	    }
	    return 'Status: "' + user.status + '"';
	},
	avatar: function(target, room, user) {
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
					'|raw|<img src="//play.pokemonshowdown.com/sprites/trainers/'+avatar+'.png" alt="" width="80" height="80" />');
		}
	},

	logout: function(target, room, user) {
		user.resetName();
	},
	pb: 'permaban',
	pban: 'permaban',
        permban: 'permaban',
        permaban: function(target, room, user) {
                if (!target) return this.sendReply('/permaban [username] - Permanently bans the user from the server. Bans placed by this command do not reset on server restarts. Requires: & ~');
                if (!this.can('pban')) return false;              
                target = this.splitTarget(target);
                var targetUser = this.targetUser;
                if (!targetUser) {
                        return this.sendReply('User '+this.targetUsername+' not found.');
                }
                if (Users.checkBanned(targetUser.latestIp) && !target && !targetUser.connected) {
                        var problem = ' but was already banned';
                        return this.privateModCommand('('+targetUser.name+' would be banned by '+user.name+problem+'.)');
                }
               
                targetUser.popup(user.name+" has permanently banned you.");
                this.addModCommand(targetUser.name+" was permanently banned by "+user.name+".");
				this.add('|unlink|' + targetUser.userid);
                targetUser.ban();
                ipbans.write('\n'+targetUser.latestIp);
        },
	r: 'reply',
	reply: function(target, room, user) {
		if (!target) return this.parse('/help reply');
		if (!user.lastPM) {
			return this.sendReply('No one has PMed you yet.');
		}
		return this.parse('/msg '+(user.lastPM||'')+', '+target);
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
    	makechatroom: function (target, room, user) {
		if (!this.can('makeroom')) return;
		var id = toId(target);
		if (!id) return this.parse('/help makechatroom');
		if (Rooms.rooms[id]) return this.sendReply("The room '" + target + "' already exists.");
		if (Rooms.global.addChatRoom(target)) {
			return this.sendReply("The room '" + target + "' was created.");
		}
		return this.sendReply("An error occurred while trying to create the room '" + target + "'.");
	},
dcr:'deregisterchatroom',
	deregisterchatroom: function(target, room, user) {
		if (!this.can('makeroom')) return;
		var id = toId(target);
		if (!id) return this.parse('/help deregisterchatroom');
		var targetRoom = Rooms.get(id);
		if (!targetRoom) return this.sendReply("The room '"+id+"' doesn't exist.");
		target = targetRoom.title || targetRoom.id;
		if (Rooms.global.deregisterChatRoom(id)) {
			this.sendReply("The room '"+target+"' was deregistered.");
			this.sendReply("It will be deleted as of the next server restart.");
			return;
		}
		return this.sendReply("The room '"+target+"' isn't registered.");
	},

	privateroom: function(target, room, user) {
		if (!this.can('privateroom', null, room)) return;
		if (target === 'off') {
			delete room.isPrivate;
			this.addModCommand(user.name+' made this room public.');
			if (room.chatRoomData) {
				delete room.chatRoomData.isPrivate;
				Rooms.global.writeChatRoomData();
			}
		} else {
			room.isPrivate = true;
			this.addModCommand(user.name+' made this room private.');
			if (room.chatRoomData) {
				room.chatRoomData.isPrivate = true;
				Rooms.global.writeChatRoomData();
			}
		}
	},

	modjoin: function(target, room, user) {
		if (!this.can('privateroom', null, room)) return;
		if (target === 'off') {
			delete room.modjoin;
			this.addModCommand(user.name+' turned off modjoin.');
			if (room.chatRoomData) {
				delete room.chatRoomData.modjoin;
				Rooms.global.writeChatRoomData();
			}
		} else {
			room.modjoin = true;
			this.addModCommand(user.name+' turned on modjoin.');
			if (room.chatRoomData) {
				room.chatRoomData.modjoin = true;
				Rooms.global.writeChatRoomData();
			}
		}
	},

	officialchatroom: 'officialroom',
	officialroom: function(target, room, user) {
		if (!this.can('makeroom')) return;
		if (!room.chatRoomData) {
			return this.sendReply("/officialroom - This room can't be made official");
		}
		if (target === 'off') {
			delete room.isOfficial;
			this.addModCommand(user.name+' made this chat room unofficial.');
			delete room.chatRoomData.isOfficial;
			Rooms.global.writeChatRoomData();
		} else {
			room.isOfficial = true;
			this.addModCommand(user.name+' made this chat room official.');
			room.chatRoomData.isOfficial = true;
			Rooms.global.writeChatRoomData();
		}
	},

	roomowner: function(target, room, user) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomowner - This room isn't designed for per-room moderation to be added");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;

		if (!targetUser) return this.sendReply("User '"+this.targetUsername+"' is not online.");
		
		if (!room.founder) return this.sendReply('The room needs a room founder before it can have a room owner.');
		if (room.founder != user.userid && !this.can('makeroom')) return this.sendReply('/roomowner - Access denied.');

		if (!room.auth) room.auth = room.chatRoomData.auth = {};

		var name = targetUser.name;

		room.auth[targetUser.userid] = '#';
		this.addModCommand(''+name+' was appointed Room Owner by '+user.name+'.');
		room.onUpdateIdentity(targetUser);
		Rooms.global.writeChatRoomData();
	},

	roomdeowner: 'deroomowner',
	deroomowner: function(target, room, user) {
		if (!room.auth) {
			return this.sendReply("/roomdeowner - This room isn't designed for per-room moderation");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || userid === '') return this.sendReply("User '"+name+"' does not exist.");

		if (room.auth[userid] !== '#') return this.sendReply("User '"+name+"' is not a room owner.");
		if (!room.founder || user.userid != room.founder && !this.can('makeroom')) return false;


		delete room.auth[userid];
		this.sendReply('('+name+' is no longer Room Owner.)');
		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
	},	roomdesc: function(target, room, user) {
		if (!target) {
			if (!this.canBroadcast()) return;
			var re = /(https?:\/\/(([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?))/g;
			if (!room.desc) return this.sendReply("This room does not have a description set.");
			this.sendReplyBox('The room description is: '+room.desc.replace(re, "<a href=\"$1\">$1</a>"));
			return;
		}
		if (!this.can('roommod', null, room)) return false;
		if (target.length > 80) {
			return this.sendReply('Error: Room description is too long (must be at most 80 characters).');
		}

		room.desc = target;
		this.sendReply('(The room description is now: '+target+')');

		if (room.chatRoomData) {
			room.chatRoomData.desc = room.desc;
			Rooms.global.writeChatRoomData();
		}
	},roomdemote: 'roompromote',
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
    	report: 'complain',
	complain: function(target, room, user){
        if (!target) return this.sendReply('/report [report] - Use this command to report other users.');
        var html = ['<img ','<a href','<font ','<marquee','<blink','<center'];
        for (var x in html) {
        	if (target.indexOf(html[x]) > -1) return this.sendReply('HTML is not supported in this command.');
        }
   
        if (target.indexOf('panpawn sucks') > -1) return this.sendReply('Yes, we know.');
        if (target.length > 350) return this.sendReply('This report is too long; it cannot exceed 350 characters.');
        if (!this.canTalk()) return;
        Rooms.rooms.staff.add(user.userid+' (in '+room.id+') has reported: '+target+'');
        this.sendReply('Your report "'+target+'" has been reported.');
        for(var u in Users.users)
                if((Users.users[u].group == "~" || Users.users[u].group == "&" || Users.users[u].group == "@" || Users.users[u].group == "%")&& Users.users[u].connected)
                        Users.users[u].send('|pm|~Server|'+Users.users[u].getIdentity()+'|'+user.userid+' (in '+room.id+') has reported: '+target+'');
	},
	suggestion: 'suggest',
	suggest: function(target, room, user){
        if (!target) return this.sendReply('/suggest [suggestion] - Sends your suggestion to staff to review.');
         var html = ['<img ','<a href','<font ','<marquee','<blink','<center'];
        for (var x in html) {
        	if (target.indexOf(html[x]) > -1) return this.sendReply('HTML is not supported in this command.');
        }
       
        if (target.length > 450) return this.sendReply('This suggestion is too long; it cannot exceed 450 characters.');
        if (!this.canTalk()) return;
        Rooms.rooms.staff.add(user.userid+' (in '+room.id+') has suggested: '+target+'');
        this.sendReply('Thanks, your suggestion "'+target+'" has been sent.  We\'ll review your feedback soon.');
	},
  testingstuff: function(target, room, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('testing.');
	},hb: function(room, user, cmd){
                return this.parse('/hotpatch battles');
      },hf: function(room, user, cmd){
                return this.parse('/hotpatch formats');
	},hc: function(room, user, cmd){
                return this.parse('/hotpatch chat');
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
},authlist: 'viewserverauth',
	viewserverauth: function(target, room, user, connection) {
        var buffer = [];
        var admins = [];
        var leaders = [];
        var mods = [];
        var drivers = [];
        var voices = [];
        
        admins2 = ''; leaders2 = ''; mods2 = ''; drivers2 = ''; voices2 = ''; 
        stafflist = fs.readFileSync('config/usergroups.csv','utf8');
        stafflist = stafflist.split('\n');
        for (var u in stafflist) {
            line = stafflist[u].split(',');
			if (line[1] == '~') { 
                admins2 = admins2 +line[0]+',';
            } 
            if (line[1] == '&') { 
                leaders2 = leaders2 +line[0]+',';
            }
            if (line[1] == '@') { 
                mods2 = mods2 +line[0]+',';
            } 
            if (line[1] == '%') { 
                drivers2 = drivers2 +line[0]+',';
            } 
            if (line[1] == '+') { 
                voices2 = voices2 +line[0]+',';
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
        connection.popup('ShockedSpirit Staff list \n\n**Administrators**: \n'+admins+'\n**Leaders**: \n'+leaders+'\n**Moderators**: \n'+mods+'\n**Drivers**: \n'+drivers+'\n**Voices**: \n'+voices);    
	},
	css: function(target, room, user, connection) {
                var css = fs.readFileSync('config/custom.css','utf8');
                return user.send('|popup|'+css);
	},
	vault: function(target, room, user, connection) {
		
                var money = fs.readFileSync('config/money.csv','utf8');
                return user.send('|popup|'+money);
	},
	statuses: function(target, room, user, connection) {
		
                var money = fs.readFileSync('config/status.csv','utf8');
                return user.send('|popup|'+money);
	},
	givesymbol: 'gs',
	gs: function(target, room, user){
                if(!target) return this.sendReply('/givesymbol [user] - Gives permission for this user to set a custom symbol.');
                return this.parse('/gi '+target+', symbol');
	},
	autojoin: function(target, room, user, connection) {
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
		}
		if(target.toLowerCase() == 'lobby'){
            connection.sendTo('lobby','|html|<div class="infobox" style="border-color:blue"><font color = #000027><font size = 5><center><b><u>Welcome, to the ShockedSpirit server by Champion Freddy/freddycakes and llllex123, where trainers take a break and just have some fun!"<br/>' +
            '</font><font size="3">If you like eating and playing pokemon, stop on by :)<br/>' +
            '</font><font size="3">At the moment we are rebuilding our server due to a lot of trolls and spammers but their have been a lot of demotions and promotions and we are enforcing the rules a lot more!<br/>' +            
'<hr width="85%">' +
'</button><a href="http://shockedspirit.weebly.com/Staff.html"><button class="blackbutton" title="Staff"><font color="black"><b>Staff</b></a></button> |<a |html|</button><a href="http://shockedspirit.weebly.com/"><button class="blackbutton" title="Website"><font color="Black"><b>Website</b></a></button> | <a |html|</button><a href="http://icestorm.psim.us"><button class="blackbutton" title="Ally Server"><font color="Black"><b>Ice Storm</b></a></button>  |  <a |html|</button><a href="http://shockedspirit.psim.us/news"><button class="blackbutton" title="News"><font color="Black"><b>News</b></a></button> | <a |html|</button><a href="http://shockedspirit.weebly.com/tiers-exclusive-to-shockedspirit.html"><button class="blackbutton" title="tiers"><font color="Black"><b>tiers</b></a></button>   | </a |html|</button><a href="http://shockedspirit.weebly.com/Rules.html"><button class="blackbutton" title="Rules"><font color="black"><b>Rules</b></a></button> | <a |html|</button><a href="http://shockedspirit.weebly.com/top-6-pokemon-of-the-week.html"><button class="blackbutton" title="Top6pokes"><font color="Black"><b>Top6pokes</b></a></button></div>');
	}
if (target.toLowerCase() == "votingroom") {
			return connection.sendTo('votingroom','|html|<div class="infobox" style="border-color:blue"><font color = #000027><font size = 5><center><b><u>Welcome, to the ShockedSpirit Voting room where you may come to vote for important events or votes that the server will have the poll will be open for one day, No POll for today!<br/>' +
'<button name="send" value="no poll for today"> closed!<br/>' + 
'<button name="send" value="no poll for today"> closed!<button><div>');
		}
	},rb: 'roomban',
	roomban: function (target, room, user, connection) {
		if (!target) return this.parse('/help roomban');
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");
		if(room.id === 'lobby') {
		return this.sendReply('|html|No! Bad! Do not use this command here!');
		}
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
		targetUser.popup(user.name+" has banned you from the room " + room.id + ". To appeal the ban, PM the moderator that banned you or a room owner." + (target ? " (" + target + ")" : ""));
		this.addModCommand(""+targetUser.name+" was banned from room " + room.id + " by "+user.name+"." + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addModCommand(targetUser.name + "'s alts were also banned from room " + room.id + ": " + alts.join(", "));
			for (var i = 0; i < alts.length; ++i) {
				var altId = toId(alts[i]);
				this.add('|unlink|' + altId);
				room.bannedUsers[altId] = true;
			}
		}
		this.add('|unlink|' + targetUser.userid);
		targetUser.leaveRoom(room.id);
	},

	roomunban: function(target, room, user, connection) {
		if (!target) return this.parse('/help roomunban');
		if(room.id === 'lobby') {
		return this.sendReply('|html|No! Bad! Do not use this command here!');
		}
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
		targetUser.popup(user.name + " has unbanned you from the room " + room.id + ".");
		this.addModCommand(targetUser.name + " was unbanned from room " + room.id + " by " + user.name + ".");
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addModCommand(targetUser.name + "'s alts were also unbanned from room " + room.id + ": " + alts.join(", "));
			for (var i = 0; i < alts.length; ++i) {
				var altId = toId(alts[i]);
				if (room.bannedUsers[altId]) delete room.bannedUsers[altId];
			}
		}
	},

	sca: 'giveavatar',
	setcustomavatar: 'giveavatar',
	setcustomavi: 'giveavatar',
	giveavatar: function(target, room, user, connection) {
        if (!this.can('giveavatar')) return this.sendReply('/giveavatar - Access denied.');
        try { 
            request = require('request');
        } catch (e) {
            return this.sendReply('/giveavatar requires the request module. Please run "npm install request" before using this command.');
        }
        if (!target) return this.sendReply('Usage: /giveavatar [username], [image] - Gives [username] the image specified as their avatar. -' +
            'Images are required to be .PNG or .GIF. Requires: & ~');
        parts = target.split(',');
        if (!parts[0] || !parts[1]) return this.sendReply('Usage: /giveavatar [username], [image] - Gives [username] the image specified as their avatar. -<br />' +
            'Images are required to be .PNG or .GIF. Requires: & ~');
        targetUser = Users.get(parts[0].trim());
        filename = parts[1].trim();
        uri = filename;
        filename = targetUser.userid + filename.slice(filename.toLowerCase().length - 4,filename.length);
        filetype = filename.slice(filename.toLowerCase().length - 4,filename.length);
        if (filetype != '.png' && filetype != '.gif') {
            return this.sendReply('/giveavatar - Invalid image format. Images are required to be in either PNG or GIF format.');
        }
        if (!targetUser) return this.sendReply('User '+target+' not found.');
        self = this;
        var download = function(uri, filename, callback) {
            request.head(uri, function(err, res, body) {
                var r = request(uri).pipe(fs.createWriteStream('config/avatars/'+filename));
                r.on('close', callback);
            });
        };
        download(uri, filename, function(err, res, body){
            if (err) return console.log('/giveavatar error: '+err);
            fs.readFile('config/avatars.csv','utf8',function(err, data) {
                if (err) return self.sendReply('/giveavatar erred: '+e.stack);
                match = false;
                var row = (''+data).split("\n");
                var line = '';
                for (var i = row.length; i > -1; i--) {
                    if (!row[i]) continue;
                    var parts = row[i].split(",");
                    if (targetUser.userid == parts[0]) {
                        match = true;
                        line = line + row[i];
                        break;
                    }
                }
                if (match === true) {
                    var re = new RegExp(line,"g");
                    var result = data.replace(re, targetUser.userid+','+filename);
                    fs.writeFile('config/avatars.csv', result, 'utf8', function (err) {
                        if (err) return console.log(err);
                    });
			for (var u in Users.customAvatars) {
				var column = Users.customAvatars[u].split(',');
				if (column[0] == targetUser.userid) {
					Users.customAvatars[u] = targetUser.userid+','+filename;
					break;
				}
			}
                } else {
                    fs.appendFile('config/avatars.csv','\n'+targetUser.userid+','+filename);
                    Users.customAvatars.push(targetUser.userid+','+filename);
                }
                self.sendReply(targetUser.name+' has received a custom avatar.');
                targetUser.avatar = filename;
                targetUser.sendTo(room, 'You have received a custom avatar from ' + user.name + '.');
                for (var u in Users.users) {
                    if (Users.users[u].group == "~" || Users.users[u].group == "&") {
                        Users.users[u].send('|pm|~Server|'+Users.users[u].group+Users.users[u].name+'|'+targetUser.name+' has received a custom avatar from '+user.name+'.');
                    }
                }
                Rooms.rooms.staff.add(targetUser.name+' has received a custom avatar from '+user.name+'.');
                if (filetype == '.gif' && targetUser.canAnimatedAvatar) targetUser.canAnimatedAvatar = false;
                if (filetype == '.png' && targetUser.canCustomAvatar) targetUser.canCustomAvatar = false;
            });
        });
	},

	masspm: 'pmall',
	pmall: function(target, room, user) {
		if (!target) return this.parse('/pmall [message] - Sends a PM to every user in a room.');
		if (!this.can('pban')) return false;

		var pmName = '~Lt. Surge Tundabolt';

		for (var i in Users.users) {
			var message = '|pm|'+pmName+'|'+Users.users[i].getIdentity()+'|'+target;
			Users.users[i].send(message);
		}
	},
	
	pas: 'pmallstaff',
	pmallstaff: function(target, room, user) {
		if (!target) return this.sendReply('/pmallstaff [message] - Sends a PM to every user in a room.');
		if (!this.can('pban')) return false;
		for (var u in Users.users) { if (Users.users[u].isStaff) {
		Users.users[u].send('|pm|~Staff PM|'+Users.users[u].group+Users.users[u].name+'|'+target+' (by: '+user.name+')'); } 
		}
	},roomauth: function(target, room, user, connection) {
		if (!room.auth) return this.sendReply("/roomauth - This room isn't designed for per-room moderation and therefore has no auth list.");
		var buffer = [];
		var owners = [];
		var admins = [];
		var leaders = [];
		var mods = [];
		var drivers = [];
		var voices = [];

		room.owners = ''; room.admins = ''; room.leaders = ''; room.mods = ''; room.drivers = ''; room.voices = ''; 
		for (var u in room.auth) { 
			if (room.auth[u] == '#') { 
				room.owners = room.owners +u+',';
			} 
			if (room.auth[u] == '~') { 
				room.admins = room.admins +u+',';
			} 
			if (room.auth[u] == '&') { 
				room.leaders = room.leaders +u+',';
			}
			if (room.auth[u] == '@') { 
				room.mods = room.mods +u+',';
			} 
			if (room.auth[u] == '%') { 
				room.drivers = room.drivers +u+',';
			} 
			if (room.auth[u] == '+') { 
				room.voices = room.voices +u+',';
			} 
		}

		if (!room.founder) founder = '';
		if (room.founder) founder = room.founder;

		room.owners = room.owners.split(',');
		room.mods = room.mods.split(',');
		room.drivers = room.drivers.split(',');
		room.voices = room.voices.split(',');

		for (var u in room.owners) {
			if (room.owners[u] != '') owners.push(room.owners[u]);
		}
		for (var u in room.mods) {
			if (room.mods[u] != '') mods.push(room.mods[u]);
		}
		for (var u in room.drivers) {
			if (room.drivers[u] != '') drivers.push(room.drivers[u]);
		}
		for (var u in room.voices) {
			if (room.voices[u] != '') voices.push(room.voices[u]);
		}
		if (owners.length > 0) {
			owners = owners.join(', ');
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
		connection.popup('Room Auth in "'+room.id+'"\n\n**Founder**: \n'+founder+'\n**Owner(s)**: \n'+owners+'\n**Moderator(s)**: \n'+mods+'\n**Driver(s)**: \n'+drivers+'\n**Voice(s)**: \n'+voices);
	},

	leave: 'part',
	part: function(target, room, user, connection) {
		if (room.id === 'global') return false;
		var targetRoom = Rooms.get(target);
		if (target && !targetRoom) {
			return this.sendReply("The room '"+target+"' does not exist.");
		}
		user.leaveRoom(targetRoom || room, connection);
	},

	poof: 'd',
	d: function(target, room, user){
		if(room.id !== 'lobby') return false;
		var btags = '<strong><font color='+hashColor(Math.random().toString())+'" >';
		var etags = '</font></strong>'
		var targetid = toId(user);
		if(!user.muted && target){
			var tar = toId(target);
			var targetUser = Users.get(tar);
			if(user.can('poof', targetUser)){

				if(!targetUser){
					user.emit('console', 'Cannot find user ' + target + '.', socket);
				}else{
					if(poofeh)
						Rooms.rooms.lobby.addRaw(btags + '~~ '+targetUser.name+' was slaughtered by ' + user.name +'! ~~' + etags);
					targetUser.disconnectAll();
					return	this.logModCommand(targetUser.name+ ' was poofed by ' + user.name);
				}

			} else {
				return this.sendReply('/poof target - Access denied.');
			}
		}
		if(poofeh && !user.muted && !user.locked){
			Rooms.rooms.lobby.addRaw(btags + getRandMessage(user)+ etags);
			user.disconnectAll();
		}else{
			return this.sendReply('poof is currently disabled.');
		}
	},

	poofoff: 'nopoof',
	nopoof: function(target, room, user){
		if(!user.can('warn'))
			return this.sendReply('/nopoof - Access denied.');
		if(!poofeh)
			return this.sendReply('poof is currently disabled.');
		poofeh = false;
		return this.sendReply('poof is now disabled.');
	},

	poofon: function(target, room, user){
		if(!user.can('warn'))
			return this.sendReply('/poofon - Access denied.');
		if(poofeh)
			return this.sendReply('poof is currently enabled.');
		poofeh = true;
		return this.sendReply('poof is now enabled.');
	},

	cpoof: function(target, room, user){
		if(!user.can('broadcast'))
			return this.sendReply('/cpoof - Access Denied');

		if(poofeh)
		{
			if(target.indexOf('<img') != -1)
				return this.sendReply('Images are no longer supported in cpoof.');
			target = htmlfix(target);
			var btags = '<strong><font color="'+hashColor(Math.random().toString())+'" >';
			var etags = '</font></strong>'
			Rooms.rooms.lobby.addRaw(btags + '~~ '+user.name+' '+target+'! ~~' + etags);
			this.logModCommand(user.name + ' used a custom poof message: \n "'+target+'"');
			user.disconnectAll();
		}else{
			return this.sendReply('Poof is currently disabled.');
		}
	},
	impersonate:'imp',
	imp: function(target, room, user) {
		if (!user.can('broadcast')) return this.sendReply('/imp - Access denied.');
		if (!this.canTalk()) return;
		if (!target) return this.parse('/help imp');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if(!target)
			return this.sendReply('You cannot make the user say nothing.');
		if(target.indexOf('/announce') == 0 || target.indexOf('/warn') == 0 || target.indexOf('/data')==0)
			return this.sendReply('You cannot use this to make a user announce/data/warn in imp.');
		room.add('|c|'+targetUser.getIdentity()+'|'+ target + ' ``**(imp by '+ user.getIdentity() + ')**``');
		
	},j: function(target, room, user) {
		return this.parse('/tour join');
	},

	l: function(target, room, user) {
		return this.parse('/tour leave');
	},tourmoney: 'tourgivemoney',
	tourgivemoney: function (target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox(
					"Here is a guide on giving money out based on tours.<br />" +
					" <a href=URl HERE>Tour Money Help</a><br />" 
										)
	},ratingtiers: 'ratingtier',
	ratingtier: function(target, room, user) {
		if (!this.canBroadcast()) return false;

		return this.sendReplyBox('' +
		'<font color="#8C7853"><b>Bronze</b></font>: Less Than 8 Tournament Wins. (Top 100%) <br/>' +
		'<font color="#545454"><b>Silver</b></font>: Between 8 to 19 Tournament Wins. (Top 80%-46.5%)<br/>' +
		'<font color="#FFD700"><b>Gold</b></font>: Between 20 to 39 Tournamenet Wins. (Top 46.5%-13%)<br/>' +
		'<font color="#C0C0C0"><b>Platinum</b></font>: Between 40 to 59 Tournament Wins. (Top 13%-1.5%)<br/>' +
		'<font color="#236B8E"><b>Diamond</b></font>: Between 60 to 99 Tournament Wins. (Top 1.5%-0.1%)<br/>' +
		'<font color="#FF851B"><b>Legend</b></font>: Over 100 Tournament Wins. (Top 0.1%)');
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
	},permaban: function(target, room, user) {
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
	banhammer: 'ban',
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

		targetUser.popup("" + user.name + " has banned you with his 50 inch banhammer stop being a bad bad boy or else I will torture you." + (Config.appealurl ? (" If you feel that your banning was unjustified you can appeal the ban:\n" + Config.appealurl) : "") + "\n\n" + target);

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
	hide: function(target, room, user) {
		if (this.can('hide')) {
			user.getIdentity = function(){
				if(this.muted)	return '!' + this.name;
				if(this.locked) return '?' + this.name;
				return ' ' + this.name;
			};
			user.updateIdentity();
			this.sendReply('You have hidden your staff symbol.');
			return false;
		}

	},

	show: function(target, room, user) {
		if (this.can('hide')) {
			delete user.getIdentity
			user.updateIdentity();
			this.sendReply('You have revealed your staff symbol');
			return false;
		}
	},mn: 'modnote',
	modnote: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help note');
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply("The note is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('mute')) return false;
		return this.privateModCommand("(" + user.name + " notes: " + target + ")");
	},

	unlink: 'unurl',
	ul: 'unurl',
	unurl: function(target, room, user, connection, cmd) {
		if(!target) return this.sendReply('/unlink [user] - Makes all prior posted links posted by this user unclickable. Requires: %, @, &, ~');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
        if (!targetUser) {
            return this.sendReply('User '+this.targetUsername+' not found.');
        }
        if (!this.can('lock',targetUser)) return false;
		for (var u in targetUser.prevNames) room.add('|unlink|'+targetUser.prevNames[u]);
		this.add('|unlink|' + targetUser.userid);
		return this.privateModCommand('|html|(' + user.name + ' has made  <font color="red">' +this.targetUsername+ '</font>\'s prior links unclickable.)');
	},
	lockroom: function(target, room, user) {
		if (!room.auth) {
			c
		}
		if (!room.auth[user.userid] === '#' && user.group != '~') {
			return this.sendReply('/lockroom - Access denied.');
		}
		room.lockedRoom = true;
		this.add(user.name + ' has locked the room.');
	},
	
	unlockroom: function(target, room, user) {
		if (!room.auth) {
			return this.sendReply("Only unofficial chatrooms can be unlocked.");
		}
		if (!room.auth[user.userid] === '#' && user.group != '~') {
			return this.sendReply('/unlockroom - Access denied.');
		}
		room.lockedRoom = false;
		this.add(user.name + ' has unlocked the room.');
	},
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
	},modchat: function (target, room, user) {
		if (!target) return this.sendReply("Moderated chat is currently set to: " + room.modchat);
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");
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
			var modchat = Tools.escapeHTML(room.modchat);
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

		this.add('|raw|<div class="broadcast-blue"><b>'+target+'</b></div>');
		this.logModCommand(user.name + " declared " + target);
	},

	htmldeclare: function (target, room, user) {
		if (!target) return this.parse('/help htmldeclare');
		if (!this.can('gdeclare', null, room)) return false;

		if (!this.canTalk()) return;

		this.add('|raw|<div class="broadcast-blue"><b>' + target + '</b></div>');
		this.logModCommand(user.name + " declared " + target);
	},
	bd: 'bdeclare',
	bdeclare: function(target, room, user) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;

		if (!this.canTalk()) return;

		this.add('|raw|<div class="broadcast-black"><b>'+target+'</b></div>');
		this.logModCommand(user.name+' declared '+target);
	},
	gdeclare: 'globaldeclare',
	globaldeclare: function (target, room, user) {
		if (!target) return this.parse('/help globaldeclare');
		if (!this.can('gdeclare')) return false;

		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b>' + target + '</b></div>');
		}
		this.logModCommand(user.name + " globally declared " + target);
	},wall: 'announce',
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
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");
		var commaIndex = target.indexOf(',');
		var targetUser, reason;
		if (commaIndex !== -1) {
			reason = target.substr(commaIndex + 1).trim();
			target = target.substr(0, commaIndex);
		}
		targetUser = Users.get(target);
		if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' not found.");
		if (!this.can('forcerename', targetUser)) return false;

		if (targetUser.userid !== toId(target)) {
			return this.sendReply("User '" + target + "' had already changed its name to '" + targetUser.name + "'.");
		}

		var entry = targetUser.name + " was forced to choose a new name by " + user.name + (reason ? ": " + reason: "");
		this.privateModCommand("(" + entry + ")");
		Rooms.global.cancelSearch(targetUser);
		targetUser.resetName();
		targetUser.send("|nametaken||" + user.name + " has forced you to change your name. " + target);
	},
	
	sml: 'smodlog',
	smodlog:function (target, room, user, connection) {
		if (!this.can('modlog')) {
		return this.sendReply('/modlog - Access denied.');
		}
		var lines = parseInt(target || 15, 10);
		if (lines > 100) lines = 100;
	var filename = 'logs/modlog.txt';
	if (!lines || lines < 0) {
	if (target.match(/^["'].+["']$/)) target = target.substring(1, target.length-1);
	}
	target = target.replace(/\\/g,'\\\\\\\\').replace(/["'`]/g,'\'\\$&\'').replace(/[\{\}\[\]\(\)\$\^\.\?\+\-\*]/g,'[$&]');
	var data = fs.readFileSync(filename, 'utf8');
	data = data.split("\n");
	var newArray = [];
	for (var i = 0; i < data.length; i++) {
		if (data[i].toLowerCase().indexOf(target.toLowerCase()) > -1) {
	newArray.push(data[i]);
	}
		if ((lines && newArray.length >= lines) || newArray.length >= 100) break;
	}
	stdout = newArray.join("\n");
	if (lines) {
	if (!stdout) {
	user.send('|popup|The modlog is empty. (Weird.)');
	} else {
	user.send('|popup|Displaying the last '+lines+' lines of the Moderator Log:\n\n' + sanitize(stdout));
	}
	} else {
	if (!stdout) {
	user.send('|popup|No moderator actions containing "'+target+'" were found.');
	} else {
	user.send('|popup|Displaying the last 100 logged actions containing "'+target+'":\n\n' + sanitize(stdout));
	}
	}
	},

	modlog: function(target, room, user, connection) {
		var lines = 0;
		// Specific case for modlog command. Room can be indicated with a comma, lines go after the comma.
		// Otherwise, the text is defaulted to text search in current rooms modlog.
		var roomId = room.id;
		var roomLogs = {};

		if (target.indexOf(',') > -1) {
			var targets = target.split(',');
			target = targets[1].trim();
			roomId = toId(targets[0]) || room.id;
		}

		// Lets check the number of lines to retrieve or if its a word instead
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

	restart: function(target, room, user) {
		if (!this.can('lockdown')) return false;
		try {
			var forever = require('forever'); 
		} catch(e) {
			return this.sendReply('/restart requires the "forever" module.');
		}

		if (!Rooms.global.lockdown)Â {
			return this.sendReply('For safety reasons, /restart can only be used during lockdown.');
		}

		if (CommandParser.updateServerLock) {
			return this.sendReply('Wait for /updateserver to finish before using /restart.');
		}
		this.logModCommand(user.name + ' used /restart');
		Rooms.global.send('|refresh|');
		forever.restart('app.js');
	},


	loadbanlist: function(target, room, user, connection) {
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
			connection.sendTo(room, "ipbans.txt has been reloaded.");
		});
	},

	refreshpage: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		Rooms.global.send('|refresh|');
		this.logEntry(user.name + " used /refreshpage");
	},
	
	us: 'updateserver',
	gitpull: 'updateserver',
	updateserver: function(target, room, user, connection) {
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
	 * Battle commands
	 *********************************************************/

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
	},roomfounder: function(target, room, user) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomfounder - This room is't designed for per-room moderation to be added.");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply("User '"+this.targetUsername+"' is not online.");
		if (!this.can('makeroom')) return false;
		if (!room.auth) room.auth = room.chatRoomData.auth = {};
		var name = targetUser.name;
		room.auth[targetUser.userid] = '#';
		room.founder = targetUser.userid;
		this.addModCommand(''+name+' was appointed to Room Founder by '+user.name+'.');
		room.onUpdateIdentity(targetUser);
		room.chatRoomData.founder = room.founder;
		Rooms.global.writeChatRoomData();
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

	awaychal: 'blockchallenges',
	idle: 'blockchallenges',
	blockchallenges: function (target, room, user) {
		user.blockChallenges = true;
		this.sendReply("You are now blocking all incoming challenge requests.");
	},

	backchal: 'allowchallenges',
	allowchallenges: function(target, room, user) {
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


function getRandMessage(user){
	var numMessages = 48; // numMessages will always be the highest case # + 1
	var message = '~~ ';
	switch(Math.floor(Math.random()*numMessages)){
		case 0: message = message + user.name + ' has vanished into nothingness!';
			break;
		case 1: message = message + user.name + ' visited chaney\'s bedroom and never returned!';
			break;
		case 2: message = message + user.name + ' used Explosion!';
			break;
		case 3: message = message + user.name + ' fell into the void.';
			break;
		case 4: message = message + user.name + ' squished by edjim\'s large behind!';
			break;
		case 5: message = message + user.name + ' became shiningStaraptor\'s slave!';
			break;
		case 6: message = message + user.name + ' became freddycakes\'s love slave!';
			break;
		case 7: message = message + user.name + ' has left the building.';
			break;
		case 8: message = message + user.name + ' Died having nightmares of Whitney\'s miltank!';
			break;
		case 9: message = message + user.name + ' died of a broken heart.';
			break;
		case 10: message = message + user.name + ' got lost in a maze!';
			break;
		case 11: message = message + user.name + ' was hit by Magikarp\'s Revenge!';
			break;
		case 12: message = message + user.name + ' was sucked into a whirlpool!';
			break;
		case 13: message = message + user.name + ' got scared and left the server!';
			break;
		case 14: message = message + user.name + ' fell off a cliff!';
			break;
		case 15: message = message + user.name + ' got eaten by a bunch of piranhas!';
			break;
		case 16: message = message + user.name + ' is blasting off again!';
			break;
		case 17: message = message + 'A large spider descended from the sky and picked up ' + user.name + '.';
			break;
		case 18: message = message + user.name + ' tried to touch Zarel!';
			break;
		case 19: message = message + user.name + ' got their sausage smoked by lol!';
			break;
		case 20: message = message + user.name + ' was forced to give 1llusion an oil massage!';
			break;
		case 21: message = message + user.name + ' took an arrow to the knee... and then one to the face.';
			break;
		case 22: message = message + user.name + ' peered through the hole on Shedinja\'s back';
			break;
		case 23: message = message + user.name + ' recieved judgment from the almighty Arceus!';
			break;
		case 24: message = message + user.name + ' used Final Gambit and missed!';
			break;
		case 25: message = message + user.name + ' pissed off a Gyarados!';
			break;
		case 26: message = message + user.name + ' screamed "BSHAX IMO"!';
			break;
		case 27: message = message + user.name + ' was actually a 12 year and was banned for COPPA.';
			break;
		case 28: message = message + user.name + ' was caught watching porn by his mom and was not allowed to play pokemon.';
			break;
		case 29: message = message + user.name + ' was unfortunate and didn\'t get a cool message.';
			break;
		case 30: message = message + 'Zarel accidently kicked ' + user.name + ' from the server!';
			break;
		case 31: message = message + user.name + ' was knocked out cold by hornysmurf!';
			break;
		case 32: message = message + user.name + ' died making love to an Excadrill!';
			break;
		case 33: message = message + user.name + ' was shoved in a Blendtec Blender with Chimp!';
			break;
		case 34: message = message + user.name + ' became a magikarp and splashed away!';
			break;
		case 35: message = message + user.name + ' was bitten by a rabid shadow!';
			break;
		case 36: message = message + user.name + ' was kicked from server! (lel clause)';
			break;
		default: message = message + user.name + ' licked the server too much!';
	};
	message = message + ' ~~';
	return message;
}


function MD5(f){function i(b,c){var d,e,f,g,h;f=b&2147483648;g=c&2147483648;d=b&1073741824;e=c&1073741824;h=(b&1073741823)+(c&1073741823);return d&e?h^2147483648^f^g:d|e?h&1073741824?h^3221225472^f^g:h^1073741824^f^g:h^f^g}function j(b,c,d,e,f,g,h){b=i(b,i(i(c&d|~c&e,f),h));return i(b<<g|b>>>32-g,c)}function k(b,c,d,e,f,g,h){b=i(b,i(i(c&e|d&~e,f),h));return i(b<<g|b>>>32-g,c)}function l(b,c,e,d,f,g,h){b=i(b,i(i(c^e^d,f),h));return i(b<<g|b>>>32-g,c)}function m(b,c,e,d,f,g,h){b=i(b,i(i(e^(c|~d),
f),h));return i(b<<g|b>>>32-g,c)}function n(b){var c="",e="",d;for(d=0;d<=3;d++)e=b>>>d*8&255,e="0"+e.toString(16),c+=e.substr(e.length-2,2);return c}var g=[],o,p,q,r,b,c,d,e,f=function(b){for(var b=b.replace(/\r\n/g,"\n"),c="",e=0;e<b.length;e++){var d=b.charCodeAt(e);d<128?c+=String.fromCharCode(d):(d>127&&d<2048?c+=String.fromCharCode(d>>6|192):(c+=String.fromCharCode(d>>12|224),c+=String.fromCharCode(d>>6&63|128)),c+=String.fromCharCode(d&63|128))}return c}(f),g=function(b){var c,d=b.length;c=
d+8;for(var e=((c-c%64)/64+1)*16,f=Array(e-1),g=0,h=0;h<d;)c=(h-h%4)/4,g=h%4*8,f[c]|=b.charCodeAt(h)<<g,h++;f[(h-h%4)/4]|=128<<h%4*8;f[e-2]=d<<3;f[e-1]=d>>>29;return f}(f);b=1732584193;c=4023233417;d=2562383102;e=271733878;for(f=0;f<g.length;f+=16)o=b,p=c,q=d,r=e,b=j(b,c,d,e,g[f+0],7,3614090360),e=j(e,b,c,d,g[f+1],12,3905402710),d=j(d,e,b,c,g[f+2],17,606105819),c=j(c,d,e,b,g[f+3],22,3250441966),b=j(b,c,d,e,g[f+4],7,4118548399),e=j(e,b,c,d,g[f+5],12,1200080426),d=j(d,e,b,c,g[f+6],17,2821735955),c=
j(c,d,e,b,g[f+7],22,4249261313),b=j(b,c,d,e,g[f+8],7,1770035416),e=j(e,b,c,d,g[f+9],12,2336552879),d=j(d,e,b,c,g[f+10],17,4294925233),c=j(c,d,e,b,g[f+11],22,2304563134),b=j(b,c,d,e,g[f+12],7,1804603682),e=j(e,b,c,d,g[f+13],12,4254626195),d=j(d,e,b,c,g[f+14],17,2792965006),c=j(c,d,e,b,g[f+15],22,1236535329),b=k(b,c,d,e,g[f+1],5,4129170786),e=k(e,b,c,d,g[f+6],9,3225465664),d=k(d,e,b,c,g[f+11],14,643717713),c=k(c,d,e,b,g[f+0],20,3921069994),b=k(b,c,d,e,g[f+5],5,3593408605),e=k(e,b,c,d,g[f+10],9,38016083),
d=k(d,e,b,c,g[f+15],14,3634488961),c=k(c,d,e,b,g[f+4],20,3889429448),b=k(b,c,d,e,g[f+9],5,568446438),e=k(e,b,c,d,g[f+14],9,3275163606),d=k(d,e,b,c,g[f+3],14,4107603335),c=k(c,d,e,b,g[f+8],20,1163531501),b=k(b,c,d,e,g[f+13],5,2850285829),e=k(e,b,c,d,g[f+2],9,4243563512),d=k(d,e,b,c,g[f+7],14,1735328473),c=k(c,d,e,b,g[f+12],20,2368359562),b=l(b,c,d,e,g[f+5],4,4294588738),e=l(e,b,c,d,g[f+8],11,2272392833),d=l(d,e,b,c,g[f+11],16,1839030562),c=l(c,d,e,b,g[f+14],23,4259657740),b=l(b,c,d,e,g[f+1],4,2763975236),
e=l(e,b,c,d,g[f+4],11,1272893353),d=l(d,e,b,c,g[f+7],16,4139469664),c=l(c,d,e,b,g[f+10],23,3200236656),b=l(b,c,d,e,g[f+13],4,681279174),e=l(e,b,c,d,g[f+0],11,3936430074),d=l(d,e,b,c,g[f+3],16,3572445317),c=l(c,d,e,b,g[f+6],23,76029189),b=l(b,c,d,e,g[f+9],4,3654602809),e=l(e,b,c,d,g[f+12],11,3873151461),d=l(d,e,b,c,g[f+15],16,530742520),c=l(c,d,e,b,g[f+2],23,3299628645),b=m(b,c,d,e,g[f+0],6,4096336452),e=m(e,b,c,d,g[f+7],10,1126891415),d=m(d,e,b,c,g[f+14],15,2878612391),c=m(c,d,e,b,g[f+5],21,4237533241),
b=m(b,c,d,e,g[f+12],6,1700485571),e=m(e,b,c,d,g[f+3],10,2399980690),d=m(d,e,b,c,g[f+10],15,4293915773),c=m(c,d,e,b,g[f+1],21,2240044497),b=m(b,c,d,e,g[f+8],6,1873313359),e=m(e,b,c,d,g[f+15],10,4264355552),d=m(d,e,b,c,g[f+6],15,2734768916),c=m(c,d,e,b,g[f+13],21,1309151649),b=m(b,c,d,e,g[f+4],6,4149444226),e=m(e,b,c,d,g[f+11],10,3174756917),d=m(d,e,b,c,g[f+2],15,718787259),c=m(c,d,e,b,g[f+9],21,3951481745),b=i(b,o),c=i(c,p),d=i(d,q),e=i(e,r);return(n(b)+n(c)+n(d)+n(e)).toLowerCase()};



var colorCache = {};

function hashColor(name) {
	if (colorCache[name]) return colorCache[name];

	var hash = MD5(name);
	var H = parseInt(hash.substr(4, 4), 16) % 360;
	var S = parseInt(hash.substr(0, 4), 16) % 50 + 50;
	var L = parseInt(hash.substr(8, 4), 16) % 20 + 25;

	var m1, m2, hue;
	var r, g, b
	S /=100;
	L /= 100;
	if (S == 0)
		r = g = b = (L * 255).toString(16);
	else {
		if (L <= 0.5)
			m2 = L * (S + 1);
		else
			m2 = L + S - L * S;
		m1 = L * 2 - m2;
		hue = H / 360;
		r = HueToRgb(m1, m2, hue + 1/3);
		g = HueToRgb(m1, m2, hue);
		b = HueToRgb(m1, m2, hue - 1/3);
	}


	colorCache[name] = '#' + r + g + b;
	return colorCache[name];
}

function HueToRgb(m1, m2, hue) {
	var v;
	if (hue < 0)
		hue += 1;
	else if (hue > 1)
		hue -= 1;

	if (6 * hue < 1)
		v = m1 + (m2 - m1) * hue * 6;
	else if (2 * hue < 1)
		v = m2;
	else if (3 * hue < 2)
		v = m1 + (m2 - m1) * (2/3 - hue) * 6;
	else
		v = m1;

	return (255 * v).toString(16);
}

function htmlfix(target){
	var fixings = ['<3', ':>', ':<'];
	for(var u in fixings){
		while(target.indexOf(fixings[u]) != -1)
			target = target.substring(0, target.indexOf(fixings[u])) +'< '+ target.substring(target.indexOf(fixings[u])+1);
	}
	
	return target;
	
}
function getAvatar(user) {
        if (!user) return false;
        var user = toId(user);
        var data = fs.readFileSync('config/avatars.csv','utf8');
        var line = data.split('\n');
        var count = 0;
        var avatar = 1;
        
        for (var u = 1; u > line.length; u++) {
            if (line[u].length < 1) continue;
            column = line[u].split(',');
            if (column[0] == user) {
                avatar = column[1];
                break;
            }
        }
        
        for (var u in line) {
                count++;
                if (line[u].length < 1) continue;
                column = line[u].split(',');
                if (column[0] == user) {
                        avatar = column[1];
                        break;
                }
        }

        return avatar;
}
