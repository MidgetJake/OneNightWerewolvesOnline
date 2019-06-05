## Structure things
### Client
This is obviously where the client side code is, everything here is what is rendered on the client. This cannot touch anything above this folder without making a specific request to the server, which in itself are limited. Within the client will generally be two sub folders, `src` and `public`. `public` includes the transpiled and packed code so this shouldn't be touched and is generated for a build.

>There have been a couple times where debugging has lead to changing around file structure within the public folder as this was quicker for testing than having to repack every change.

The `src` directory will hold everything that is written and used by the client before being packaged.
Within this everything is split up further:
- `Components` The main components of the system that can be used and reused in a number of places.
- `Entry` Entry points into the site. Currently only a single one as the rest uses [React-Router](https://github.com/ReactTraining/react-router) to handle with different pages
- `Helpers` Not a huge amount of use but it holds any functions that would be used in a number of places
- `Models` Holds classes that will model how data should be structured. For example what data a card should hold
- `Pages` The different pages that React-Router will use. Almost like second entry points
- `Static` Any static content that should be served to the client (images, etc)

This front-end uses [MaterialUI](https://material-ui.com/) for base components and styling. It follows Googles style guide and is very nice to work with. It has actually changed a lot recently so it may be worth updating to the newest version. I'm not sure how to look back at the old documentation but it should be the same or very similar.

### Back-end
The main section of the back-end is within the `helpers` directory, the `Socket`. This deals with most of the communication between the client and the server in real-time. The `GameRoom` class within is where the game logic is handled on the back-end. It's a nice long mess which needs to be sorted so there probably isn't a great deal point in talking about it's proper workings. The main points are the messages that are sent to the user and they are as follows:

#### Back-end -> Client
|Type        |Desc     | Data    |
|--------|--------|-------
|`room-connection`  | This needs to be changed but it just means the client couldn't connect to the room  | `reason` - `string` - Why the connection failed
|`room-connected`  | Confirmed that the client has connected  | `host` - `bool` - Is this client the host<br> `ownID` - `int` - ID of the client
|`user-connected`| A new client has joined the room | `username` - `string` - The username of the client connected<br>`id` - `int` - ID of the new client
|`connection-failed`|The connection to the room failed  | `reason` - `string` - The reason why the connection failed
|`user-disconnected`|A client has disconnected from the room  | `id` - `int` - ID of the client that disconnected
|`get-cards`|Get a list of all cards that are in play | `cards` - `Array<Card>` - List of cards that are in play
|`update-card`|A cards state has been updated in the lobby | `card` - `string` - Unique name of the card that has been updated<br>`active` - `bool` - Has the card be activated?
|`game-start`|The game has been started on the server  | `players` - `Array<Object>` - An array of objects containing the players usernames and IDs, also sends the card name as an empty string. `{ cardName, username, id }`
|`card-assign`|Sends the client their assigned card  | `card` - `string` - The name of the card they received <br>`id` - `int` the clients id (I can't remember why this is even sent tbh)
|`go-sleep`|The client must now blindfold | No data is sent
|`turn-text`|The text for the current turn |`text` - `string` - Text to be displayed on the screen
|`go-sleep`|The client must now blindfold | No data is sent
|`wake-up`|The client must now wake up to perform their turn, or the night has ended | `othersAwake` - `Array<Object>` - Array of the other players that are also awake<br> `turnInstructions` - `string` - Instructions for the players during their turn<br> `canInteract` - `string "none / player / centre / both"` Can the player interact with cards on their turn<br>`blockedPlayer` - `null / int` - If there is a player that cannot be touched, this is them, otherwise null<br>`turnTime` - `int` - Number of ms for the turn
|`show-card`|Show the player a card | `id` - `int` - The ID of the card<br>`centre` - `bool` - Is the checked card a centre card?<br>`cardName` - `string` - The name of the card
|`end-night`|End the night phase of the game| `blockedPlayer` - `null / int` - If there is a player that cannot be touched, this is them, otherwise null<br>`discussionTime` - `int` - Number of ms for discussion before the voting is taken
|`vote-update`|The votes have been updated | `votes` - `Object` - The number of votes each player or the centre has. `{playerID: voteCount}` `voteCount` is an `int`
|`failed-vote`|The vote failed, there was a draw or nobody voted | `tiedCooldown` - `int` - Number of ms until a recount of votes is taken
|`game-complete`|The votes concluded and someone has been killed | `killed` - `int` - ID of the player with the highest votes<br>`playerCards` - `Array<string>` - Array of all the player cards<br>`centreCards` - `Array<string>` - Array of all centre cards<br>`role` - `string` - The role of the player killed<br>`centre` - `bool` - Was the centre voted to be killed?<br>`playerName` - `string` - Username of the player voted to be killed<br>`winningTeam` - `string` - The team that won

The client sends a lot less variations of messages to the server than the server sends to the client
#### Client -> Back-end

|Type|Desc | Data
|----|---- | -----
|`room-connection`  | Trying to connect to a room  | `roomHash` - `string` - The ID of the room to join<br>`password` - `string` - Password to connect with<br>`username` - `string` - Username of the client
|`add-card`|Add a card to the pool of cards that will be used | `cardName` - `string` - Name of the card to add<br>`clientCardName` - `string` - The unique name of the card
|`remove-card`|Remove a card from the cards in play| `cardName` - `string` - Name of the card to add<br>`clientCardName` - `string` - The unique name of the card
|`get-cards`|Get all the cards that are in play | 
|`set-changes`|Change the settings of the game |`password` - `string` - The password for the room<br>`turnTime` - `int` - Number of ms for each turn to take<br>`discussionTime` - `int` - Number of ms for the discussion to last<br>`tiedCooldown` - `int` - Number of ms for the cooldown after a failed vote to last<br>`maxPlayers` - `int` - Number of players that are able to be in the lobby
|`start-game`|Start the game | 
|`check-card`|Check what a card is during a turn | `centre` - `bool` - Is the card in the centre pool?<br>`id` - `int` - ID of the card to check
|`vote-player`|Add a vote to a player or centre | `id` - `string` - ID of the card to vote<br>`removeVote` - `string` - ID of the card that was previously voted by client  
## Front-end task list
- Player gives a username when creating a room
- Creating a room then takes them directly to lobby
	- Could be done by forcing a connection if a username is supplied to the component or something
- If I room doesn't have a password, the password box shouldn't appear*
- Fix an issue where the user will see their name twice
- User will disappear off player list on disconnect*
	- Currently they will persist but new players won't see anyone who's disconnected
- Make the settings panel a bit nicer
- Countdown to start after the start button is clicked
	- Won't need back end as the countdown can start once the start signal is received. 
	- Will need the role view time to be increased however*
- Host has ability to kick users*
- Rework card info modal 
	- It shows what it needs to show but just doesn't look nice
- Prevent game starting if there is no werewolves*
- Settings will update without hitting apply
	- Wait a second or so after a change then apply
- Show better instructions whilst awake
	- Currently it's just random text at the top, needs to be more obvious
- Improve looks whilst user is asleep
	- Possibly change the white text to be within a card, make it look nicer. It just looks far too bland I guess?
- Better layout for cards whilst awake
- Make who you voted for more obvious
	- Change colour or something
- Change how players are visualised, instead of simply having the cards. Something nicer maybe but not really sure
- Centre vote can be done by clicking any of the centre cards
	- Or change around the button so it fits in a bit more, it looks out of place currently
- Make count down more obvious
	- Just rework it really I guess, maybe a circular progress or something?
- A way to restart the lobby without making a new one*
	- Basically just a "return to lobby" button
	- Players are not removed from the lobby until they disconnect however, the host may still kick them
- Rework winners modal
	- Maybe show if you won/lost instead of only showing who won*
- Handle when a player leaves mid game*
	- Doesn't need to handle too much, possibly just reconnecting
- Adjustable grace period before players are able to vote*
- Visual representation of who was voted to be killed
	- I think at some point I did have that the cards would turn red but I don't know what happened to that
- Responsive design
- "How to play" section somewhere
	- Possibly a modal or something?
- The potential hardest of tasks:
	- Server-side rendering, I have no idea how to do this without rewriting the entire thing
	- This will then lead into some SEO stuff so that it can actually be found online.

>\* indicates that some backend work may be required