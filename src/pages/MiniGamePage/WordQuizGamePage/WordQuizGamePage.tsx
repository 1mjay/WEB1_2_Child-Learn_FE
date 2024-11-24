import { useMemo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import  { useWordQuizStore } from '../../../features/minigame/wordquizgame/model/wordQuizStore';

const WordQuizGamePage = () => {
  const { level } = useParams<{ level: 'beginner' | 'medium' | 'advanced' }>();
  const {
    incrementCorrectAnswers,
    decrementLives,
    resetQuiz,
    setLevel,
    setWords,
    lives,
    words,
    currentQuestionIndex,
    nextQuestion,
  } = useWordQuizStore();

  const [timeLeft, setTimeLeft] = useState(60); // 남은 시간
  const [userAnswer, setUserAnswer] = useState<string[]>([]); // 현재 유저 답변
  const [showHint, setShowHint] = useState(false); // 힌트 표시 여부
  const [showCorrectPopup, setShowCorrectPopup] = useState(false); // 정답 팝업 표시 여부
  const [showIncorrectPopup, setShowIncorrectPopup] = useState(false); // 오답 팝업 표시 여부

  const navigate = useNavigate();

  const currentWord = words[currentQuestionIndex]; // 현재 단어
  const correctWord = currentWord?.word || ''; // 정답 단어

  // 키보드 글자 생성
  const alphabet = '가나다라마바사아자차카타파하';
  const keyboardLetters = useMemo(() => {
    if (!correctWord) return [];
    const uniqueLetters = new Set<string>(correctWord.split('')); // 정답 단어의 모든 글자를 추가
    while (uniqueLetters.size < 12) {
      const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
      uniqueLetters.add(randomLetter);
    }
    return Array.from(uniqueLetters).sort(() => Math.random() - 0.5); // 랜덤 섞음
  }, [correctWord]);

  // 초기화: 난이도 설정 및 문제 리스트
  useEffect(() => {
    resetQuiz(); // 퀴즈 초기화
    setLevel(level || 'beginner'); // 난이도 설정
    setWords([
      { word_id: 1, word: '시장', explanation: '기업의 주식 발행 가격 총액을 뜻하는 단어', hint: '첫 글자는 "시"입니다.' },
      { word_id: 2, word: '경제', explanation: '사람들의 재화와 서비스 교환에 대한 활동을 뜻하는 단어', hint: '첫 글자는 "경"입니다.' },
      { word_id: 3, word: '투자', explanation: '미래의 이익을 기대하며 자산을 구매하는 활동', hint: '첫 글자는 "투"입니다.' },
    ]); // 문제 리스트 설정
  }, [level, resetQuiz, setLevel, setWords]);

  // 타이머 초기화
  useEffect(() => {
    let initialTime = 60;
    if (level === 'medium') initialTime = 40;
    if (level === 'advanced') initialTime = 20;
    setTimeLeft(initialTime);
  }, [level]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          navigate(`/word-quiz/result/${level}`); // 타이머 종료 시 결과 페이지로 이동
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, level]);

  // 키보드 클릭 핸들러
  const handleSelectLetter = (letter: string) => {
    if (!correctWord || userAnswer.length >= correctWord.length) return;

    const updatedAnswer = [...userAnswer, letter];
    setUserAnswer(updatedAnswer);

    if (updatedAnswer.join('') === correctWord) {
      incrementCorrectAnswers(); // 맞춘 문제 증가
      setShowCorrectPopup(true);
    } else if (updatedAnswer.length === correctWord.length) {
      decrementLives(); // 목숨 감소
      setShowIncorrectPopup(true);
    }
  };

  // 다음 문제로 이동
  const handleNextQuestion = () => {
    setShowCorrectPopup(false);
    setShowIncorrectPopup(false);
    setUserAnswer([]);

    if (currentQuestionIndex + 1 < words.length) {
      nextQuestion(); // 다음 문제로 이동
    } else {
      navigate(`/word-quiz/result/${level}`); // 모든 문제를 다 풀었을 때 결과 페이지로 이동
    }
  };

  // 목숨이 0이 되면 결과 페이지로 이동
  useEffect(() => {
    if (lives === 0) {
      navigate(`/word-quiz/result/${level}`);
    }
  }, [lives, level, navigate]);

  const handleCloseIncorrectPopup = () => {
    setShowIncorrectPopup(false);
    setUserAnswer([]);
  };

  return (
    <PageContainer>
       <BackgroundContainer /> {/* Background 추가 */}
      <Header>
        <LivesContainer>
          {Array.from({ length: 3 }).map((_, index) => (
            <Heart key={index} filled={index < lives} />
          ))}
        </LivesContainer>
        <ProgressContainer>
          {Array.from({ length: words.length }).map((_, index) => (
            <ProgressBar key={index} active={index <= currentQuestionIndex} />
          ))}
        </ProgressContainer>
        <Timer>⏰ {timeLeft < 10 ? `0${timeLeft}` : timeLeft}</Timer>
      </Header>
      <QuestionContainer>
        <QuestionText>{currentWord?.explanation}</QuestionText>
      </QuestionContainer>
      <AnswerContainer>
        {Array.from({ length: correctWord.length }).map((_, index) => (
          <AnswerBox key={index}>{userAnswer[index] || ''}</AnswerBox>
        ))}
      </AnswerContainer>
      <HintIcon onClick={() => setShowHint(true)}>💡</HintIcon>
      {showHint && (
        <Popup>
          <p>{currentWord?.hint}</p>
          <PopupButton onClick={() => setShowHint(false)}>알 것 같아요!</PopupButton>
        </Popup>
      )}
      <Keyboard>
        {keyboardLetters.map((letter, index) => (
          <LetterButton key={index} onClick={() => handleSelectLetter(letter)}>
            {letter}
          </LetterButton>
        ))}
      </Keyboard>
      {showCorrectPopup && (
        <Popup>
          <p>😃 정답!</p>
          <PopupButton onClick={handleNextQuestion}>다음 문제</PopupButton>
        </Popup>
      )}
      {showIncorrectPopup && (
        <Popup>
          <p>😢 오답!</p>
          <PopupButton onClick={handleCloseIncorrectPopup}>다시 도전해보세요!</PopupButton>
        </Popup>
      )}
    </PageContainer>
  );
};

