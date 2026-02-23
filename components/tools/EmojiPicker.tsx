"use client";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";

interface EmojiEntry { emoji: string; name: string; category: string; }

const EMOJIS: EmojiEntry[] = [
  // Smileys
  { emoji: "😀", name: "grinning face", category: "smileys" },
  { emoji: "😃", name: "grinning face big eyes", category: "smileys" },
  { emoji: "😄", name: "grinning face smiling eyes", category: "smileys" },
  { emoji: "😁", name: "beaming face smiling eyes", category: "smileys" },
  { emoji: "😆", name: "grinning squinting face", category: "smileys" },
  { emoji: "😅", name: "grinning face sweat", category: "smileys" },
  { emoji: "🤣", name: "rolling floor laughing", category: "smileys" },
  { emoji: "😂", name: "face tears joy laugh", category: "smileys" },
  { emoji: "🙂", name: "slightly smiling face", category: "smileys" },
  { emoji: "🙃", name: "upside down face", category: "smileys" },
  { emoji: "😉", name: "winking face", category: "smileys" },
  { emoji: "😊", name: "smiling face smiling eyes", category: "smileys" },
  { emoji: "😇", name: "smiling face halo angel", category: "smileys" },
  { emoji: "🥰", name: "smiling face hearts love", category: "smileys" },
  { emoji: "😍", name: "smiling face heart eyes love", category: "smileys" },
  { emoji: "🤩", name: "star struck excited", category: "smileys" },
  { emoji: "😘", name: "face blowing kiss", category: "smileys" },
  { emoji: "😋", name: "face savoring food yum", category: "smileys" },
  { emoji: "😛", name: "face with tongue", category: "smileys" },
  { emoji: "😜", name: "winking face tongue", category: "smileys" },
  { emoji: "🤪", name: "zany face", category: "smileys" },
  { emoji: "🤑", name: "money mouth face", category: "smileys" },
  { emoji: "🤗", name: "hugging face", category: "smileys" },
  { emoji: "🤭", name: "face hand over mouth", category: "smileys" },
  { emoji: "🤫", name: "shushing face quiet", category: "smileys" },
  { emoji: "🤔", name: "thinking face", category: "smileys" },
  { emoji: "😐", name: "neutral face", category: "smileys" },
  { emoji: "😑", name: "expressionless face", category: "smileys" },
  { emoji: "😏", name: "smirking face", category: "smileys" },
  { emoji: "😒", name: "unamused face", category: "smileys" },
  { emoji: "🙄", name: "face rolling eyes", category: "smileys" },
  { emoji: "😬", name: "grimacing face", category: "smileys" },
  { emoji: "😮", name: "face open mouth surprised", category: "smileys" },
  { emoji: "😲", name: "astonished face", category: "smileys" },
  { emoji: "😳", name: "flushed face embarrassed", category: "smileys" },
  { emoji: "🥺", name: "pleading face puppy eyes", category: "smileys" },
  { emoji: "😢", name: "crying face sad", category: "smileys" },
  { emoji: "😭", name: "loudly crying face", category: "smileys" },
  { emoji: "😱", name: "face screaming fear", category: "smileys" },
  { emoji: "😩", name: "weary face", category: "smileys" },
  { emoji: "😫", name: "tired face", category: "smileys" },
  { emoji: "🥱", name: "yawning face", category: "smileys" },
  { emoji: "😤", name: "face steam nose angry", category: "smileys" },
  { emoji: "😡", name: "enraged face angry", category: "smileys" },
  { emoji: "😠", name: "angry face", category: "smileys" },
  { emoji: "🤬", name: "face symbols mouth", category: "smileys" },
  { emoji: "😈", name: "smiling face horns devil", category: "smileys" },
  { emoji: "👿", name: "angry face horns", category: "smileys" },
  { emoji: "💀", name: "skull death", category: "smileys" },
  { emoji: "💩", name: "pile poo", category: "smileys" },
  { emoji: "🤡", name: "clown face", category: "smileys" },
  { emoji: "👻", name: "ghost", category: "smileys" },
  { emoji: "👽", name: "alien", category: "smileys" },
  { emoji: "🤖", name: "robot", category: "smileys" },
  { emoji: "😺", name: "grinning cat", category: "smileys" },
  { emoji: "😸", name: "grinning cat smiling eyes", category: "smileys" },
  { emoji: "😹", name: "cat tears joy", category: "smileys" },
  { emoji: "😻", name: "smiling cat heart eyes", category: "smileys" },
  { emoji: "😿", name: "crying cat", category: "smileys" },
  // People
  { emoji: "👋", name: "waving hand hello", category: "people" },
  { emoji: "✋", name: "raised hand stop", category: "people" },
  { emoji: "👌", name: "ok hand", category: "people" },
  { emoji: "✌️", name: "victory hand peace", category: "people" },
  { emoji: "🤞", name: "crossed fingers luck", category: "people" },
  { emoji: "🤟", name: "love you gesture", category: "people" },
  { emoji: "🤘", name: "sign of horns rock", category: "people" },
  { emoji: "👈", name: "backhand index pointing left", category: "people" },
  { emoji: "👉", name: "backhand index pointing right", category: "people" },
  { emoji: "👆", name: "backhand index pointing up", category: "people" },
  { emoji: "👇", name: "backhand index pointing down", category: "people" },
  { emoji: "👍", name: "thumbs up like", category: "people" },
  { emoji: "👎", name: "thumbs down dislike", category: "people" },
  { emoji: "✊", name: "raised fist", category: "people" },
  { emoji: "👊", name: "oncoming fist punch", category: "people" },
  { emoji: "👏", name: "clapping hands applause", category: "people" },
  { emoji: "🙌", name: "raising hands celebrate", category: "people" },
  { emoji: "🙏", name: "folded hands pray thanks", category: "people" },
  { emoji: "✍️", name: "writing hand", category: "people" },
  { emoji: "💪", name: "flexed biceps strong muscle", category: "people" },
  { emoji: "🧠", name: "brain", category: "people" },
  { emoji: "👀", name: "eyes look see", category: "people" },
  { emoji: "👶", name: "baby", category: "people" },
  { emoji: "👦", name: "boy", category: "people" },
  { emoji: "👧", name: "girl", category: "people" },
  { emoji: "🧑", name: "person adult", category: "people" },
  { emoji: "👨", name: "man", category: "people" },
  { emoji: "👩", name: "woman", category: "people" },
  { emoji: "👴", name: "old man elderly", category: "people" },
  { emoji: "👵", name: "old woman elderly", category: "people" },
  { emoji: "👮", name: "police officer", category: "people" },
  { emoji: "🧑‍⚕️", name: "health worker doctor nurse", category: "people" },
  { emoji: "👨‍🍳", name: "man cook chef", category: "people" },
  { emoji: "👩‍🍳", name: "woman cook chef", category: "people" },
  { emoji: "👨‍🎓", name: "man student graduate", category: "people" },
  { emoji: "👩‍🎓", name: "woman student graduate", category: "people" },
  { emoji: "👨‍💻", name: "man technologist developer programmer", category: "people" },
  { emoji: "👩‍💻", name: "woman technologist developer programmer", category: "people" },
  { emoji: "👨‍🎨", name: "man artist", category: "people" },
  { emoji: "👩‍🎨", name: "woman artist", category: "people" },
  // Animals
  { emoji: "🐶", name: "dog face", category: "animals" },
  { emoji: "🐱", name: "cat face", category: "animals" },
  { emoji: "🐭", name: "mouse face", category: "animals" },
  { emoji: "🐹", name: "hamster", category: "animals" },
  { emoji: "🐰", name: "rabbit face", category: "animals" },
  { emoji: "🦊", name: "fox", category: "animals" },
  { emoji: "🐻", name: "bear", category: "animals" },
  { emoji: "🐼", name: "panda", category: "animals" },
  { emoji: "🐨", name: "koala", category: "animals" },
  { emoji: "🐯", name: "tiger face", category: "animals" },
  { emoji: "🦁", name: "lion", category: "animals" },
  { emoji: "🐮", name: "cow face", category: "animals" },
  { emoji: "🐷", name: "pig face", category: "animals" },
  { emoji: "🐸", name: "frog", category: "animals" },
  { emoji: "🐵", name: "monkey face", category: "animals" },
  { emoji: "🐔", name: "chicken", category: "animals" },
  { emoji: "🐧", name: "penguin", category: "animals" },
  { emoji: "🦆", name: "duck", category: "animals" },
  { emoji: "🦅", name: "eagle", category: "animals" },
  { emoji: "🦉", name: "owl", category: "animals" },
  { emoji: "🦋", name: "butterfly", category: "animals" },
  { emoji: "🐝", name: "honeybee", category: "animals" },
  { emoji: "🐞", name: "ladybug", category: "animals" },
  { emoji: "🐟", name: "fish", category: "animals" },
  { emoji: "🐬", name: "dolphin", category: "animals" },
  { emoji: "🐳", name: "whale", category: "animals" },
  { emoji: "🦈", name: "shark", category: "animals" },
  { emoji: "🐢", name: "turtle", category: "animals" },
  { emoji: "🐍", name: "snake", category: "animals" },
  { emoji: "🦕", name: "sauropod dinosaur", category: "animals" },
  { emoji: "🐉", name: "dragon", category: "animals" },
  { emoji: "🌿", name: "herb plant", category: "animals" },
  { emoji: "🍀", name: "four leaf clover lucky", category: "animals" },
  { emoji: "🌻", name: "sunflower", category: "animals" },
  { emoji: "🌹", name: "rose flower", category: "animals" },
  // Food
  { emoji: "🍎", name: "red apple", category: "food" },
  { emoji: "🍊", name: "tangerine orange", category: "food" },
  { emoji: "🍋", name: "lemon", category: "food" },
  { emoji: "🍇", name: "grapes", category: "food" },
  { emoji: "🍓", name: "strawberry", category: "food" },
  { emoji: "🍒", name: "cherries", category: "food" },
  { emoji: "🍑", name: "peach", category: "food" },
  { emoji: "🥭", name: "mango", category: "food" },
  { emoji: "🍍", name: "pineapple", category: "food" },
  { emoji: "🥥", name: "coconut", category: "food" },
  { emoji: "🥝", name: "kiwi fruit", category: "food" },
  { emoji: "🍅", name: "tomato", category: "food" },
  { emoji: "🥕", name: "carrot", category: "food" },
  { emoji: "🌽", name: "ear of corn", category: "food" },
  { emoji: "🌶️", name: "hot pepper chili", category: "food" },
  { emoji: "🥦", name: "broccoli", category: "food" },
  { emoji: "🥑", name: "avocado", category: "food" },
  { emoji: "🍕", name: "pizza", category: "food" },
  { emoji: "🍔", name: "hamburger burger", category: "food" },
  { emoji: "🌮", name: "taco", category: "food" },
  { emoji: "🌯", name: "burrito wrap", category: "food" },
  { emoji: "🍜", name: "steaming bowl noodles ramen", category: "food" },
  { emoji: "🍣", name: "sushi", category: "food" },
  { emoji: "🍱", name: "bento box", category: "food" },
  { emoji: "🍦", name: "soft ice cream", category: "food" },
  { emoji: "🍰", name: "shortcake dessert", category: "food" },
  { emoji: "🎂", name: "birthday cake", category: "food" },
  { emoji: "☕", name: "hot beverage coffee tea", category: "food" },
  { emoji: "🧃", name: "juice box drink", category: "food" },
  { emoji: "🥤", name: "cup with straw soda", category: "food" },
  { emoji: "🍺", name: "beer mug", category: "food" },
  { emoji: "🍷", name: "wine glass", category: "food" },
  { emoji: "🍸", name: "cocktail glass", category: "food" },
  // Travel
  { emoji: "🚀", name: "rocket space launch", category: "travel" },
  { emoji: "✈️", name: "airplane flight", category: "travel" },
  { emoji: "🚗", name: "automobile car", category: "travel" },
  { emoji: "🚕", name: "taxi cab", category: "travel" },
  { emoji: "🚌", name: "bus", category: "travel" },
  { emoji: "🚓", name: "police car", category: "travel" },
  { emoji: "🚑", name: "ambulance", category: "travel" },
  { emoji: "🚒", name: "fire engine", category: "travel" },
  { emoji: "🚚", name: "delivery truck", category: "travel" },
  { emoji: "🚢", name: "ship boat", category: "travel" },
  { emoji: "⛵", name: "sailboat", category: "travel" },
  { emoji: "🚁", name: "helicopter", category: "travel" },
  { emoji: "🛸", name: "flying saucer ufo", category: "travel" },
  { emoji: "🚂", name: "locomotive train", category: "travel" },
  { emoji: "🏠", name: "house home", category: "travel" },
  { emoji: "🏢", name: "office building", category: "travel" },
  { emoji: "🏰", name: "castle", category: "travel" },
  { emoji: "🗺️", name: "world map", category: "travel" },
  { emoji: "🌍", name: "globe earth europe africa", category: "travel" },
  { emoji: "🌎", name: "globe earth americas", category: "travel" },
  { emoji: "🌏", name: "globe earth asia australia", category: "travel" },
  { emoji: "🗼", name: "tokyo tower", category: "travel" },
  { emoji: "🗽", name: "statue of liberty", category: "travel" },
  { emoji: "🏖️", name: "beach umbrella vacation", category: "travel" },
  { emoji: "🏔️", name: "snow capped mountain", category: "travel" },
  { emoji: "🌴", name: "palm tree tropical", category: "travel" },
  // Objects
  { emoji: "💻", name: "laptop computer", category: "objects" },
  { emoji: "🖥️", name: "desktop computer monitor", category: "objects" },
  { emoji: "📱", name: "mobile phone smartphone", category: "objects" },
  { emoji: "⌨️", name: "keyboard", category: "objects" },
  { emoji: "🖱️", name: "computer mouse", category: "objects" },
  { emoji: "💾", name: "floppy disk save", category: "objects" },
  { emoji: "📺", name: "television tv", category: "objects" },
  { emoji: "📷", name: "camera photo", category: "objects" },
  { emoji: "🔭", name: "telescope", category: "objects" },
  { emoji: "🔬", name: "microscope science", category: "objects" },
  { emoji: "⚗️", name: "alembic chemistry", category: "objects" },
  { emoji: "🧲", name: "magnet", category: "objects" },
  { emoji: "💡", name: "light bulb idea", category: "objects" },
  { emoji: "🔑", name: "key", category: "objects" },
  { emoji: "🔨", name: "hammer tool", category: "objects" },
  { emoji: "⚙️", name: "gear settings", category: "objects" },
  { emoji: "🔧", name: "wrench repair", category: "objects" },
  { emoji: "🧰", name: "toolbox", category: "objects" },
  { emoji: "📚", name: "books reading", category: "objects" },
  { emoji: "📖", name: "open book read", category: "objects" },
  { emoji: "✏️", name: "pencil write", category: "objects" },
  { emoji: "📝", name: "memo note write", category: "objects" },
  { emoji: "📌", name: "pushpin pin", category: "objects" },
  { emoji: "📎", name: "paperclip attach", category: "objects" },
  { emoji: "✂️", name: "scissors cut", category: "objects" },
  { emoji: "🗑️", name: "wastebasket trash delete", category: "objects" },
  { emoji: "🔒", name: "locked security", category: "objects" },
  { emoji: "🔓", name: "unlocked open", category: "objects" },
  { emoji: "💊", name: "pill medicine", category: "objects" },
  { emoji: "🩺", name: "stethoscope doctor", category: "objects" },
  // Symbols
  { emoji: "❤️", name: "red heart love", category: "symbols" },
  { emoji: "🧡", name: "orange heart", category: "symbols" },
  { emoji: "💛", name: "yellow heart", category: "symbols" },
  { emoji: "💚", name: "green heart", category: "symbols" },
  { emoji: "💙", name: "blue heart", category: "symbols" },
  { emoji: "💜", name: "purple heart", category: "symbols" },
  { emoji: "🖤", name: "black heart", category: "symbols" },
  { emoji: "💔", name: "broken heart", category: "symbols" },
  { emoji: "💯", name: "hundred points perfect", category: "symbols" },
  { emoji: "✅", name: "check mark button done", category: "symbols" },
  { emoji: "❌", name: "cross mark error wrong", category: "symbols" },
  { emoji: "⚡", name: "high voltage lightning", category: "symbols" },
  { emoji: "🔥", name: "fire hot flame", category: "symbols" },
  { emoji: "💧", name: "droplet water", category: "symbols" },
  { emoji: "🌊", name: "wave water ocean", category: "symbols" },
  { emoji: "⭐", name: "star", category: "symbols" },
  { emoji: "🌟", name: "glowing star", category: "symbols" },
  { emoji: "✨", name: "sparkles shine", category: "symbols" },
  { emoji: "🎵", name: "musical note music", category: "symbols" },
  { emoji: "🎶", name: "musical notes music", category: "symbols" },
  { emoji: "🎉", name: "party popper celebrate", category: "symbols" },
  { emoji: "🎊", name: "confetti ball party", category: "symbols" },
  { emoji: "🏆", name: "trophy winner", category: "symbols" },
  { emoji: "🥇", name: "first place medal gold", category: "symbols" },
  { emoji: "🎯", name: "direct hit target", category: "symbols" },
  { emoji: "🎮", name: "video game controller", category: "symbols" },
  { emoji: "♻️", name: "recycling symbol environment", category: "symbols" },
  { emoji: "🔔", name: "bell notification", category: "symbols" },
  { emoji: "💬", name: "speech bubble chat", category: "symbols" },
  { emoji: "💭", name: "thought balloon thinking", category: "symbols" },
  { emoji: "ℹ️", name: "information", category: "symbols" },
  { emoji: "⚠️", name: "warning caution", category: "symbols" },
  { emoji: "🚫", name: "prohibited forbidden no", category: "symbols" },
  { emoji: "✔️", name: "check mark correct", category: "symbols" },
  { emoji: "➕", name: "plus add", category: "symbols" },
  { emoji: "➖", name: "minus subtract", category: "symbols" },
  { emoji: "❓", name: "question mark", category: "symbols" },
  { emoji: "❗", name: "exclamation mark important", category: "symbols" },
  { emoji: "🔗", name: "link chain url", category: "symbols" },
  { emoji: "📧", name: "email envelope message", category: "symbols" },
  { emoji: "📞", name: "telephone call phone", category: "symbols" },
];

