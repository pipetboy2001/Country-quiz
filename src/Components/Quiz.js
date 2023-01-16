import React, { useState, useEffect } from 'react'
import OptionButton from './OptionButton'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import '../Styles/Quiz.css'

const Quiz = () => {
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [CountryData, setCountryData] = useState([]);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isCorrecta, setIsCorrect] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [quizStarted, setQuizStarted] = useState(false);

    useEffect(() => {
        if (!isDataLoaded) {
            axios.get('https://restcountries.com/v2/all')
                .then(response => {
                    setCountryData(response.data);
                    setIsDataLoaded(true);
                })
                .catch(error => {
                    console.log(error)
                });
        }
    }, [isDataLoaded]);

    useEffect(() => {
        if (CountryData && CountryData.length) {
            generateRandomQuestions();
        }
    }, [CountryData])

    /**
    *@function
    *@param {function} - A callback function that will be executed after the component renders.
    *@param {Array} - A dependency array that tells React when to re-run the effect.
    *This function generates random questions, it initializes the questions array and the score to 0, then using a loop it randomly select a country from the CountryData array and creates an object question with different parameters like the text, correctAnswer, options and an image.
    Then it shuffles the options and pushes the question object to the questions array.
    Finally, it sets the current question index to 0.
    */
    function generateRandomQuestions() {
        setQuestions([]);
        setScore(0);
        console.log("SetScore: " + score);
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * CountryData.length);
            const randomCountry = CountryData[randomIndex];
            let question;
            question = {
                text: `What is the capital of ${randomCountry.name}?`,
                correctAnswer: randomCountry.capital,
                options: shuffle([randomCountry.capital, randomCountry.altSpellings[1], randomCountry.region, randomCountry.subregion])
            }
            questions.push(question);
            question = {
                text: `¿What country does this flag belong to?`,
                img: randomCountry.flag,
                correctAnswer: randomCountry.name,
                options: shuffle([randomCountry.name, CountryData[(randomIndex + 1) % CountryData.length].name, CountryData[(randomIndex + 2) % CountryData.length].name, CountryData[(randomIndex + 3) % CountryData.length].name])
            }
            questions.push(question);
        }
        setQuestions(questions);
        setCurrentQuestionIndex(0);
    }

    /**
    *@function shuffle
    *@param {Array} array - The array that will be shuffled
    This function takes an array as a parameter and using a for loop it shuffles the elements of the array. 
    It uses the Fisher-Yates shuffle algorithm to randomly rearrange the elements 
    of the array and then returns the shuffled array.
    */
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (
                i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
    *@function checkAnswer
    This function check if the selected option is the correct answer,
    if so it increases the score by 1, and then it checks if the current question is the last one,
     if not it sets the selected option to null and move to the next question, 
     otherwise it sets the quizCompleted to true.
    */
    function checkAnswer() {
        setIsCorrect(selectedOption === questions[currentQuestionIndex].correctAnswer);
        if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
            setScore((score + 1));
        }
        // Move to next question
        if (currentQuestionIndex + 1 < 4) {
            setSelectedOption(null);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
        else {
            setQuizCompleted(true);
        }
    }

    /**
     * @function restartQuiz
     * This function restarts the quiz by generating new random questions 
     * and setting the quizCompleted state to false.
     */
    function restartQuiz() {
        generateRandomQuestions();
        setQuizCompleted(false);
    }
    /**

    @function handleAnswerSelection
    @param {string} answer - The selected answer
    This function handles the answer selection by the user,
    it sets isCorrect to true if the selected answer is the correct one 
    and sets the selectedOption state to the selected answer.
    */
    function handleAnswerSelection(answer) {
        setIsCorrect(selectedOption === questions[currentQuestionIndex].correctAnswer);
        setSelectedOption(answer);
    }

    function Refrescar() {
        window.location.reload();
    }

    return (
        <div>
            <div className='container' onClick={Refrescar}>
                <h3 className='title'>CountryQuiz</h3>
                <img className='imgTitle' src='https://raw.githubusercontent.com/pipetboy2001/Country-quiz/0ef5f12a857f8e7b88ccba57851213cee3c6bff6/src/Assests/ContryQuiz.svg' alt="Quiz logo" />
            </div>
            {
                !quizStarted && !quizCompleted &&
                <Card className='Card' style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>¿Are you ready?</Card.Title>
                        <Card.Text>
                            ¿Do you know the capitals of the countries of the world?
                        </Card.Text>
                        <Button variant="primary" onClick={() => setQuizStarted(true)}>Start</Button>
                    </Card.Body>

                </Card>

            }

            {quizStarted && !quizCompleted && questions.length === 0 &&
                <Card className='Card' style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>Loading...</Card.Title>
                        <h5>does not load? reload and try again</h5>
                        <Button variant="primary" onClick={Refrescar}>
                            Reload
                        </Button>
                    </Card.Body>
                </Card>
            }


            {!quizCompleted && quizStarted && questions.length > 0 &&
                <Card className='Card' style={{ width: '18rem' }}>
                    <Card.Body>
                        <p className='Question'>{questions[currentQuestionIndex].text}</p>
                        {questions[currentQuestionIndex].img && <img className='Flag' src={questions[currentQuestionIndex].img} alt='Flag' />}
                        <ul>
                            {questions[currentQuestionIndex].options.map((option, index) => (
                                <li key={index}>
                                    <OptionButton
                                        className='Answer'
                                        key={index}
                                        option={option}
                                        onClick={handleAnswerSelection}
                                        isSelected={selectedOption === option}
                                        isCorrect={selectedOption === questions[currentQuestionIndex].correctAnswer}
                                    />
                                </li>
                            ))}
                        </ul>
                        <Button variant='outline-primary' className='Subimit' onClick={() => {
                            if (selectedOption) {
                                checkAnswer();
                            }
                        }}>Check Answer</Button>
                    </Card.Body>
                </Card>
            }
            {quizCompleted &&
                <Card className='Card' style={{ width: '18rem' }}>
                    <Card.Body>
                        <img className='WinnerImg' src='https://raw.githubusercontent.com/pipetboy2001/Country-quiz/0ef5f12a857f8e7b88ccba57851213cee3c6bff6/src/Assests/Winners.svg' alt="Quiz Completed" />
                        <h2 className='Results'>Results</h2>
                        <h5 className='Score'>You got {score} correct answers</h5>
                        <Button className='Restart' onClick={restartQuiz}>Restart Quiz</Button>
                    </Card.Body>
                </Card>
            }
        </div>
    )
}
export default Quiz
