import chalk from 'chalk';
import promptSync from 'prompt-sync';
import fs from 'fs';

const prompt = promptSync({
	sigint: true,
});

// setup the different output themes
const theme_code = chalk.underline.cyan;
const theme_name = chalk.inverse.green;
const theme_description = chalk.white;
const theme_answerLetter = chalk.inverse.yellow;
const theme_answer = chalk.white;
const theme_progress = chalk.bold.white;
const theme_question = chalk.bold.cyan;
const theme_correct = chalk.bold.green;
const theme_wrong = chalk.bold.red;
const theme_perfect = chalk.inverse.yellow;
const answerLetters = [0, 1, 2, 3];		

function askQuestion(code, name, description, answers) {
	console.log(theme_code('Rule ' + code) + theme_answer(' - ') + theme_name(name));
	console.log(theme_description(description));

	let i = 0;
	for(const answer of answers) {
		console.log(theme_answerLetter(answerLetters[i] + ')') + theme_answer(' ' + answer));
		i ++;
	}

	return prompt(theme_question('Answer: '));
}

// import the rules
const rawRules = fs.readFileSync('rules.json');
const { rules } = JSON.parse(rawRules);

const ruleN = rules.length;

const indexes = [];
for(const index in rules) {
	indexes.push(parseInt(index));
}

// ask the questions
let correctN = 0;
while(indexes.length > 0) {
	console.log('\n');
	console.log(theme_progress(`${(ruleN - indexes.length + 1)} / ${ruleN}`));

	const randomQuestionIndex = Math.floor(Math.random() * indexes.length);
	const questionIndex = indexes[randomQuestionIndex];
	indexes.splice(randomQuestionIndex, 1);

	const question = rules[questionIndex];
	const code = question.code;
	const name = question.name;
	const description = question.description;
	const answer = question.violation;

	const randomAnswers = [];
	for(let i = 0; i < 3; i ++) {
		const randomIndex = Math.floor(Math.random() * rules.length);
		const randomRule = rules[randomIndex];
		const randomAnswer = randomRule.violation;

		if(answer == randomAnswer || randomAnswers.includes(randomAnswer)) {
			i --;
			continue;
		}

		randomAnswers.push(randomAnswer);
	}

	const correctIndex = Math.floor(Math.random() * 4);
	randomAnswers.splice(correctIndex, 0, answer);

	const userInput = askQuestion(code, name, description, randomAnswers);

	if(userInput == correctIndex) {
		console.log(theme_correct('✓ Correct!'));
		correctN ++;
	} else {
		console.log(theme_wrong('✖ Incorrect!'));
		console.log(theme_answer(`The correct answer is "${answer}"`))
	}
}

if(correctN == ruleN) {
	console.log(theme_perfect('☆☆☆ You scored 100% ☆☆☆'));
} else {
	console.log(theme_wrong(`✖✖✖ You scored ${correctN}/${ruleN}✖✖✖`));
}