export default WordQuizGamePage;

// Styled Components
const PageContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  padding: 20px;
`;

const BackgroundContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 630px; 
  background-color: #DEf9C4; /* 연두색 배경 */
  z-index: 0; /* 콘텐츠 뒤로 배치 */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 390px;
  height: 40px;
  position: relative; /* 아이콘의 위치 조정 */
`;

const LivesContainer = styled.div`
  display: flex;
  gap: 5px;
  position: absolute;
  top: 10px;
  left: 20px;
`;
interface HeartProps {
  filled: boolean;
}

const Heart = styled.div<HeartProps>`
  width: 20px;
  height: 20px;
  background-color: ${(props) => (props.filled ? 'red' : 'lightgray')};
  clip-path: polygon(50% 0%, 100% 38%, 81% 100%, 50% 81%, 19% 100%, 0% 38%);
`;

const ProgressContainer = styled.div`
  display: flex;
  gap: 5px; /* ProgressBar 간 간격 */
  justify-content: center; /* 중앙 정렬 */
  flex: 1; /* 중앙에서 공간을 최대한 확보 */
  z-index: 1; /* 다른 요소 위에 위치 */
`;

interface ProgressBarProps {
  active: boolean;
}

const ProgressBar = styled.div<ProgressBarProps>`
  width: 60px;
  height: 5px;
  background-color: ${(props) => (props.active ? '#50b498' : '#ccc')};
`;

const Timer = styled.div`
  font-size: 18px;
  font-weight: bold;
  position: absolute;
  top: 10px;
  right: 20px;
`;

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 400px;
  width: 310px; /* 사각형 너비 */
  height: 107px; /* 사각형 높이 */
  background-color: #50B498; /* 배경색 */
  opacity: 0.8;
  border-radius: 15px; /* 둥근 모서리 */
  text-align: center; /* 텍스트 중앙 정렬 */
`;

const QuestionText = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #fff; /* 텍스트 색상 */
  margin: 0; /* 상하 간격 제거 */
  line-height: 1.5; /* 텍스트 줄 간격 */
`;

const AnswerContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
`;

const AnswerBox = styled.div`
  width: 40px;
  height: 40px;
  border: 2px solid #468585;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
`;

const HintIcon = styled.button`
  position: absolute;
  top: 10px;
  right: 10px; /* 화면 중앙에서 약간 오른쪽 */
  transform: translateX(50%);
  cursor: pointer;

  img {
    width: 32px;
    height: 32px;
  }
`;

const Keyboard = styled.div`
  position: absolute;
  top: 680px;
  bottom: 50px; /* 하단에서 50px 간격 */
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6열 */
  gap: 10px;
  justify-content: center;
  padding: 0 20px; /* 키보드 양쪽에 패딩 추가 */
  z-index: 1;
  max-height: 10vh; 
`;

const LetterButton = styled.button`
  width: 50px;
  height: 50px;
  border: none;
  background-color: #468585;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #bbb;
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const PopupButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  border: none;
  background-color: #50b498;
  color: white;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
`;
