import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import '../Styles/Quiz.css'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const Quiz = () => {
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [CountryData, setCountryData] = useState([]);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [answer, setAnswer] = useState('');
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [questionTypeIndex, setQuestionTypeIndex] = useState(0);

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

    function generateRandomQuestions() {
        if (CountryData && CountryData.length) {
            setQuestions([]);
            setQuestionTypeIndex(0);
            setScore(0);
            for (let i = 0; i < 4; i++) {
                const randomIndex = Math.floor(Math.random() * CountryData.length);
                const randomCountry = CountryData[randomIndex];
                let question;
                if (questionTypeIndex === 0) {
                    question = {
                        text: `What is the capital of ${randomCountry.name}?`,
                        correctAnswer: randomCountry.capital,
                        options: shuffle([randomCountry.capital, randomCountry.altSpellings[1], randomCountry.region, randomCountry.subregion])
                    }
                } else if (questionTypeIndex === 1) {
                    question = {
                        text: `¿A qué país pertenece esta bandera?`,
                        img: randomCountry.flag,
                        correctAnswer: randomCountry.name,
                        options: shuffle([randomCountry.name, CountryData[(randomIndex + 1) % CountryData.length].name, CountryData[(randomIndex + 2) % CountryData.length].name, CountryData[(randomIndex + 3) % CountryData.length].name])
                    }
                }
                questions.push(question);
                setQuestionTypeIndex(questionTypeIndex + 1);
                if (questionTypeIndex === 2) setQuestionTypeIndex(0);
            }
            setQuestions(questions);
            setCurrentQuestion(questions[0]);
        }
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
        generateRandomQuestions();
        setQuizCompleted(false);
    }

    function handleAnswerSelection(answer) {
        setAnswer(answer);
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
                                {questionTypeIndex === 0 ? (
                                    <div>
                                        {currentQuestion.options.map((option, index) => (
                                            <ol>
                                                <li>
                                                    <Button
                                                        key={index}
                                                        variant='outline-secondary'
                                                        onClick={() => handleAnswerSelection(option)}
                                                    >
                                                        {option}
                                                    </Button>
                                                </li>
                                            </ol>
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        <img src={currentQuestion.img} alt='Flag' />
                                        {currentQuestion.options.map((option, index) => (
                                            <ol>
                                                <li>
                                                    <Button
                                                        key={index}
                                                        variant='outline-secondary'
                                                        onClick={() => handleAnswerSelection(option)}
                                                    >
                                                        {option}
                                                    </Button>
                                                </li>
                                            </ol>
                                        ))}
                                    </div>
                                )}
                                <Button variant='outline-primary' onClick={checkAnswer}>Submit</Button>
                            </div>
                        ) : (
                            <div>
                                {quizCompleted ? (
                                    <div>
                                        <img className='WinnerImg' src='https://raw.githubusercontent.com/pipetboy2001/Country-quiz/0ef5f12a857f8e7b88ccba57851213cee3c6bff6/src/Assests/Winners.svg' alt="Quiz Completed" />
                                        <h2 className='Results'>Results</h2>
                                        <h5 className='Score'>You got {score} correct answers</h5>
                                        <button className='Restart' onClick={restartQuiz}>Restart Quiz</button>
                                    </div>
                                ) : (
                                    <div>
                                        <h2>Click for Start</h2>
                                        <Button variant="primary" size="lg" active onClick={generateRandomQuestions}>
                                            Start Quiz
                                        </Button>{' '}
                                    </div>
                                )}
                            </div>
                        )}
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Quiz;



