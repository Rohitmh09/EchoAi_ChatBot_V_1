// ConfettiEffect.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Confetti from 'react-confetti';
import { Box, Text, Button, Alert, AlertIcon } from '@chakra-ui/react';
import { resetConfetti, resetError } from '../Slice/accuracySlice';

const ConfettiEffect = () => {
  const dispatch = useDispatch();
  const { score, showConfetti, showError } = useSelector((state) => state.accuracy);

  const handleOkClick = () => {
    dispatch(resetConfetti());
  };

  const handleRetryClick = () => {
    dispatch(resetError());
  };

  return (
    <>
      {showConfetti && score !== null && (
        <>
          <Confetti className='max-w-[90vw]'/>
          <Box className="bg-gray-100 shadow-lg rounded-lg p-6 text-center">
            <Text className="text-2xl font-bold text-green-500">
              Congratulations! 🎉
            </Text>
            <Text className="mt-2 text-lg">
              Your accuracy score: <span className="font-bold">{score}</span>
            </Text>
            <Button
              className="mt-4 rounded"
              colorScheme='blue'
              onClick={handleOkClick}
            >
              OK
            </Button>
          </Box>
        </>
      )}

      {showError && (
        <Alert status="warning">
          <AlertIcon />
          Please re-submit the test or try again later.
          <Button
            className="ml-4 bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={handleRetryClick}
          >
            Retry
          </Button>
        </Alert>
      )}
    </>
  );
};

export default ConfettiEffect;
