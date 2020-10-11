<template>
  <div class="container">
    <div class="row mb-4" v-if="$route.params.roomID">
      <div class="col">
        <div class="input-group">
          <div class="input-group-prepend">
            <button class="btn btn-dark" v-on:click="copyTextToClipboard()" type="button">🔗</button>
          </div>
          <input id="urlForCopying" type="text" class="form-control" :value="currentUrl" readonly="readonly">
        </div>

      </div>
      <div class="col-3">
        <transition name="bounce" mode="out-in">
          <p v-if="roomInfo" :key="Object.keys(roomInfo).length" class="pt-2">{{ Object.keys(roomInfo).length }} 👀</p>
        </transition>
      </div>
    </div>

    <div v-if="!$route.params.roomID" class="card shadow mb-4">
      <div class="card-body">

        <!-- Remove for published version and replace with your own header and about section -->
        <div class="row mb-4">
          <div class="col-sm">
            <h1>Story Synth</h1>
            <h2>Realtime Storytelling Playtest App</h2>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-sm">
            <p>This app allows game designers to playtest certain types of storytelling games by putting the game content in a Google Spreadsheet. For information on how to use and remix this app, see TK.</p>
            <p>Sample spreadsheets for:
            </p>
            <ul>
              <li><a href="https://docs.google.com/spreadsheets/d/1N5eeyKTVWo5QeGcUV_zYtwtR0DikJCcvcj6w69UkC1w/edit?usp=sharing">Descended from the Queen</a></li>
              <li><a href="https://docs.google.com/spreadsheets/d/1yq2AKwaYL1uZrCnEfwgSpC0SPkQAZqnCdjNxH_pm018/edit?usp=sharing">Timed game</a></li>
              <li><a href="https://docs.google.com/spreadsheets/d/1yq2AKwaYL1uZrCnEfwgSpC0SPkQAZqnCdjNxH_pm018/edit?usp=sharing">Monster</a></li>
            </ul>
          </div>
        </div>
        <!-- end of header and about section -->

        <div class="row mb-4">
          <div class="col-sm">
            <h2>Create a room</h2>
          </div>
        </div>

        <form>

          <div class="row">
            <div class="col-sm form-group">
              <label for="roomInput">Room Code</label>

              <svg v-b-tooltip.hover title="The shareable room code – use this random one or write in a custom one" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-question-circle-fill m-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z"/>
              </svg>

              <div class="input-group">
                <input v-model="roomID" class="form-control" placeholder="Room Code">
                <div class="input-group-append">
                  <button class="btn btn-sm btn-secondary" v-on:click="assignRandomRoomName()">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-clockwise" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          </div>

          <!-- Remove for published version. Comment out the format selection and gSheetID field. Make sure to hard code the gSheetID in the game's .vue file. -->

          <div class="row mb-4">
            <div class="col-sm">
              Game Format
              <select v-model="gameType" class="custom-select">
                <option disabled value="">Please select one</option>
                <option>Shuffled</option>
                <option>Timed</option>
                <option>Monster</option>
                <option>Secret Cards</option>
              </select>
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-sm">
              Sheet (optional) 
              <svg v-b-tooltip.hover title="Paste in the entire URL link to your publicly shared Google Sheet that contains the game data."  width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-question-circle-fill m-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z"/>
              </svg>
              
              <input v-model="gSheetID" class="form-control" placeholder="Google Sheet ID (optional)">
            </div>
          </div>
          <!-- end of format and sheet fields -->


          <!-- For the published version, replace gameType with the specific game type in quotes. Example "Shuffled"  -->
          <div class="row mb-4">
            <div class="col-sm">
              <router-link :to="{path: '/' + formatToURL(gameType, gSheetID, roomID)}">
                <button :disabled="!roomID" type="button" class="btn btn-primary">Enter Room</button>
              </router-link>
            </div>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>


<script>
import { rtdb } from '../firebase'
var rooms = rtdb.ref('rooms')
var amOnline = rtdb.ref('.info/connected');

