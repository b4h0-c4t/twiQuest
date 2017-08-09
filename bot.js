const twitter = require('twitter');

const bot = new twitter({
  consumer_key        : "hoge",
  consumer_secret     : "hogehoge",
  access_token_key    : "fuga",
  access_token_secret : "piyo"
});


const monsters = {
  0: {
    name: 'スライム',
    hp: 5,
    atk: 1,
    money: 100
  },
  1: {
    name: '狼',
    hp: 10,
    atk: 3,
    money: 300
  },
  2: {
    name: 'ゴブリン',
    hp: 18,
    atk: 5,
    money: 500
  },
  3: {
    name:'りゅうおう',
    hp: 114514,
    atk: 1919810,
    money: 0
  }
};

let players = {
  'takachan_mirai': {
    hp: 50,
    atk: 5,
    money: 1000
  }
};

let monster = {
  name: 'null',
  hp: 0,
  atk: 0,
  money: 0
};

const date = new Date();

function tweetFunc(twt) {
  let day = (date.getYear() + 1900) + '年' + (date.getMonth() + 1) + '月' + (date.getDate()) + '日';
  let time = date.getHours() + '時' + date.getMinutes() + '分' + date.getSeconds() + '秒';
  twt += '\n' + day + time;
  bot.post('statuses/update', {status: twt}, (error, tweet, response) => {
    if(error) throw error;
    console.log(tweet.text);
  });
}

function monsterInitialize() {
  let selector = Math.floor(Math.random() * 4);
  monster = monsters[selector];
  let tweet = monster.name + ' が あらわれた!!';

  tweetFunc(tweet);
};

function playerInitialize(name) {
  players[name] = {
    hp: 30,
    atk: 3,
    money: 0
  };
};

function battle(name) {
  let sw = 0;
  let twt = '';

  monster.hp -= players[name].atk;
  if(monster.hp <= 0) {
    players[name].money += monster.money;
    twt = monster.name + 'に 勝利 した!!\n' + monster.money + 'G を 手に入れた!';
    sw = 1;
  } else {
    players[name].hp -= monster.atk;
    if(player[name].hp <= 0) {
      twt = monster.name + 'に 敗北 した。\nG を 全て 失った...';
      sw = 2;
    } else {
      twt = '@' + name + ' ' + monster.name + ' に ' + players[name].atk + ' の ダメージ を 与えた！\n' + name + ' は ' + monster.atk + ' ダメージ を 受けた!';
    }
  }

  tweetFunc(twt);

  if(sw == 1) {
    monsterInitialize();
  } else if(sw == 2) {
    playerInitialize(name);
  }
};

// main routine
monsterInitialize();

bot.stream('statuses/filter', {track: '@twiQuests'}, (stream) => {
  stream.on('data', (data) => {
    console.log('Tweet in.\n');
    let text = data.text;
    let command = text.replace( /@twiQuests /g, "" );
    if(command == 'battle') {
      let name = data.user.screen_name;
      //battle
      if(playsers[name] == undefined) {
        playerInitialize(name);
      }
      battle(name);
    };
  });
});
