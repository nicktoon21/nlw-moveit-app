import { createContext, ReactNode, useEffect, useState } from 'react';
import challenges from '../../challenges.json';
import Cookies from 'js-cookie';
import { LevelUpModal } from '../components/LevelUpModal';

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    experienceToNextLevel: number;
    challengeCompleted: number;
    levelUp: () => void;
    startNewChallenge: () => void;
    completeChallenge: () => void;
    closeLevelupModal: () => void;
    activeChallenge: Challenge;
    resetChallenge: () => void;
}

interface ChallengeProviderProps {
    children: ReactNode;
    level: number;
    currentExperience: number;
    challengeCompleted: number;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengeProvider( {
    children,
    ...rest
}: ChallengeProviderProps) {
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
    const [challengeCompleted, setChallengeCompleted] = useState(rest.challengeCompleted ?? 0);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    useEffect(() => {
        Notification.requestPermission();
    }, [])

    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengeCompleted', String(challengeCompleted));
    }, [level, currentExperience, challengeCompleted]);

    
    function levelUp() {
        setLevel(level + 1)
        setIsLevelUpModalOpen(true);
    };

    function closeLevelupModal(){
        setIsLevelUpModalOpen(false)
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();


        if (Notification.permission === 'granted') {
            new Notification ('Novo desafio ', {
                body: `Valendo ${challenge.amount}xp!`
            });
        };
    };

    function resetChallenge() {
        setActiveChallenge(null)
    };

    function completeChallenge() {
        if (!activeChallenge) {
            return;
        };

        const {amount } = activeChallenge;

        let finalExperience = currentExperience + amount;

         if (finalExperience >=  experienceToNextLevel) {
             finalExperience = finalExperience - experienceToNextLevel;
             levelUp();
         };

         setCurrentExperience(finalExperience);
         setActiveChallenge(null);
         setChallengeCompleted(challengeCompleted + 1);
    };

    return (
        <ChallengesContext.Provider
        value={{
            level,
            currentExperience,
            experienceToNextLevel,
            challengeCompleted,
            levelUp,
            resetChallenge,
            startNewChallenge,
            activeChallenge,
            completeChallenge,
            closeLevelupModal
            
            }}>

            {children}
            {isLevelUpModalOpen && <LevelUpModal/>}
        </ChallengesContext.Provider>
    )
}