type Category = "all" | "smileys" | "people" | "animals" | "food" | "travel" | "objects" | "symbols";

export default function EmojiPicker() {
  const t = useTranslations("EmojiPicker");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [copiedEmoji, setCopiedEmoji] = useState("");

  const filtered = useMemo(() => {
    let list = EMOJIS;
    if (category !== "all") list = list.filter((e) => e.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.name.includes(q) || e.emoji === q);
    }
    return list;
  }, [search, category]);

  function copy(emoji: string) {
    navigator.clipboard.writeText(emoji).then(() => {
      setCopiedEmoji(emoji);
      setTimeout(() => setCopiedEmoji(""), 1500);
    });
  }

  const categories: { value: Category; label: string }[] = [
    { value: "all", label: t("allCategory") },
    { value: "smileys", label: t("smileysCategory") },
    { value: "people", label: t("peopleCategory") },
    { value: "animals", label: t("animalsCategory") },
    { value: "food", label: t("foodCategory") },
    { value: "travel", label: t("travelCategory") },
    { value: "objects", label: t("objectsCategory") },
    { value: "symbols", label: t("symbolsCategory") },
  ];

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
      />
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              category === cat.value ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{t("noResults")}</p>
      ) : (
        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1">
          {filtered.map((entry) => (
            <button
              key={entry.emoji + entry.name}
              onClick={() => copy(entry.emoji)}
              title={entry.name}
              className={`text-2xl p-1.5 rounded-lg transition-colors hover:bg-gray-700 ${
                copiedEmoji === entry.emoji ? "bg-indigo-600/30 ring-1 ring-indigo-500" : ""
              }`}
            >
              {entry.emoji}
            </button>
          ))}
        </div>
      )}
      {copiedEmoji && (
        <div className="text-center text-sm text-indigo-400">
          {t("copied")} {copiedEmoji}
        </div>
      )}
    </div>
  );
}
