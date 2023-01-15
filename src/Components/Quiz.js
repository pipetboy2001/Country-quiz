import React, { useState, useEffect } from 'react'
import OptionButton from './OptionButton'
import { Button } from 'react-bootstrap'
import { Card } from 'react-bootstrap'
import axios from 'axios';
import '../Styles/Quiz.css'

const Quiz = () => {
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [CountryData, setCountryData] = useState([]);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [answer, setAnswer] = useState('');
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isCorrect, setIsCorrect] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);


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

    function generateRandomQuestions() {
        setQuestions([]);
        setScore(0);
        for (let i = 0; i < 2; i++) {
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

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (
                i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function checkAnswer() {
        setIsCorrect(selectedOption === questions[currentQuestionIndex].correctAnswer);
        if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
            setScore(score + 1);
        }
        // Move to next question
        if (currentQuestionIndex + 1 < questions.length) {
            setSelectedOption(null);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
        else {
            setQuizCompleted(true);
        }
    }

    function restartQuiz() {
        generateRandomQuestions();
        setQuizCompleted(false);
    }

    function handleAnswerSelection(answer) {
        setIsCorrect(selectedOption === questions[currentQuestionIndex].correctAnswer);
        setSelectedOption(answer);
    }

    return (
        <div>
            <div className='container'>
                <h3 className='title'>CountryQuiz</h3>
                <img className='imgTitle' src='https://raw.githubusercontent.com/pipetboy2001/Country-quiz/0ef5f12a857f8e7b88ccba57851213cee3c6bff6/src/Assests/ContryQuiz.svg' alt="Quiz logo" />
            </div>
            {!quizCompleted && questions.length > 0 &&
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
                                        isCorrect={isCorrect}
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
                        <h5 className='Score'>You got {score}/{questions.length} correct answers</h5>

                        <Button className='Restart' onClick={restartQuiz}>Restart Quiz</Button>
                    </Card.Body>
                </Card>
            }
        </div>
    )
}
export default Quiz
