import { useContext } from "react";
import { ChallengesContext } from "../contexts/ChallengesContext";
import styles from "../styles/components/Profile.module.css";

export function Profile() {

    const { level } =  useContext(ChallengesContext)
    return (
        <div className={styles.profileContainer}>
            <img src="https://github.com/nicktoon21.png" alt="Nicolas Aguiar" />
            <div>
                <strong>Nicolas Aguiar</strong>
                <p>
                    <img src="icons/level.svg" alt=""/>
                    Level {level}
                </p>
            </div>
        </div>
    );
}