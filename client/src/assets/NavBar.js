import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, FormControl, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { motion } from 'framer-motion';

function Home() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showSubmit, setShowSubmit] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/questions')
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
  }, []);

  const handleAnswer = (questionId, choiceId) => {
    setAnswers({ ...answers, [questionId]: choiceId });
  };

  const handleSubmit = () => {
    // Implement your logic to submit the answers and navigate to the results page
  };


  return (
  <>
    <Typography>know yourself</Typography>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'Roboto, sans-serif',
        backgroundColor: '#f5f5f5',
      }}
    >
      {questions.map((question, index) => (
        <Box key={question.id} sx={{ mb: 2, width: '60%', backgroundColor: 'white', padding: '16px', borderRadius: '8px', fontSize: '1.5rem' }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold',
              textAlign: 'left',
            }}
          >
            {`${index + 1}: ${question.question}`}
          </Typography>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FormControl component="fieldset">
              <RadioGroup
                aria-label={`question-${question.id}`}
                name={`question-${question.id}`}
                value={answers[question.id] || ''}
                onChange={event => handleAnswer(question.id, event.target.value)}
              >
                {question.choices.map(choice => (
                  <FormControlLabel
                    key={choice.id}
                    value={choice.id}
                    control={<Radio />}
                    label={choice.body}
                    disabled={showSubmit}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </motion.div>
        </Box>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {showSubmit && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 2, backgroundColor: 'teal', color: 'white' }}
          >
            Submit
          </Button>
        )}
      </motion.div>
    </Box>
</>
  );
}

export default Home;
