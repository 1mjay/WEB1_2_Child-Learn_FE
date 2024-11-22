import { useState } from 'react';
import styled from 'styled-components';

interface AttendanceCardProps {
  title: string;
  onClick?: () => void;
}

export const AttendanceCard = ({ onClick }: AttendanceCardProps) => {
    const [isChecked, setIsChecked] = useState(false);
  
    const handleAttendance = () => {
      setIsChecked(true);
      onClick?.();
    };
  
    return (
      <CardContainer>
        <CardContent>
          <Title $isChecked={isChecked}>  {/* isChecked prop 추가 */}
            {isChecked ? (
              <div className="complete-text">출석 완료!<br/>내일도 잊지 말아요!</div>
            ) : (
              <>
                <div className="main-text">매일 출석하고</div>
                <div className="sub-text">10 Point 받기</div>
              </>
            )}
          </Title>
          {!isChecked && <ActionButton onClick={handleAttendance}>출석하기</ActionButton>}
        </CardContent>
        {!isChecked && <IconImage src="/img/calendar.png" alt="calendar" />}  {/* isChecked일 때 숨김 */}
        {isChecked && <Overlay />}
      </CardContainer>
    );
  };

  const CardContainer = styled.div`
  background-color: #50B498;
  padding: 24px 20px;
  border-radius: 24px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  height: 150px;  // min-height 대신 height로 고정
  box-sizing: border-box;  // padding이 height에 포함되도록
`;

const CardContent = styled.div`
  width: 100%;
  height: 100%;  // min-height 대신 height로 고정
  z-index: 1;
  display: flex;
  flex-direction: column;
  position: relative;  // 자식 요소의 absolute 포지셔닝을 위해
`;

const Title = styled.div<{ $isChecked: boolean }>`
  color: white;
  transition: all 0.3s ease;
  text-align: ${props => props.$isChecked ? 'center' : 'left'};
  ${props => props.$isChecked && `
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    z-index: 3;
  `}

  .complete-text {
    font-size: 16px;
    font-weight: 800;
    line-height: 1.4;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .main-text {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 2px;
  }

  .sub-text {
    font-size: 18px;
    font-weight: 700;
  }
`;

const ActionButton = styled.button`
  background-color: white;
  color: #468585;
  border: none;
  padding: 6px;  // 8px에서 축소
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  margin-top: 30px;  // 40px에서 축소
  transition: opacity 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    opacity: 0.9;
  }
`;

const IconImage = styled.img`
  position: absolute;
  top: 24px;  // 32px에서 축소
  right: 20px;  // 24px에서 축소
  width: 40px;  // 48px에서 축소
  height: 40px;  // 48px에서 축소
  z-index: 1;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);  // 투명도를 0.3에서 0.2로 줄임
  transition: all 0.3s ease;
  z-index: 2;
`;