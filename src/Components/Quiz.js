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
        } else {
            alert("Incorrect answer");
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
        <div className='card'>
            {!quizCompleted && currentQuestion.text ? (
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
                !quizCompleted && (
                    <div>
                        <h2>Start Quiz</h2>
                        <button onClick={generateRandomQuestions}>Start Quiz</button>
                    </div>
                )
            )}
            {quizCompleted && (
                <div>
                    <h2>Quiz Completed! Score: {score}</h2>
                    <button onClick={restartQuiz}>Restart Quiz</button>
                </div>
            )}
        </div>
    )
}
export default Quiz;