import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFlipCardStore } from '../../../app/providers/state/zustand/useFlipCardStore';
import { useParams, useNavigate } from 'react-router-dom';

const FlipCardGamePage = () => {
  const { level } = useParams<{ level: 'beginner' | 'medium' | 'advanced' }>();
  const { cards, setCards } = useFlipCardStore();
  const [flippedCards, setFlippedCards] = useState<number[]>([]); // 뒤집힌 카드 상태
  const [timeLeft, setTimeLeft] = useState(3); // 첫 번째 타이머 (3초)
  const [gameTimeLeft, setGameTimeLeft] = useState(30); // 두 번째 타이머 (30초)
  const [gamePhase, setGamePhase] = useState<'memorize' | 'play' | 'end'>('memorize');
  const [matchedCards, setMatchedCards] = useState<number[]>([]); // 매칭 성공 카드
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달 상태
  const [showFailureModal, setShowFailureModal] = useState(false); // 실패 모달 상태
  const navigate = useNavigate();

  useEffect(() => {
    // 초기 카드 데이터 설정
    const defaultCards = {
      beginner: [
        { cardTitle: 'A', cardContent: '내용 A', category: '쉬움' },
        { cardTitle: 'B', cardContent: '내용 B', category: '쉬움' },
        { cardTitle: 'A', cardContent: '내용 A', category: '쉬움' },
        { cardTitle: 'B', cardContent: '내용 B', category: '쉬움' },
        { cardTitle: 'C', cardContent: '내용 C', category: '쉬움' },
        { cardTitle: 'D', cardContent: '내용 D', category: '쉬움' },
        { cardTitle: 'C', cardContent: '내용 C', category: '쉬움' },
        { cardTitle: 'D', cardContent: '내용 D', category: '쉬움' },
      ],
      medium: [
        { cardTitle: 'A', cardContent: '내용 A', category: '보통' },
        { cardTitle: 'B', cardContent: '내용 B', category: '보통' },
        { cardTitle: 'A', cardContent: '내용 A', category: '보통' },
        { cardTitle: 'B', cardContent: '내용 B', category: '보통' },
        { cardTitle: 'C', cardContent: '내용 C', category: '보통' },
        { cardTitle: 'D', cardContent: '내용 D', category: '보통' },
        { cardTitle: 'C', cardContent: '내용 C', category: '보통' },
        { cardTitle: 'D', cardContent: '내용 D', category: '보통' },
        { cardTitle: 'E', cardContent: '내용 E', category: '보통' },
        { cardTitle: 'F', cardContent: '내용 F', category: '보통' },
        { cardTitle: 'E', cardContent: '내용 E', category: '보통' },
        { cardTitle: 'F', cardContent: '내용 F', category: '보통' },
      ],
      advanced: [
        { cardTitle: 'A', cardContent: '내용 A', category: '어려움' },
        { cardTitle: 'B', cardContent: '내용 B', category: '어려움' },
        { cardTitle: 'A', cardContent: '내용 A', category: '어려움' },
        { cardTitle: 'B', cardContent: '내용 B', category: '어려움' },
        { cardTitle: 'C', cardContent: '내용 C', category: '어려움' },
        { cardTitle: 'D', cardContent: '내용 D', category: '어려움' },
        { cardTitle: 'C', cardContent: '내용 C', category: '어려움' },
        { cardTitle: 'D', cardContent: '내용 D', category: '어려움' },
        { cardTitle: 'E', cardContent: '내용 E', category: '어려움' },
        { cardTitle: 'F', cardContent: '내용 F', category: '어려움' },
        { cardTitle: 'E', cardContent: '내용 E', category: '어려움' },
        { cardTitle: 'F', cardContent: '내용 F', category: '어려움' },
        { cardTitle: 'G', cardContent: '내용 G', category: '어려움' },
        { cardTitle: 'H', cardContent: '내용 H', category: '어려움' },
        { cardTitle: 'G', cardContent: '내용 G', category: '어려움' },
        { cardTitle: 'H', cardContent: '내용 H', category: '어려움' },
      ],
    };

    if (level && defaultCards[level]) {
      setCards(level, defaultCards[level]);
    }
  }, [level, setCards]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gamePhase === 'memorize') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGamePhase('play'); // 게임 시작
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gamePhase === 'play') {
      timer = setInterval(() => {
        setGameTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGamePhase('end'); // 게임 종료
            setShowFailureModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gamePhase]);

  useEffect(() => {
    if (matchedCards.length === cards[level!]?.length && gamePhase === 'play') {
      setShowSuccessModal(true);
      setGamePhase('end');
    }
  }, [matchedCards, cards, gamePhase, level]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || matchedCards.includes(index)) return;

    setFlippedCards((prev) => [...prev, index]);

    if (flippedCards.length === 1) {
      const firstIndex = flippedCards[0];
      const firstCard = cards[level!][firstIndex];
      const secondCard = cards[level!][index];

      if (firstCard.cardTitle === secondCard.cardTitle) {
        setMatchedCards((prev) => [...prev, firstIndex, index]);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  return (
    <PageContainer>
      <Header>
        <h1>카드 뒤집기 - {level}</h1>
        {gamePhase === 'memorize' && <Timer>카드를 살펴보세요: {timeLeft}초</Timer>}
        {gamePhase === 'play' && <Timer>남은 시간: {gameTimeLeft}초</Timer>}
      </Header>

      <GameGrid level={level}>
        {cards[level!]?.map((card, index) => (
          <Card
          key={index}
          flipped={
            gamePhase === 'memorize' || flippedCards.includes(index) || matchedCards.includes(index)
          }
          onClick={() => (gamePhase === 'play' ? handleCardClick(index) : null)}
        >
          {gamePhase === 'memorize' || flippedCards.includes(index) || matchedCards.includes(index) ? (
            <CardContent>{card.cardTitle}</CardContent>
          ) : (
            <CardBack />
          )}
        </Card>
        ))}
      </GameGrid>

      {showSuccessModal && (
        <Modal>
          <p>🎉 성공!</p>
          <p>100 Point를 획득하셨습니다!</p>
          <button onClick={() => navigate('/minigame')}>미니게임 페이지로 돌아가기</button>
        </Modal>
      )}

      {showFailureModal && (
        <Modal>
          <p>😢 실패!</p>
          <p>다음에 다시 도전하세요!</p>
          <button onClick={() => navigate('/minigame')}>미니게임 페이지로 돌아가기</button>
        </Modal>
      )}
    </PageContainer>
  );
};

export default FlipCardGamePage;

const PageContainer = styled.div`
  text-align: center;
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Timer = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const GameGrid = styled.div<{ level?: string }>`
  display: grid;
  grid-template-columns: repeat(${(props) => (props.level === 'beginner' ? 2 : props.level === 'medium' ? 3 : 4)}, 1fr);
  grid-template-rows: repeat(4, auto); /* 항상 4행 */
  gap: 10px;
  justify-items: center;
`;

const Card = styled.div<{ flipped: boolean }>`
  width: 80px;
  height: 120px;
  background-color: ${({ flipped }) => (flipped ? '#fff' : '#555')};
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  perspective: 1000px;
  transition: transform 0.5s;
`;

const CardBack = styled.div`
  width: 100%;
  height: 100%;
  background-color: #333;
`;

const CardContent = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  p {
    margin: 10px 0;
  }
  button {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
`;