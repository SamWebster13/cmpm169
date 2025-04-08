// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
function main() {
  const fillers = {
    GENRE: ["Sci-Fi", "Fantasy", "Horror", "Mystery", "Romance", "Fiction", "Thriller", "Comedy", "Slice of Life"],
  
    SUBGENRE: {
      "Sci-Fi": ["Cyberpunk", "Scientific", "Post-Apocalyptic", "Space Opera"],
      "Fantasy": ["Eldritch", "High Fantasy", "Mythic", "Dark"],
      "Horror": ["Eldritch", "Psychological", "Supernatural", "Gothic"],
      "Mystery": ["Noir", "Supernatural", "Historical", "Procedural"],
      "Romance": ["Modern", "Historical", "Dramedy"],
      "Fiction": ["Historical", "Modern", "Satire"],
      "Thriller": ["Noir", "Conspiracy", "Techno-Thriller"],
      "Comedy": ["Slapstick", "Rom-Com", "Satirical"],
      "Slice of Life": ["Modern", "Coming-of-Age", "Cozy"]
    },
  
    SETTING: {
      "Sci-Fi": ["Space", "Alien World", "Wasteland"],
      "Fantasy": ["Fantasy World", "Dark Ages", "Myth and Legend"],
      "Horror": ["Noir", "Wasteland", "Dark Ages"],
      "Mystery": ["Noir", "Modern City", "Historical"],
      "Romance": ["Modern City", "Historical", "Fantasy World"],
      "Fiction": ["Modern", "Historical", "Small Town"],
      "Thriller": ["City", "Military Base", "Dystopia"],
      "Comedy": ["Modern", "Office", "Small Town"],
      "Slice of Life": ["Small Town", "School", "Modern Apartment"]
    },
  
    CHARACTER: {
      "Sci-Fi": ["Scientist", "Pilot", "Engineer", "Soldier"],
      "Fantasy": ["Wizard", "Knight", "Thief", "Druid"],
      "Horror": ["Survivor", "Paranormal Investigator", "Scholar"],
      "Mystery": ["Detective", "Reporter", "Librarian"],
      "Romance": ["Artist", "Student", "Barista", "Office Worker"],
      "Fiction": ["Writer", "Teacher", "Parent", "Clerk"],
      "Thriller": ["Agent", "Mercenary", "Hacker"],
      "Comedy": ["Oddball", "Slacker", "Substitute Teacher"],
      "Slice of Life": ["Student", "Single Parent", "Shopkeeper"]
    },
    
    BACKSTORY: ["Betrayed", "In Debt", "Noble", "Survivor", "Chosen", "Marked", "Reformed", "Exiled", "Prodigy", "Protoge"],
    DESCRIPTORS:["Weathered", "Graceful", "Imposing", "Scrappy", "Elegant", "Ragged", "Bright-eyed", "Scarred", "Soft-spoken", "Tattooed", "Shifty", "Dapper", "Wild-haired", "Cloaked", "Nimble", "Stoic", "Cheerful", "Pale", "Hardened", "Ink-stained"],
    PERSONALITY:["Curious", "Loyal", "Stubborn", "Kind", "Arrogant", "Calculating", "Quiet", "Sarcastic", "Brave", "Impulsive", "Thoughtful", "Cynical", "Idealistic", "Blunt", "Playful", "Dutiful", "Hot-headed", "Grumpy", "Eager", "Patient"],
    BONDS:["Loyal to their hometown", "Protects a younger sibling", "Seeks to honor a lost mentor", "Bound by an ancient vow", "In love with someone unreachable", "Owes their life to a stranger", "Defends the innocent", "Keeps a family heirloom close", "Devoted to a god or cause", "Swore to protect a sacred site", "Desires to rebuild their homeland", "Watches over an old friend’s child", "Carries on a family tradition", "Seeks vengeance for their kin", "In search of a lost companion", "Free Spirit"],
    FLAWS: ["Quick to anger", "Can’t keep a secret", "Haunted by guilt", "Addicted to risk", "Trusts too easily", "Holds grudges", "Obsessed with proving themselves", "Terrible with money", "Craves attention", "Overprotective", "Paranoid", "Self-sacrificing", "Avoids confrontation", "Lies compulsively", "Can’t resist a challenge", "Emotionally closed off", "Greedy", "Reckless", "Jealous", "Afraid of failure"],
    MOOD: ["Hopeful", "Tragic", "Grimdark", "Melancholic", "Uplifting", "Absurdist", "Suspenseful", "Comedic", "Dreamlike", "Romantic"],
  };
  
  const template = `GENRE: $GENRE

SUBGENRE: $SUBGENRE

SETTING: $SETTING
  
MOOD: $MOOD
  
CHARACTER: $CHARACTER
- BACKSTORY: $BACKSTORY
- CHARACTERISTICS:
- - DESCRIPTORS: $DESCRIPTORS
- - PERSONALITY: $PERSONALITY
- - BONDS: $BONDS
- - FLAWS: $FLAWS
  `;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  function getRandomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
  function getUniqueRandom(array, count) {
    const shuffled = array.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      if (name === "DESCRIPTORS") {
        return getUniqueRandom(options, 3).join(", ");
      }
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    const story = { GENRE: "", SUBGENRE: "", SETTING: "", CHARACTER: "" };
  
    story.GENRE = getRandomFrom(fillers.GENRE);
    story.SUBGENRE = getRandomFrom(fillers.SUBGENRE[story.GENRE]);
    story.SETTING = getRandomFrom(fillers.SETTING[story.GENRE]);
    story.CHARACTER = getRandomFrom(fillers.CHARACTER[story.GENRE]);
  
    // Replace tokens in template
    let output = template
       .replace("$GENRE", ` ${story.GENRE}`)
      .replace("$SUBGENRE", ` ${story.SUBGENRE}`)
      .replace("$SETTING", ` ${story.SETTING}`)
      .replace("$CHARACTER", ` ${story.CHARACTER}`)
      .replace(/\$(\w+)/g, replacer);  // This will handle other placeholders like BACKSTORY, MOOD, etc.
    // Replace newlines with <br> to preserve formatting
    $('#box').text(output);
    
    // Display the formatted output in the output div
    //document.getElementById("output").innerHTML = output;
  }
  $("#clicker").click(generate);
  
  // Set up the button to generate the story when clicked
  //document.getElementById("clicker").onclick = generate;
  
  // Initial generate on page load
  generate();
}

// let's get this party started - uncomment me
main();