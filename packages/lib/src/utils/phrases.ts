import ms from 'ms';

/**
 * Get a random **cooldown** message.
 * @param remaining
 */
export function cooldown(remaining: number) {
  const timeLeft = ms(remaining, { long: true });

  const messages = [
    `Hold up! Try again in \`${timeLeft}\`.`,
    `Whoa, slow down! Wait \`${timeLeft}\`.`,
    `Cooldown active. Retry in \`${timeLeft}\`.`,
    `Chill for \`${timeLeft}\` before trying again.`,
    `Patience, please. \`${timeLeft}\` left.`,
    `Command on cooldown. Try in \`${timeLeft}\`.`,
    `Wait \`${timeLeft}\` before using that again.`,
    `Take a break! \`${timeLeft}\` timeLeft.`,
    `Not so fast! \`${timeLeft}\` to go.`,
    `Ready in \`${timeLeft}\`. Hang in there.`,
    `Hold your horses! \`${timeLeft}\` left.`,
    `Hold that thought for \`${timeLeft}\`.`,
    `Just a moment, \`${timeLeft}\` to go.`,
    `Cooldown in progress. \`${timeLeft}\` left.`,
    `Patience is a virtue. Wait \`${timeLeft}\`.`,
    `Let it cool for \`${timeLeft}\`, please.`,
    `Hold on! \`${timeLeft}\` to wait.`,
    `Relax, \`${timeLeft}\` before retrying.`,
    `Rest a bit! \`${timeLeft}\` timeLeft.`,
    `Hold tight! \`${timeLeft}\` left.`,
    `Slow down, buddy. \`${timeLeft}\` left.`,
    `Not yet! Wait \`${timeLeft}\` more.`,
    `Almost there, \`${timeLeft}\` to go.`,
    `Hold your fire! \`${timeLeft}\` left.`,
    `Give it a sec. \`${timeLeft}\` timeLeft.`,
    `Let it breathe. \`${timeLeft}\` to go.`,
    `Take it easy. \`${timeLeft}\` timeLeft.`,
    `Hold on a sec! \`${timeLeft}\` left.`,
    `In a jiffy! \`${timeLeft}\` to wait.`,
    `Just a bit more. \`${timeLeft}\` left.`,
    `Hold off for \`${timeLeft}\`, please.`,
    `Wait up! \`${timeLeft}\` left.`,
    `Not quite yet. \`${timeLeft}\` left.`,
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

export function insufficientFunds(moneyMissing: BigInt) {
  const messages = [
    `You need \`$${moneyMissing}\` more to afford that.`,
    `Looks like you're \`$${moneyMissing}\` short for that purchase.`,
    `Keep saving up! You're almost there, just \`$${moneyMissing}\` left.`,
    `It's great to treat yourself, but you still need \`$${moneyMissing}\` more.`,
    `Don't worry, with just \`$${moneyMissing}\` more, you can afford that.`,
    `Your wallet is getting lighter, you need \`$${moneyMissing}\` to make that purchase.`,
    `Can't buy happiness with \`$${moneyMissing}\` missing from your budget.`,
    `That item is out of reach for now, you need \`$${moneyMissing}\` more.`,
    `A little more saving and \`$${moneyMissing}\` will be in your pocket.`,
    `You're almost able to afford that, just \`$${moneyMissing}\` left to go.`,
    `Time to save up, you need \`$${moneyMissing}\` more for that.`,
    `Keep going! You need \`$${moneyMissing}\` more to get what you want.`,
    `Don't break the bank! You still need \`$${moneyMissing}\` for that.`,
    `Looks like you'll have to hold off for now, \`$${moneyMissing}\` is still missing.`,
    `It's not about the destination, but the journey. You need \`$${moneyMissing}\` to complete it.`,
    `Let's focus on budgeting. You need \`$${moneyMissing}\` to make that purchase.`,
    `Keep working hard, you need \`$${moneyMissing}\` more for that.`,
    `That's a great choice, but you need \`$${moneyMissing}\` more to make it happen.`,
    `Don't rush it! You still need \`$${moneyMissing}\` to make that purchase.`,
    `Patience is key, you need \`$${moneyMissing}\` more for that.`,
    `You're almost there! Just \`$${moneyMissing}\` more to afford it.`,
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}