export default {
  name: 'app-roomPicker',
  props: {
    routeGameType: String,
    routeGSheetID: String,
    routeRoomID: String,
  },
  data () {
    return {
        roomID: null,
        gameType: null,
        gSheetID: null,
        currentUrl: location.hostname.toString() + "/#" + this.$route.fullPath,
        roomInfo: {
          
        }
    }
  },
  firebase: {
    roomInfo: rtdb.ref('documents')
  },
  mounted(){
    if (!this.roomID) {
      this.assignRandomRoomName();
    }

    if(!this.routeGSheetID || this.routeGSheetID === ""){
      this.gSheetID = 'demo'
    } else {
      this.gSheetID = this.routeGSheetID
    }

    if(!this.routeGameType){
      this.gameType = "Shuffled"
    } else {
      if (this.routeGameType == "Shuffled"){
        this.gameType = "Shuffled"
      } else if (this.routeGameType == "Timed") {
        this.gameType = "Timed"
      } else if (this.routeGameType == "Monster") {
        this.gameType = "Monster"
      } else {
        this.gameType = "SecretCards"
      }
    }

    if (this.routeRoomID){
      var tempUserRef = "rooms/" + this.routeRoomID + "/" + Math.trunc(Math.random()*1000).toString()

      var userRef = rtdb.ref(tempUserRef);

      amOnline.on('value', function(snapshot) {
        if (snapshot.val()) {
          userRef.onDisconnect().remove();
          userRef.set(true);
        }
      });

      this.$rtdbBind('roomInfo', rooms.child(this.routeRoomID))
        .then(() => {

        })
    }
  },
  watch:{
    $route (){
      if (this.routeRoomID){
        var tempUserRef = "rooms/" + this.routeRoomID + "/" + Math.trunc(Math.random()*1000).toString()

        var userRef = rtdb.ref(tempUserRef);

        amOnline.on('value', function(snapshot) {
          if (snapshot.val()) {
            userRef.onDisconnect().remove();
            userRef.set(true);
          }
        });

        this.$rtdbBind('roomInfo', rooms.child(this.routeRoomID))
          .then(() => {

          })
      }
        
    }
  }, 
  updated(){
    this.updateUrl();
  },
  methods : {
    formatToURL(gameType, gSheetID, roomID){
      var newPath = ""

      if (gameType == "Timed"){
        newPath += "Timed"
      } else if (gameType=="Shuffled") {
        newPath += "Shuffled"
      } else if (gameType == "Monster") {
        newPath += "Monster"
      } else {
        newPath += ("SecretCards")
      }

      newPath += "/"

      if(!gSheetID || gSheetID == 'demo' || gSheetID === ""){
        newPath += 'demo'
      } else if (gSheetID.includes("spreadsheet")){
        newPath += gSheetID.substring(gSheetID.indexOf("/d/")+3, gSheetID.indexOf("/edit?"))
      } else {
        newPath += gSheetID;
      }

      newPath += "/" + roomID

      return newPath
    },
    updateUrl(){
      this.currentUrl = location.hostname.toString() + "/#" + this.$route.fullPath;
    },
    copyTextToClipboard(){
      var copyText = document.getElementById("urlForCopying")
      copyText.select()
      copyText.setSelectionRange(0, 99999);
      document.execCommand("copy");
      
    },
    assignRandomRoomName(){
       var wordList = ['acid', 'acorn', 'acre', 'acts', 'afar', 'affix', 'aged', 'agent', 'agile', 'aging', 'agony', 'ahead', 'aide', 'aids', 'aim', 'ajar', 'alarm', 'alias', 'alibi', 'alien', 'alike', 'alive', 'aloe', 'aloft', 'aloha', 'alone', 'amend', 'amino', 'ample', 'amuse', 'angel', 'anger', 'angle', 'ankle', 'apple', 'April', 'apron', 'aqua', 'area', 'arena', 'argue', 'arise', 'armed', 'armor', 'army', 'aroma', 'array', 'arson', 'art', 'ashen', 'ashes', 'atlas', 'atom', 'attic', 'audio', 'avert', 'avoid', 'awake', 'award', 'awoke', 'axis', 'bacon', 'badge', 'bagel', 'baggy', 'baked', 'baker', 'balmy', 'banjo', 'barge', 'barn', 'bash', 'basil', 'bask', 'batch', 'bath', 'baton', 'bats', 'blade', 'blank', 'blast', 'blaze', 'bleak', 'blend', 'bless', 'blimp', 'blink', 'bloat', 'blob', 'blog', 'blot', 'blunt', 'blurt', 'blush', 'boast', 'boat', 'body', 'boil', 'bolt', 'boney', 'bonus', 'bony', 'book', 'booth', 'boots', 'boss', 'botch', 'both', 'boxer', 'breed', 'bribe', 'brick', 'bride', 'brim', 'bring', 'brink', 'brisk', 'broad', 'broil', 'broke', 'brook', 'broom', 'brush', 'buck', 'bud', 'buggy', 'bulge', 'bulk', 'bully', 'bunch', 'bunny', 'bunt', 'bush', 'bust', 'busy', 'buzz', 'cable', 'cache', 'cadet', 'cage', 'cake', 'calm', 'cameo', 'canal', 'candy', 'cane', 'canon', 'cape', 'card', 'cargo', 'carol', 'carry', 'carve', 'case', 'cash', 'cause', 'cedar', 'chain', 'chair', 'chant', 'chaos', 'charm', 'chase', 'cheek', 'cheer', 'chef', 'chess', 'chest', 'chew', 'chief', 'chili', 'chill', 'chip', 'chomp', 'chop', 'chow', 'chuck', 'chump', 'chunk', 'churn', 'chute', 'cider', 'cinch', 'city', 'civic', 'civil', 'clad', 'claim', 'clamp', 'clap', 'clash', 'clasp', 'class', 'claw', 'clay', 'clean', 'clear', 'cleat', 'cleft', 'clerk', 'click', 'cling', 'clink', 'clip', 'cloak', 'clock', 'clone', 'cloth', 'cloud', 'clump', 'coach', 'coast', 'coat', 'cod', 'coil', 'coke', 'cola', 'cold', 'colt', 'coma', 'comic', 'comma', 'cone', 'cope', 'copy', 'coral', 'cork', 'cost', 'cot', 'couch', 'cough', 'cover', 'cozy', 'craft', 'crane', 'crank', 'crate', 'crave', 'crawl', 'crazy', 'creme', 'crepe', 'crept', 'crib', 'cried', 'crisp', 'crook', 'crop', 'cross', 'crowd', 'crown', 'crumb', 'crush', 'crust', 'cub', 'cult', 'cupid', 'cure', 'curl', 'curry', 'curse', 'curve', 'curvy', 'cushy', 'cut', 'cycle', 'dab', 'dad', 'daily', 'dairy', 'daisy', 'dance', 'dandy', 'darn', 'dart', 'dash', 'data', 'date', 'dawn', 'deal', 'dean', 'debit', 'debt', 'debug', 'decaf', 'decal', 'decay', 'deck', 'decor', 'decoy', 'deed', 'delay', 'denim', 'dense', 'dent', 'depth', 'derby', 'desk', 'dial', 'diary', 'dice', 'dig', 'dill', 'dime', 'dimly', 'diner', 'dingy', 'disco', 'dish', 'disk', 'ditch', 'ditzy', 'dizzy', 'dock', 'dodge', 'doing', 'doll', 'donor', 'donut', 'dose', 'dot', 'dove', 'down', 'dowry', 'doze', 'drab', 'drama', 'drank', 'draw', 'dress', 'dried', 'drift', 'drill', 'drive', 'drone', 'droop', 'drove', 'drown', 'drum', 'dry', 'duck', 'duct', 'dude', 'dug', 'duke', 'duo', 'dusk', 'dust', 'duty', 'dwarf', 'dwell', 'eagle', 'early', 'earth', 'easel', 'east', 'eaten', 'eats', 'ebay', 'ebony', 'ebook', 'echo', 'edge', 'eel', 'eject', 'elbow', 'elder', 'elf', 'elk', 'elm', 'elope', 'elude', 'elves', 'email', 'emit', 'empty', 'emu', 'enter', 'entry', 'envoy', 'equal', 'erase', 'error', 'erupt', 'essay', 'etch', 'evade', 'even', 'evict', 'evil', 'evoke', 'exact', 'exit', 'fable', 'faced', 'fact', 'fade', 'fall', 'fancy', 'fang', 'fax', 'feast', 'feed', 'femur', 'fence', 'fend', 'ferry', 'fetch', 'fever', 'fiber', 'fifth', 'fifty', 'film', 'filth', 'final', 'finch', 'fit', 'five', 'flag', 'flaky', 'flame', 'flap', 'flask', 'fled', 'flick', 'fling', 'flint', 'flip', 'float', 'flock', 'flop', 'floss', 'flyer', 'foam', 'foe', 'fog', 'foil', 'folic', 'folk', 'food', 'fool', 'found', 'fox', 'foyer', 'frail', 'frame', 'fray', 'fresh', 'fried', 'frill', 'frisk', 'from', 'front', 'frost', 'froth', 'frown', 'froze', 'fruit', 'gag', 'gains', 'gala', 'game', 'gap', 'gas', 'gave', 'gear', 'gecko', 'geek', 'gem', 'genre', 'gift', 'gig', 'gills', 'given', 'giver', 'glad', 'glass', 'glide', 'gloss', 'glove', 'glow', 'glue', 'goal', 'going', 'golf', 'gong', 'good', 'gooey', 'goofy', 'gore', 'gown', 'grab', 'grain', 'grant', 'grape', 'graph', 'grasp', 'grass', 'grave', 'gravy', 'gray', 'green', 'greet', 'grew', 'grid', 'grief', 'grill', 'grip', 'grit', 'groom', 'growl', 'grub', 'grunt', 'guide', 'gulf', 'gulp', 'gummy', 'guru', 'gush', 'gut', 'guy', 'habit', 'half', 'halo', 'halt', 'happy', 'harm', 'hash', 'hasty', 'hatch', 'haven', 'hazel', 'hazy', 'heap', 'heat', 'heave', 'hedge', 'hefty', 'help', 'herbs', 'hers', 'hub', 'hug', 'hula', 'hull', 'human', 'humid', 'hump', 'hung', 'hunk', 'hunt', 'hurry', 'hurt', 'hush', 'hut', 'ice', 'icing', 'icon', 'icy', 'igloo', 'image', 'ion', 'iron', 'issue', 'item', 'ivory', 'ivy', 'jab', 'jam', 'jaws', 'jazz', 'jeep', 'jelly', 'jet', 'jiffy', 'job', 'jog', 'jolly', 'jolt', 'jot', 'joy', 'judge', 'juice', 'juicy', 'July', 'jumbo', 'jump', 'junky', 'juror', 'jury', 'keep', 'keg', 'kept', 'kick', 'kilt', 'king', 'kite', 'kitty', 'kiwi', 'knee', 'knelt', 'koala', 'ladle', 'lady', 'lair', 'lake', 'lance', 'land', 'lapel', 'large', 'lash', 'lasso', 'last', 'latch', 'late', 'lazy', 'left', 'legal', 'lemon', 'lend', 'lens', 'lent', 'level', 'lever', 'lid', 'life', 'lift', 'lilac', 'lily', 'limb', 'limes', 'line', 'lint', 'lion', 'lip', 'list', 'lived', 'liver', 'lunar', 'lunch', 'lung', 'lurch', 'lure', 'lurk', 'lying', 'lyric', 'mace', 'maker', 'malt', 'mama', 'mango', 'manor', 'many', 'map', 'March', 'mardi', 'marry', 'mash', 'match', 'mate', 'math', 'mocha', 'moist', 'mold', 'mom', 'moody', 'mop', 'morse', 'most', 'motor', 'motto', 'mount', 'mouse', 'mousy', 'mouth', 'move', 'movie', 'mower', 'mud', 'mug', 'mulch', 'mule', 'mull', 'mumbo', 'mummy', 'mural', 'muse', 'music', 'musky', 'mute', 'nacho', 'nag', 'nail', 'name', 'nanny', 'nap', 'navy', 'near', 'neat', 'neon', 'nerd', 'nest', 'net', 'next', 'ninth', 'nutty', 'oak', 'oasis', 'oat', 'ocean', 'oil', 'old', 'olive', 'omen', 'onion', 'only', 'ooze', 'opal', 'open', 'opera', 'opt', 'otter', 'ouch', 'ounce', 'outer', 'oval', 'oven', 'owl', 'ozone', 'pace', 'pagan', 'pager', 'palm', 'panda', 'panic', 'pants', 'panty', 'paper', 'park', 'party', 'pasta', 'patch', 'path', 'patio', 'payer', 'pecan', 'penny', 'pep', 'perch', 'perm', 'pest', 'petal', 'petri', 'petty', 'photo', 'plank', 'plant', 'plaza', 'plead', 'plot', 'plow', 'pluck', 'plug', 'plus', 'poach', 'pod', 'poem', 'poet', 'pogo', 'point', 'poise', 'poker', 'polar', 'polka', 'polo', 'pond', 'pony', 'poppy', 'pork', 'poser', 'pouch', 'pound', 'pout', 'power', 'prank', 'press', 'print', 'prior', 'prism', 'prize', 'probe', 'prong', 'proof', 'props', 'prude', 'prune', 'pry', 'pug', 'pull', 'pulp', 'pulse', 'puma', 'punch', 'punk', 'pupil', 'puppy', 'purr', 'purse', 'push', 'putt', 'quack', 'quake', 'query', 'quiet', 'quill', 'quilt', 'quit', 'quota', 'quote', 'rabid', 'race', 'rack', 'radar', 'radio', 'raft', 'rage', 'raid', 'rail', 'rake', 'rally', 'ramp', 'ranch', 'range', 'rank', 'rant', 'rash', 'raven', 'reach', 'react', 'ream', 'rebel', 'recap', 'relax', 'relay', 'relic', 'remix', 'repay', 'repel', 'reply', 'rerun', 'reset', 'rhyme', 'rice', 'rich', 'ride', 'rigid', 'rigor', 'rinse', 'riot', 'ripen', 'rise', 'risk', 'ritzy', 'rival', 'river', 'roast', 'robe', 'robin', 'rock', 'rogue', 'roman', 'romp', 'rope', 'rover', 'royal', 'ruby', 'rug', 'ruin', 'rule', 'runny', 'rush', 'rust', 'rut', 'sadly', 'sage', 'said', 'saint', 'salad', 'salon', 'salsa', 'salt', 'same', 'sandy', 'satin', 'sauna', 'saved', 'savor', 'sax', 'say', 'scale', 'scam', 'scan', 'scare', 'scarf', 'scary', 'scoff', 'scold', 'scoop', 'scoot', 'scope', 'score', 'scorn', 'scout', 'scowl', 'scrap', 'scrub', 'scuba', 'scuff', 'sect', 'sedan', 'self', 'send', 'sepia', 'serve', 'set', 'seven', 'shack', 'shade', 'shady', 'shaft', 'shaky', 'sham', 'shape', 'share', 'sharp', 'shed', 'sheep', 'sheet', 'shelf', 'shell', 'shine', 'shiny', 'ship', 'shirt', 'shock', 'shop', 'shore', 'shout', 'shove', 'shown', 'showy', 'shred', 'shrug', 'shun', 'shush', 'shut', 'shy', 'sift', 'silk', 'silly', 'silo', 'sip', 'siren', 'sixth', 'size', 'skate', 'skew', 'skid', 'skier', 'skies', 'skip', 'skirt', 'skit', 'sky', 'slab', 'slack', 'slain', 'slam', 'slang', 'slash', 'slate', 'slaw', 'sled', 'sleek', 'sleep', 'sleet', 'slept', 'slice', 'slick', 'slimy', 'sling', 'slip', 'slit', 'slob', 'slot', 'slug', 'slum', 'slurp', 'slush', 'small', 'smash', 'smell', 'smile', 'smirk', 'smog', 'snack', 'snap', 'snare', 'snarl', 'sneak', 'sneer', 'sniff', 'snore', 'snort', 'snout', 'snowy', 'snub', 'snuff', 'speak', 'speed', 'spend', 'spent', 'spew', 'spied', 'spill', 'spiny', 'spoil', 'spoke', 'spoof', 'spool', 'spoon', 'sport', 'spot', 'spout', 'spray', 'spree', 'spur', 'squad', 'squat', 'squid', 'stack', 'staff', 'stage', 'stain', 'stall', 'stamp', 'stand', 'stank', 'stark', 'start', 'stash', 'state', 'stays', 'steam', 'steep', 'stem', 'step', 'stew', 'stick', 'sting', 'stir', 'stock', 'stole', 'stomp', 'stony', 'stood', 'stoop', 'stop', 'storm', 'stout', 'stove', 'straw', 'stray', 'strut', 'stuck', 'stud', 'stuff', 'stump', 'stung', 'stunt', 'suds', 'sugar', 'sulk', 'surf', 'sushi', 'swab', 'swan', 'swarm', 'sway', 'swear', 'sweat', 'sweep', 'swell', 'swept', 'swim', 'swing', 'swipe', 'swirl', 'swoop', 'swore', 'syrup', 'tacky', 'taco', 'tag', 'take', 'tall', 'talon', 'tamer', 'tank', 'taper', 'taps', 'tarot', 'task', 'taste', 'tasty', 'taunt', 'thank', 'thaw', 'theft', 'theme', 'thigh', 'thing', 'think', 'thorn', 'those', 'thud', 'thumb', 'thump', 'thus', 'tiara', 'tidal', 'tidy', 'tiger', 'tile', 'tilt', 'tint', 'tiny', 'trace', 'track', 'trade', 'train', 'trait', 'trap', 'trash', 'tray', 'treat', 'tree', 'trek', 'trend', 'trial', 'tribe', 'trick', 'trio', 'trout', 'truce', 'truck', 'trunk', 'try', 'tug', 'tulip', 'tummy', 'turf', 'tusk', 'tutor', 'tutu', 'tux', 'tweak', 'tweet', 'twice', 'twine', 'twins', 'twirl', 'twist', 'uncle', 'uncut', 'undo', 'unify', 'union', 'unit', 'untie', 'upon', 'upper', 'urban', 'used', 'user', 'usher', 'utter', 'value', 'vapor', 'vegan', 'venue', 'verse', 'vest', 'veto', 'vice', 'video', 'view', 'visa', 'visor', 'vixen', 'vocal', 'voice', 'void', 'volt', 'voter', 'vowel', 'wad', 'wafer', 'wager', 'wages', 'wagon', 'wake', 'walk', 'wand', 'wasp', 'watch', 'water', 'wavy', 'wheat', 'whiff', 'whole', 'whoop', 'wick', 'widen', 'widow', 'width', 'wife', 'wifi', 'wilt', 'wimp', 'wind', 'wing', 'wink', 'wipe', 'wired', 'wiry', 'wise', 'wish', 'wispy', 'wok', 'wolf', 'womb', 'wool', 'woozy', 'word', 'work', 'worry', 'wound', 'woven', 'wrath', 'wreck', 'wrist', 'xerox', 'yahoo', 'yam', 'yard', 'year', 'yeast', 'yelp', 'yield', 'yo-yo', 'yodel', 'yoga', 'yoyo', 'yummy', 'zebra', 'zero', 'zesty', 'zippy', 'zone', 'zoom']

      this.roomID = wordList[Math.floor(Math.random() * wordList.length)]+'-'+wordList[Math.floor(Math.random() * wordList.length)]+'-'+wordList[Math.floor(Math.random() * wordList.length)]
    }

  }
}
</script>

<style scoped>
  .bounce-enter-active {
    animation: bounce-in .5s;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
</style>