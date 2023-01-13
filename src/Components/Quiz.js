import React, { useState, useEffect, useContext } from 'react'
import { DataContext } from './DataProvider';
import axios from 'axios';

const Quiz = () => {
    const countryData = useContext(DataContext);
    //estado del quiz completado o no completado?
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [CountryData, setCountryData] = useState(countryData);
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        axios.get('https://restcountries.com/v2/all')
            .then(response => {
                console.log(response.data);
                setCountryData(response.data);
                generateRandomQuestion();
            })
            .catch(error => {
                console.log(error)
            });
    }, []);

    function generateRandomQuestion() {
        // Generar pregunta al azar utilizando los datos de la API
        const randomIndex = Math.floor(Math.random() * CountryData.length);
        const randomCountry = CountryData[randomIndex];
        const question = {
            text: `What is the capital of ${randomCountry.name.common}?`,
            correctAnswer: randomCountry.capital[0],
            options: [randomCountry.capital[0], randomCountry.altSpellings[1], randomCountry.region, randomCountry.subregion]
        }
        setCurrentQuestion(question);
        console.log(question);
    }
    function handleAnswerSelection(answer) {
        setAnswer(answer);
    }

    function checkAnswer() {
        if (answer === currentQuestion.correctAnswer) {
            setQuizCompleted(true);
        } else {
            alert("Incorrect answer");
        }
    }
    function restartQuiz() {
        setQuizCompleted(false);
        setCurrentQuestion(null);
        setAnswer('');
        generateRandomQuestion();
    }
    return (
        <div className='card'>
            <div>
                <h2>Start Quiz</h2>
                <button onClick={() => {
                    if (!quizCompleted) {
                        axios.get('https://restcountries.com/v2/all')
                            .then(response => {
                                console.log(response.data);
                                setCountryData(response.data);
                                generateRandomQuestion();
                            })
                            .catch(error => {
                                console.log(error)
                            });
                    } else {
                        restartQuiz();
                    }
                }}>Start/Restart Quiz</button>
            </div>
            {countryData.length && !quizCompleted && currentQuestion.text ? (
                <div>
                    <h2>{currentQuestion.text}</h2>
                    {currentQuestion.options.map((option, index) => (
                        <button key={index} onClick={() => handleAnswerSelection(option)}>
                            {option}
                        </button>
                    ))}
                    <button onClick={checkAnswer}>Submit</button>
                </div>
            ) : (
                quizCompleted && (
                    <div>
                        <h2>Quiz Completed!</h2>
                    </div>
                )
            )}
            {!quizCompleted && !currentQuestion.text && (
                <div>
                    <h2>Loading questions...</h2>
                </div>
            )}
        </div>
    )
}
export default Quiz;