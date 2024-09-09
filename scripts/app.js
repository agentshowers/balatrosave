const STAKES = ["No sticker", "White sticker", "Red sticker", "Green sticker", "Black sticker", "Blue sticker", "Purple sticker", "Orange sticker", "Gold sticker"]

function convertFile(compressedFile) {
  let text = pako.inflate(compressedFile, { windowBits: -15, to: "string" });
  text = text.replace(/\["?([\w\s]+)"?\]=/g, "\"$1\": ");
  text = text.replace(/,}/g, "}");
  text = text.replace("return ", "");
  return JSON.parse(text);
}

const App = {
  data() {
    return {
      loaded: false,
      error: "",
    }
  },

  created() {
    this.reset();
  },

  methods: {
    loadFile(event) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = this.parseFile;
      reader.readAsArrayBuffer(file);
    },

    parseFile(event) {
      this.reset();
      try {
        let data = convertFile(event.target.result);
        if (!data.joker_usage) {
          throw new Error('Wrong .jkr file');
        }
        for (const joker in data.joker_usage) {
          let wins = Object.keys(data.joker_usage[joker].wins);
          let maxWin = 0;
          if (wins.length > 0) {
            maxWin = Number(wins.sort()[wins.length - 1]);
          }
          this.stakes[maxWin].jokers.push(joker);
        }
        this.loaded = true;
      } catch (error) {
        console.log(error);
        this.error = "Couldn't load profile. Make sure you've selected the profile.jkr file."
      }
    },

    jokerStyle(joker) {
      if ('image' in JOKERS[joker]) {
        return `background-image: url(images/${JOKERS[joker].image}); background-size: 71px;`;
      } else {
        return `background-position: ${-71 * JOKERS[joker].pos.x}px ${-95 * JOKERS[joker].pos.y}px`;
      }
    },

    reset() {
      this.stakes = STAKES.map(stake => { return { name: stake, jokers: [] } });
      this.loaded = false;
      this.error = "";
    },
  }
}

Vue.createApp(App).mount("#app")
