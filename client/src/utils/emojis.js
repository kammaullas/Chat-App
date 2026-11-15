export const EMOJI_CATEGORIES = [
  {
    name: "Smileys & Emotion",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "😉", "😍", "🥰", "😘", "😋", "😎", "🤩", "🥳", "🤔", "🤫", "🤗"]
  },
  {
    name: "Gestures & People",
    emojis: ["👍", "👎", "👏", "🙌", "👋", "👌", "✌️", "🤞", "🤝", "🙏", "💪", "❤️", "💖", "🔥", "✨", "🎉"]
  },
  {
    name: "Work & Objects",
    emojis: ["🚀", "💡", "⚡", "💻", "📊", "📈", "⚙️", "✅", "⚠️", "📌", "💬", "👀"]
  }
];

export const ALL_EMOJIS = EMOJI_CATEGORIES.flatMap((c) => c.emojis);

