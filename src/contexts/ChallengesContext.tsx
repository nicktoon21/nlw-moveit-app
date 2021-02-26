import { createContext, ReactNode, useEffect, useState } from 'react';
import challenges from '../../challenges.json';

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
    activeChallenge: Challenge;
    resetChallenge: () => void;
}

interface ChallengeProviderProps {
    children: ReactNode;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengeProvider( {children}: ChallengeProviderProps) {
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengeCompleted, setChallengeCompleted] = useState(0);

    const [activeChallenge, setActiveChallenge] = useState(null);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    useEffect(() => {
        Notification.requestPermission();
    }, [])

    new Audio('/notification.mp3').play()

    function levelUp() {
        setLevel(level + 1)
    };

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

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
            completeChallenge
            }}>

            {children}
        </ChallengesContext.Provider>
    )
}