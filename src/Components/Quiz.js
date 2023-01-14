import React, { useState, useEffect, useContext } from 'react'
import { DataContext } from './DataProvider';
import axios from 'axios';
import '../Styles/Quiz.css'

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const Quiz = () => {
    const countryData = useContext(DataContext);
    //estado del quiz completado o no completado?
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [CountryData, setCountryData] = useState(countryData);
    const [answer, setAnswer] = useState('');
    // Create state for questions array and score
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
        axios.get('https://restcountries.com/v2/all')
            .then(response => {
                console.log(response.data);
                setCountryData(response.data);
                generateRandomQuestions();
            })
            .catch(error => {
                console.log(error)
            });
    }, []);

    function generateRandomQuestions() {
        // Generar preguntas al azar utilizando los datos de la API
        if (CountryData && CountryData.length) {
            for (let i = 0; i < 4; i++) {
                const randomIndex = Math.floor(Math.random() * CountryData.length);
                const randomCountry = CountryData[randomIndex];
                const question = {
                    text: `What is the capital of ${randomCountry.name}?`,
                    correctAnswer: randomCountry.capital,
                    options: [randomCountry.capital, randomCountry.altSpellings[1], randomCountry.region, randomCountry.subregion]
                }
                questions.push(question);
            }
            setQuestions(questions);
            setCurrentQuestion(questions[0]);
        }

    }
    function handleAnswerSelection(answer) {
        setAnswer(answer);
    }

    function checkAnswer() {
        if (answer === currentQuestion.correctAnswer) {
            setScore(score + 1);
        } 
        // Move to next question
        const currentIndex = questions.findIndex(q => q === currentQuestion);
        if (currentIndex + 1 < questions.length) {
            setCurrentQuestion(questions[currentIndex + 1]);
        } else {
            setQuizCompleted(true);
        }
        setAnswer('');
    }
    function restartQuiz() {
        setQuizCompleted(false);
        setQuestions([]);
        setCurrentQuestion({});
        setAnswer('');
        setScore(0);
        generateRandomQuestions();
    }
    return (
        <div>
            <div className='container'>
                <h3 className='title'>CountryQuiz</h3>
                <img src='https://raw.githubusercontent.com/pipetboy2001/Country-quiz/0ef5f12a857f8e7b88ccba57851213cee3c6bff6/src/Assests/ContryQuiz.svg' alt="Quiz logo" />
            </div>

        <Card className='Card' style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Text>
                    {!quizCompleted && currentQuestion.text ? (
                        <div>
                            <h2 className='Question'>{currentQuestion.text}</h2>
                            {currentQuestion.options.map((option, index) => (
                                <ol>
                                    <li>
                                        <Button variant="light" className='Answer'
                                            key={index}
                                            onClick={() => handleAnswerSelection(option)} >
                                            {option}
                                        </Button>
                                    </li>
                                </ol>
                                    
                                
                            ))}
                            <Button variant="warning" onClick={checkAnswer} >Next</Button>
                        </div>
                    ) : (
                        !quizCompleted && (
                            <div>
                                <h2>Click for Start</h2>
                                    <Button variant="primary" size="lg" active onClick={generateRandomQuestions}>
                                        Start Quiz
                                    </Button>{' '}
                            </div>
                        )
                    )}
                    {quizCompleted && (
                        <div>
                                <img className='WinnerImg' src='https://raw.githubusercontent.com/pipetboy2001/Country-quiz/0ef5f12a857f8e7b88ccba57851213cee3c6bff6/src/Assests/Winners.svg' alt="Quiz Completed" />
                            <h2 className='Results'>Results</h2>
                            <h5 className='Score'>You got {score} correct answers</h5>
                            <button className='Restart' onClick={restartQuiz}>Restart Quiz</button>
                        </div>
                    )}
                </Card.Text>
            </Card.Body>
        </Card>
        </div>
    )
}
export default Quiz;