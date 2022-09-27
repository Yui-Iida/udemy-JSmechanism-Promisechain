// Promise Chain Assignment

/**
 * 問題：
 * myFetch関数を使って以下の「データ取得の流れ」の通り、
 * 順次JSONを取得し、取得したデータを加工して、
 * 以下のメッセージをコンソールに表示してください。
 *
 * --Bob's timeline--
 * Tim says: waiting at station.
 * Sun says: go shopping?
 * John says: how's it going?
 * Sun says: drink?
 *
 ******************************
 * データ取得の流れ
 * １．"user1.json"を取得（Bobのユーザー情報取得）
 *
 * ２．"user1.json"のidの項目を元に
 *     `friendsOf${id}.json`でフレンド一覧を取得
 *
 * ３．取得したフレンドのID（ユーザーID）を元に、
 * 　　`user${id}.json`で各ユーザーの情報を取得
 *
 * ４．各ユーザー情報のlatestMsgIdが最後に投稿した
 * 　　メッセージのIDになりますので、そのidを用いて
 * 　　`message${friend.latestMsgId}.json`
 * 　　を取得。
 *
 * １～４で取得したデータをもとにコンソールログに
 * タイムラインの文字列を作成してください。
 *
 * ※await/asyncで記述してみてください。
 */
// async function myFetch(fileName) {
// 	const response = await fetch(`../json/${fileName}`);
// 	const json = await response.json();
// 	return json;
// }

///////////////////////////////////////////////

// My Solution

async function myFetch(fileName) {
  const response = await fetch(`../json/${fileName}`);
  const json = await response.json();
  console.log(`--${json.name}'s timeline--`);

  const bobFriends = await fetch(`../json/friendsOf${json.id}.json`);
  const bobFriendsJson = await bobFriends.json();
  //   console.log(bobFriendsJson.friendIds);

  for (let num of bobFriendsJson.friendIds) {
    const userNum = await fetch(`../json/user${num}.json`);
    const userNumJson = await userNum.json();
    // console.log(userNumJson);

    const userLatestMsgId = userNumJson.latestMsgId;
    // console.log(userLatestMsgId);

    const message = await fetch(`../json/message${userLatestMsgId}.json`);
    const messageJson = await message.json();
    console.log(`${userNumJson.name} ways: ${messageJson.message}`);
  }
}

myFetch('user1.json');

///////////////////////////////////////////////

// Example Solution

async function anotherFetch(fileName) {
  const response = await fetch(`../json/${fileName}`);
  const json = await response.json();
  return json;
}

(async function () {
  const me = await anotherFetch('user1.json');
  console.log(`--${me.name}'s timeline--`);

  const friendList = await anotherFetch(`../json/friendsOf${me.id}.json`);

  const friendIds = new Set();
  for (const id of friendList.friendIds) {
    friendIds.add(anotherFetch(`user${id}.json`));
  }
  const friends = await Promise.all(friendIds);
  console.log(friends);

  const msgIds = new Set();
  for (const friend of friends) {
    msgIds.add(anotherFetch(`message${friend.latestMsgId}.json`));
  }
  const messages = await Promise.all(msgIds);
  console.log(messages);

  for (const friend of friends) {
    for (const msg of messages) {
      if (friend.id === msg.userId)
        console.log(`${friend.name} says: ${msg.message}`);
    }
  }
})();
