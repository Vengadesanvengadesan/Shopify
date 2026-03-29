function getRandomQuote(quotes) {
    const index = Math.floor(Math.random() * quotes.length);
    console.log(` Quote of the Day: ${quotes[index]}`);
}

module.exports = getRandomQuote;