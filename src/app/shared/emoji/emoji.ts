export interface Emoji {
  emoji: string;
  name: string;
}

export function mapToEmoji(apiEmoji: any): Emoji {
  return { emoji: apiEmoji.character, name: apiEmoji.unicodeName };
}

export function mapToEmojis(result: any[]): Emoji[] {
  return result.map(mapToEmoji);
}
